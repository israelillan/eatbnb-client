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
import tableReducer from "./table.reducer";
import {signInStart, signInSuccess, signOutStart} from "../user/user.actions";
import {onSignInStart, onSignOutStart} from "../user/user.sagas";

const mockUser = {
    email: 'testTables@eatbnb.com',
    managerName: 'Test Tables'
};

describe('logged out table tests', () => {
    beforeEach(signOutMockUser);

    it('cannot create a table', async () => {
        const {finalState} = await testSaga(INITIAL_STATE, tableReducer, createTableStart(0, 0, 1), onCreateTableStart());

        expect(finalState.error).toBeTruthy();
        expect(finalState.tables).toEqual([]);
    });
});

const deleteAllUserTables = async () => {
    await signInMockUser(mockUser);
    const query = new Parse.Query('Table');
    const tables = await query.find();
    for (const t in tables) {
        await tables[t].destroy();
    }
};

describe('signed it table tests', () => {
    beforeAll(async () => await signUpMockUser(mockUser));
    afterEach(deleteAllUserTables);
    afterAll(async () => await cleanMockUser(mockUser));

    it('create a table', async () => {
        const {finalState} = await testSaga(INITIAL_STATE, tableReducer, createTableStart(0, 0, 1), onCreateTableStart());

        expect(finalState.error).toBeFalsy();
        expect(finalState.tables.length).toEqual(1);
        expect(finalState.tables[0].id).toBeTruthy();
        expect(finalState.tables[0].reference).toBeTruthy();
        expect(finalState.tables[0].user.id).toEqual(Parse.User.current().id);
        expect(finalState.tables[0].x).toEqual(0);
        expect(finalState.tables[0].y).toEqual(0);
        expect(finalState.tables[0].seats).toEqual(1);
    });
    it('update table', async () => {
        const tableCreationSagaResult = await testSaga(INITIAL_STATE, tableReducer, createTableStart(0, 0, 1), onCreateTableStart());

        const {finalState} = await testSaga(tableCreationSagaResult.finalState, tableReducer,
            updateTableStart(tableCreationSagaResult.finalState.tables[0], 1, 1, 2), onUpdateTableStart());

        expect(finalState.error).toBeFalsy();
        expect(finalState.tables.length).toEqual(1);
        expect(finalState.tables[0].id).toEqual(tableCreationSagaResult.finalState.tables[0].id);
        expect(finalState.tables[0].reference).toEqual(tableCreationSagaResult.finalState.tables[0].reference);
        expect(finalState.tables[0].user.id).toEqual(Parse.User.current().id);
        expect(finalState.tables[0].x).toEqual(1);
        expect(finalState.tables[0].y).toEqual(1);
        expect(finalState.tables[0].seats).toEqual(2);
    });
    it('delete table', async () => {
        const tableCreationSagaResult = await testSaga(INITIAL_STATE, tableReducer, createTableStart(0, 0, 1), onCreateTableStart());

        const {finalState} = await testSaga(tableCreationSagaResult.finalState, tableReducer,
            deleteTableStart(tableCreationSagaResult.finalState.tables[0]), onDeleteTableStart());

        expect(finalState.error).toBeFalsy();
        expect(finalState.tables.length).toEqual(0);
    });
    it('clear tables on user sign out', async () => {
        const tableCreationSagaResult = await testSaga(INITIAL_STATE, tableReducer, createTableStart(0, 0, 1), onCreateTableStart());
        const {finalState} = await testSaga(tableCreationSagaResult.finalState, tableReducer, signOutStart(), onSignOutStart());

        expect(finalState.error).toBeFalsy();
        expect(finalState.tables.length).toEqual(0);
    });
    it('read tables on user sign in', async () => {
        const tableCreationSagaResult = await testSaga(INITIAL_STATE, tableReducer, createTableStart(0, 0, 1), onCreateTableStart());
        const logoutSagaResult = await testSaga(tableCreationSagaResult.finalState, tableReducer, signOutStart(), onSignOutStart());
        const signInResult = await testSaga(logoutSagaResult.finalState, tableReducer, signInStart(mockUser.email, mockUserPassword), onSignInStart());
        const {finalState} = await testSaga(signInResult.finalState, tableReducer, signInSuccess(mockUser), onSignInSuccess());

        expect(finalState.error).toBeFalsy();
        expect(finalState.tables.length).toEqual(1);
        expect(finalState.tables[0].id).toBeTruthy();
        expect(finalState.tables[0].reference).toBeTruthy();
        expect(finalState.tables[0].user.id).toEqual(Parse.User.current().id);
        expect(finalState.tables[0].x).toEqual(0);
        expect(finalState.tables[0].y).toEqual(0);
        expect(finalState.tables[0].seats).toEqual(1);
    });
    it('cannot create a table outside the layout (-1,0)', async () => {
        const {finalState} = await testSaga(INITIAL_STATE, tableReducer, createTableStart(-1, 0, 1), onCreateTableStart());

        expect(finalState.error).toBeTruthy();
        expect(finalState.tables.length).toEqual(0);
    });
    it('cannot create a table outside the layout (0,-1)', async () => {
        const {finalState} = await testSaga(INITIAL_STATE, tableReducer, createTableStart(0, -1, 1), onCreateTableStart());

        expect(finalState.error).toBeTruthy();
        expect(finalState.tables.length).toEqual(0);
    });
    it('cannot create a table outside the layout (15,0)', async () => {
        const {finalState} = await testSaga(INITIAL_STATE, tableReducer, createTableStart(15, 0, 1), onCreateTableStart());

        expect(finalState.error).toBeTruthy();
        expect(finalState.tables.length).toEqual(0);
    });
    it('cannot create a table outside the layout (0,10)', async () => {
        const {finalState} = await testSaga(INITIAL_STATE, tableReducer, createTableStart(0, 10, 1), onCreateTableStart());

        expect(finalState.error).toBeTruthy();
        expect(finalState.tables.length).toEqual(0);
    });
    it('cannot create a table with seats < 1', async () => {
        const {finalState} = await testSaga(INITIAL_STATE, tableReducer, createTableStart(0, 0, 0), onCreateTableStart());

        expect(finalState.error).toBeTruthy();
        expect(finalState.tables.length).toEqual(0);
    });
    it('cannot create a table where another already exists', async () => {
        const tableCreationSagaResult = await testSaga(INITIAL_STATE, tableReducer, createTableStart(0, 0, 1), onCreateTableStart());
        const {finalState} = await testSaga(tableCreationSagaResult.finalState, tableReducer, createTableStart(0, 0, 1), onCreateTableStart());

        expect(finalState.error).toBeTruthy();
        expect(finalState.tables.length).toEqual(1);
    });
    it('cannot move a table outside the layout (-1,0)', async () => {
        const tableCreationSagaResult = await testSaga(INITIAL_STATE, tableReducer, createTableStart(0, 0, 1), onCreateTableStart());
        const {finalState} = await testSaga(tableCreationSagaResult.finalState, tableReducer, updateTableStart(-1, 0, 1), onUpdateTableStart());


        expect(finalState.error).toBeTruthy();
        expect(finalState.tables.length).toEqual(1);
        expect(finalState.tables[0].x).toEqual(0);
        expect(finalState.tables[0].y).toEqual(0);
        expect(finalState.tables[0].seats).toEqual(1);
    });
    it('cannot move a table outside the layout (0,-1)', async () => {
        const tableCreationSagaResult = await testSaga(INITIAL_STATE, tableReducer, createTableStart(0, 0, 1), onCreateTableStart());
        const {finalState} = await testSaga(tableCreationSagaResult.finalState, tableReducer, updateTableStart(0, -1, 1), onUpdateTableStart());


        expect(finalState.error).toBeTruthy();
        expect(finalState.tables.length).toEqual(1);
        expect(finalState.tables[0].x).toEqual(0);
        expect(finalState.tables[0].y).toEqual(0);
        expect(finalState.tables[0].seats).toEqual(1);
    });
    it('cannot move a table outside the layout (15,0)', async () => {
        const tableCreationSagaResult = await testSaga(INITIAL_STATE, tableReducer, createTableStart(0, 0, 1), onCreateTableStart());
        const {finalState} = await testSaga(tableCreationSagaResult.finalState, tableReducer, updateTableStart(15, 0, 1), onUpdateTableStart());


        expect(finalState.error).toBeTruthy();
        expect(finalState.tables.length).toEqual(1);
        expect(finalState.tables[0].x).toEqual(0);
        expect(finalState.tables[0].y).toEqual(0);
        expect(finalState.tables[0].seats).toEqual(1);
    });
    it('cannot move a table outside the layout (0,10)', async () => {
        const tableCreationSagaResult = await testSaga(INITIAL_STATE, tableReducer, createTableStart(0, 0, 1), onCreateTableStart());
        const {finalState} = await testSaga(tableCreationSagaResult.finalState, tableReducer, updateTableStart(0, 10, 1), onUpdateTableStart());


        expect(finalState.error).toBeTruthy();
        expect(finalState.tables.length).toEqual(1);
        expect(finalState.tables[0].x).toEqual(0);
        expect(finalState.tables[0].y).toEqual(0);
        expect(finalState.tables[0].seats).toEqual(1);
    });
    it('cannot update a table with seats < 1', async () => {
        const tableCreationSagaResult = await testSaga(INITIAL_STATE, tableReducer, createTableStart(0, 0, 1), onCreateTableStart());
        const {finalState} = await testSaga(tableCreationSagaResult.finalState, tableReducer, updateTableStart(0, 0, 0), onUpdateTableStart());


        expect(finalState.error).toBeTruthy();
        expect(finalState.tables.length).toEqual(1);
        expect(finalState.tables[0].x).toEqual(0);
        expect(finalState.tables[0].y).toEqual(0);
        expect(finalState.tables[0].seats).toEqual(1);
    });
    it('cannot move a table where another already exists', async () => {
        const existingtableCreationSagaResult = await testSaga(INITIAL_STATE, tableReducer, createTableStart(0, 0, 1), onCreateTableStart());
        const tableCreationSagaResult = await testSaga(existingtableCreationSagaResult.finalState, tableReducer, createTableStart(1, 1, 2), onCreateTableStart());
        const {finalState} = await testSaga(tableCreationSagaResult.finalState, tableReducer, updateTableStart(0, 0, 1), onUpdateTableStart());

        expect(finalState.error).toBeTruthy();
        expect(finalState.tables.length).toEqual(2);
        expect(finalState.tables[0].x).toEqual(0);
        expect(finalState.tables[0].y).toEqual(0);
        expect(finalState.tables[0].seats).toEqual(1);
        expect(finalState.tables[1].x).toEqual(1);
        expect(finalState.tables[1].y).toEqual(1);
        expect(finalState.tables[1].seats).toEqual(2);
    });
});

//     it('cannot read other user\'s tables', async => {
//
//     });
//     it('cannot modify other user\'s tables', async => {
//
//     });
//     it('cannot delete other user\'s tables', async => {
//
//     });
