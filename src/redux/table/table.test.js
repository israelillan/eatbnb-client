import Parse from "../../backend/parse.utils";
import {
    cleanMockUser,
    mockUserPassword,
    signInMockUser,
    signOutMockUser,
    signUpMockUser,
    testSaga
} from "../../tests/tests.utils";
import INITIAL_STATE from "./table.state";
import {createTableStart, deleteTableStart, updateTableStart} from "./table.actions";
import {onCreateTableStart, onDeleteTableStart, onSignInSuccess, onUpdateTableStart} from "./table.sagas";
import {signInStart, signInSuccess, signOutStart} from "../user/user.actions";
import {onSignInStart, onSignOutStart} from "../user/user.sagas";
import {tableFromBackendObject} from "./table.utils";

describe('logged out table tests', () => {
    beforeEach(signOutMockUser);

    it('cannot create a table', async () => {
        const {finalState} = await testSaga({table: INITIAL_STATE}, createTableStart(0, 0, 1), onCreateTableStart());

        expect(finalState.backend.error).toBeTruthy();
        expect(finalState.table.tables).toEqual([]);
    });
});

const deleteAllUserTables = async (mockUser) => {
    await signInMockUser(mockUser);
    const query = new Parse.Query('Table');
    const tables = await query.find();
    for (const table of tables) {
        await table.destroy();
    }
};

describe('signed in table tests', () => {
    const mockUser = {
        email: 'testTables_single@eatbnb.com',
        managerName: 'Test Tables'
    };

    beforeAll(async () => await signUpMockUser(mockUser));
    afterEach(async () => await deleteAllUserTables(mockUser));
    afterAll(async () => await cleanMockUser(mockUser));

    it('create a table', async () => {
        const {finalState} = await testSaga({table: INITIAL_STATE}, createTableStart(0, 0, 1), onCreateTableStart());

        expect(finalState.backend.error).toBeFalsy();
        expect(finalState.table.tables.length).toEqual(1);
        expect(finalState.table.tables[0].backendObject).toBeTruthy();
        expect(finalState.table.tables[0].reference).toBeTruthy();
        expect(finalState.table.tables[0].user.id).toEqual(Parse.User.current().id);
        expect(finalState.table.tables[0].x).toEqual(0);
        expect(finalState.table.tables[0].y).toEqual(0);
        expect(finalState.table.tables[0].seats).toEqual(1);
    });
    it('update table', async () => {
        const tableCreationSagaResult = await testSaga({table: INITIAL_STATE}, createTableStart(0, 0, 1), onCreateTableStart());

        const {finalState} = await testSaga(tableCreationSagaResult.finalState,
            updateTableStart(tableCreationSagaResult.finalState.table.tables[0], 1, 1, 2), onUpdateTableStart());

        expect(finalState.backend.error).toBeFalsy();
        expect(finalState.table.tables.length).toEqual(1);
        expect(finalState.table.tables[0].backendObject.id).toEqual(tableCreationSagaResult.finalState.table.tables[0].backendObject.id);
        expect(finalState.table.tables[0].reference).toEqual(tableCreationSagaResult.finalState.table.tables[0].reference);
        expect(finalState.table.tables[0].user.id).toEqual(Parse.User.current().id);
        expect(finalState.table.tables[0].x).toEqual(1);
        expect(finalState.table.tables[0].y).toEqual(1);
        expect(finalState.table.tables[0].seats).toEqual(2);
    });
    it('delete table', async () => {
        const tableCreationSagaResult = await testSaga({table: INITIAL_STATE}, createTableStart(0, 0, 1), onCreateTableStart());

        const {finalState} = await testSaga(tableCreationSagaResult.finalState,
            deleteTableStart(tableCreationSagaResult.finalState.table.tables[0]), onDeleteTableStart());

        expect(finalState.backend.error).toBeFalsy();
        expect(finalState.table.tables.length).toEqual(0);
    });
    it('clear tables on user sign out', async () => {
        const tableCreationSagaResult = await testSaga({table: INITIAL_STATE}, createTableStart(0, 0, 1), onCreateTableStart());
        const {finalState} = await testSaga(tableCreationSagaResult.finalState, signOutStart(), onSignOutStart());

        expect(finalState.backend.error).toBeFalsy();
        expect(finalState.table.tables.length).toEqual(0);
    });
    it('read tables on user sign in', async () => {
        const tableCreationSagaResult = await testSaga({table: INITIAL_STATE}, createTableStart(0, 0, 1), onCreateTableStart());
        const logoutSagaResult = await testSaga(tableCreationSagaResult.finalState, signOutStart(), onSignOutStart());
        const signInResult = await testSaga(logoutSagaResult.finalState, signInStart(mockUser.email, mockUserPassword), onSignInStart());
        const {finalState} = await testSaga(signInResult.finalState, signInSuccess(mockUser), onSignInSuccess());

        expect(finalState.backend.error).toBeFalsy();
        expect(finalState.table.tables.length).toEqual(1);
        expect(finalState.table.tables[0].backendObject).toBeTruthy();
        expect(finalState.table.tables[0].reference).toBeTruthy();
        expect(finalState.table.tables[0].user.id).toEqual(Parse.User.current().id);
        expect(finalState.table.tables[0].x).toEqual(0);
        expect(finalState.table.tables[0].y).toEqual(0);
        expect(finalState.table.tables[0].seats).toEqual(1);
    });
    it('cannot create a table outside the layout (-1,0)', async () => {
        const {finalState} = await testSaga({table: INITIAL_STATE}, createTableStart(-1, 0, 1), onCreateTableStart());

        expect(finalState.backend.error).toBeTruthy();
        expect(finalState.table.tables.length).toEqual(0);
    });
    it('cannot create a table outside the layout (0,-1)', async () => {
        const {finalState} = await testSaga({table: INITIAL_STATE}, createTableStart(0, -1, 1), onCreateTableStart());

        expect(finalState.backend.error).toBeTruthy();
        expect(finalState.table.tables.length).toEqual(0);
    });
    it('cannot create a table outside the layout (15,0)', async () => {
        const {finalState} = await testSaga({table: INITIAL_STATE}, createTableStart(15, 0, 1), onCreateTableStart());

        expect(finalState.backend.error).toBeTruthy();
        expect(finalState.table.tables.length).toEqual(0);
    });
    it('cannot create a table outside the layout (0,10)', async () => {
        const {finalState} = await testSaga({table: INITIAL_STATE}, createTableStart(0, 10, 1), onCreateTableStart());

        expect(finalState.backend.error).toBeTruthy();
        expect(finalState.table.tables.length).toEqual(0);
    });
    it('cannot create a table with seats < 1', async () => {
        const {finalState} = await testSaga({table: INITIAL_STATE}, createTableStart(0, 0, 0), onCreateTableStart());

        expect(finalState.backend.error).toBeTruthy();
        expect(finalState.table.tables.length).toEqual(0);
    });
    it('cannot create a table where another already exists', async () => {
        const tableCreationSagaResult = await testSaga({table: INITIAL_STATE}, createTableStart(0, 0, 1), onCreateTableStart());
        const {finalState} = await testSaga(tableCreationSagaResult.finalState, createTableStart(0, 0, 1), onCreateTableStart());

        expect(finalState.backend.error).toBeTruthy();
        expect(finalState.table.tables.length).toEqual(1);
    });
    it('cannot move a table outside the layout (-1,0)', async () => {
        const tableCreationSagaResult = await testSaga({table: INITIAL_STATE}, createTableStart(0, 0, 1), onCreateTableStart());
        const {finalState} = await testSaga(tableCreationSagaResult.finalState, updateTableStart(-1, 0, 1), onUpdateTableStart());

        expect(finalState.backend.error).toBeTruthy();
        expect(finalState.table.tables.length).toEqual(1);
        expect(finalState.table.tables[0].x).toEqual(0);
        expect(finalState.table.tables[0].y).toEqual(0);
        expect(finalState.table.tables[0].seats).toEqual(1);
    });
    it('cannot move a table outside the layout (0,-1)', async () => {
        const tableCreationSagaResult = await testSaga({table: INITIAL_STATE}, createTableStart(0, 0, 1), onCreateTableStart());
        const {finalState} = await testSaga(tableCreationSagaResult.finalState, updateTableStart(0, -1, 1), onUpdateTableStart());


        expect(finalState.backend.error).toBeTruthy();
        expect(finalState.table.tables.length).toEqual(1);
        expect(finalState.table.tables[0].x).toEqual(0);
        expect(finalState.table.tables[0].y).toEqual(0);
        expect(finalState.table.tables[0].seats).toEqual(1);
    });
    it('cannot move a table outside the layout (15,0)', async () => {
        const tableCreationSagaResult = await testSaga({table: INITIAL_STATE}, createTableStart(0, 0, 1), onCreateTableStart());
        const {finalState} = await testSaga(tableCreationSagaResult.finalState, updateTableStart(15, 0, 1), onUpdateTableStart());


        expect(finalState.backend.error).toBeTruthy();
        expect(finalState.table.tables.length).toEqual(1);
        expect(finalState.table.tables[0].x).toEqual(0);
        expect(finalState.table.tables[0].y).toEqual(0);
        expect(finalState.table.tables[0].seats).toEqual(1);
    });
    it('cannot move a table outside the layout (0,10)', async () => {
        const tableCreationSagaResult = await testSaga({table: INITIAL_STATE}, createTableStart(0, 0, 1), onCreateTableStart());
        const {finalState} = await testSaga(tableCreationSagaResult.finalState, updateTableStart(0, 10, 1), onUpdateTableStart());


        expect(finalState.backend.error).toBeTruthy();
        expect(finalState.table.tables.length).toEqual(1);
        expect(finalState.table.tables[0].x).toEqual(0);
        expect(finalState.table.tables[0].y).toEqual(0);
        expect(finalState.table.tables[0].seats).toEqual(1);
    });
    it('cannot update a table with seats < 1', async () => {
        const tableCreationSagaResult = await testSaga({table: INITIAL_STATE}, createTableStart(0, 0, 1), onCreateTableStart());
        const {finalState} = await testSaga(tableCreationSagaResult.finalState, updateTableStart(0, 0, 0), onUpdateTableStart());


        expect(finalState.backend.error).toBeTruthy();
        expect(finalState.table.tables.length).toEqual(1);
        expect(finalState.table.tables[0].x).toEqual(0);
        expect(finalState.table.tables[0].y).toEqual(0);
        expect(finalState.table.tables[0].seats).toEqual(1);
    });
    it('cannot move a table where another already exists', async () => {
        const existingtableCreationSagaResult = await testSaga({table: INITIAL_STATE}, createTableStart(0, 0, 1), onCreateTableStart());
        const tableCreationSagaResult = await testSaga(existingtableCreationSagaResult.finalState, createTableStart(1, 1, 2), onCreateTableStart());
        const {finalState} = await testSaga(tableCreationSagaResult.finalState, updateTableStart(0, 0, 1), onUpdateTableStart());

        expect(finalState.backend.error).toBeTruthy();
        expect(finalState.table.tables.length).toEqual(2);
        expect(finalState.table.tables[0].x).toEqual(0);
        expect(finalState.table.tables[0].y).toEqual(0);
        expect(finalState.table.tables[0].seats).toEqual(1);
        expect(finalState.table.tables[1].x).toEqual(1);
        expect(finalState.table.tables[1].y).toEqual(1);
        expect(finalState.table.tables[1].seats).toEqual(2);
    });
    it('get all 150 tables', async () => {
        const tables = [];
        for (let i= 0; i< 15; i++) {
            for (let j= 0; j< 10; j++) {
                const table = new Parse.Object('Table');
                table.set('x', i);
                table.set('y', j);
                table.set('seats', 1);
                tables.push(table);
            }
        }
        await Parse.Object.saveAll(tables);

        const logoutSagaResult = await testSaga({table: INITIAL_STATE}, signOutStart(), onSignOutStart());
        const signInResult = await testSaga(logoutSagaResult.finalState, signInStart(mockUser.email, mockUserPassword), onSignInStart());
        const {finalState} = await testSaga(signInResult.finalState, signInSuccess(mockUser), onSignInSuccess());

        expect(finalState.backend.error).toBeFalsy();
        expect(finalState.table.tables.length).toEqual(150);
    });
});

describe('signed in table tests against other user', () => {
    const oneMockUser = {
        email: 'testTables_1@eatbnb.com',
        managerName: 'Test Tables'
    };
    const otherMockUser = {
        email: 'testTables_2@eatbnb.com',
        managerName: 'Test Tables'
    };

    let otherUserTable;
    beforeAll(async () => {
        await signUpMockUser(otherMockUser);

        const table = new Parse.Object('Table');
        table.set('x', 0);
        table.set('y', 0);
        table.set('seats', 1);
        const result = await table.save();
        otherUserTable = tableFromBackendObject(result);

        await signUpMockUser(oneMockUser);
    });
    afterAll(async () =>
    {
        await cleanMockUser(oneMockUser);
        await cleanMockUser(otherMockUser);
    });

    it('cannot modify other user\'s tables', async () => {
        const {finalState} = await testSaga({table: INITIAL_STATE},
            updateTableStart(otherUserTable, 1, 1, 2), onUpdateTableStart());

        expect(finalState.backend.error).toBeTruthy();
    });
    it('cannot delete other user\'s tables', async () => {
        const {finalState} = await testSaga({table: INITIAL_STATE},
            deleteTableStart(otherUserTable), onDeleteTableStart());

        expect(finalState.backend.error).toBeTruthy();
    });
});
