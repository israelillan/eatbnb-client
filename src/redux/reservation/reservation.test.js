import {cleanMockUser, signInMockUser, signUpMockUser, testSaga} from "../../tests/tests.utils";
import INITIAL_STATE from './reservation.state';
import {
    createReservationStart,
    deleteReservationStart,
    getReservationsStart,
    updateReservationStart
} from "./reservation.actions";
import reservationReducer from "./reservation.reducer";
import {
    onCreateReservationStart,
    onDeleteReservationStart,
    onGetReservationsStart,
    onUpdateReservationStart
} from "./reservation.sagas";
import Parse from "../../backend/parse.utils";
import {signOutStart} from "../user/user.actions";
import {onSignOutStart} from "../user/user.sagas";

const createTable = async (x, y) => {
    const table = new Parse.Object('Table');
    table.set('x', x);
    table.set('y', y);
    table.set('seats', 1);
    const result = await table.save();

    return {backendObject: result, ...result.attributes}
};

const deleteAllUserReservations = async (mockUser) => {
    await signInMockUser(mockUser);
    const query = new Parse.Query('Reservation');
    const reservations = await query.find();
    for (const t in reservations) {
        // noinspection JSUnfilteredForInLoop
        await reservations[t].destroy();
    }
};

describe('signed it reservation tests', () => {
    const mockUser = {
        email: 'testReservations_single@eatbnb.com',
        managerName: 'Test Reservations'
    };
    const customerName = "Customer name";
    const customerPhone = "000000000";

    let table;
    let anotherTable;
    beforeAll(async () => {
        await signUpMockUser(mockUser);
        table = await createTable(0, 0);
        anotherTable = await createTable(0, 1);
    });
    afterEach(async () => await deleteAllUserReservations(mockUser));
    afterAll(async () => await cleanMockUser(mockUser));

    it('create a reservation', async () => {
        const reservationDate = new Date(2021, 1, 1, 0, 0);

        const {finalState} = await testSaga(INITIAL_STATE, reservationReducer,
            createReservationStart(table, reservationDate, customerName, customerPhone),
            onCreateReservationStart());

        expect(finalState.reservations.length).toEqual(1);
        expect(finalState.reservations[0].backendObject).toBeTruthy();
        expect(finalState.reservations[0].table.backendObject.id).toEqual(table.backendObject.id);
        expect(finalState.reservations[0].dateAndTime).toEqual(reservationDate);
        expect(finalState.reservations[0].customerName).toEqual(customerName);
        expect(finalState.reservations[0].customerPhone).toEqual(customerPhone);
    });
    it('creating a reservation must be at the beginning of the hour', async () => {
        const reservationDate = new Date(2021, 1, 2, 0, 22);
        const expectedReservationDate = new Date(2021, 1, 2, 0, 0);

        const {finalState} = await testSaga(INITIAL_STATE, reservationReducer,
            createReservationStart(table, reservationDate, customerName, customerPhone),
            onCreateReservationStart());

        expect(finalState.error).toBeFalsy();
        expect(finalState.reservations.length).toEqual(1);
        expect(finalState.reservations[0].backendObject).toBeTruthy();
        expect(finalState.reservations[0].table.backendObject.id).toEqual(table.backendObject.id);
        expect(finalState.reservations[0].dateAndTime).toEqual(expectedReservationDate);
        expect(finalState.reservations[0].customerName).toEqual(customerName);
        expect(finalState.reservations[0].customerPhone).toEqual(customerPhone);
    });
    it('update a reservation', async () => {
        const initialReservationDate = new Date(2021, 1, 3, 2, 0);
        const finalReservationDate = new Date(2021, 1, 3, 3, 0);

        const reservationCreationSagaResult = await testSaga(INITIAL_STATE, reservationReducer,
            createReservationStart(table, initialReservationDate, customerName, customerPhone),
            onCreateReservationStart());

        const {finalState} = await testSaga(reservationCreationSagaResult.finalState,
            reservationReducer,
            updateReservationStart(reservationCreationSagaResult.finalState.reservations[0],
                anotherTable, finalReservationDate,
                customerName + "_final",
                customerPhone + "_final"),
            onUpdateReservationStart());

        expect(finalState.error).toBeFalsy();
        expect(finalState.reservations.length).toEqual(1);
        expect(finalState.reservations[0].backendObject).toBeTruthy();
        expect(finalState.reservations[0].table.backendObject.id).toEqual(anotherTable.backendObject.id);
        expect(finalState.reservations[0].dateAndTime).toEqual(finalReservationDate);
        expect(finalState.reservations[0].customerName).toEqual(customerName + "_final");
        expect(finalState.reservations[0].customerPhone).toEqual(customerPhone + "_final");
    });
    it('updating  a reservation must be at the beginning of the hour', async () => {
        const initialReservationDate = new Date(2021, 1, 3, 4, 0);
        const finalReservationDate = new Date(2021, 1, 3, 5, 33);
        const expectedFinalReservationDate = new Date(2021, 1, 3, 5, 0);

        const reservationCreationSagaResult = await testSaga(INITIAL_STATE, reservationReducer,
            createReservationStart(table, initialReservationDate, customerName, customerPhone),
            onCreateReservationStart());

        expect(reservationCreationSagaResult.finalState.reservations[0].dateAndTime).toEqual(initialReservationDate);

        const {finalState} = await testSaga(reservationCreationSagaResult.finalState,
            reservationReducer,
            updateReservationStart(reservationCreationSagaResult.finalState.reservations[0],
                anotherTable, finalReservationDate,
                customerName + "_final",
                customerPhone + "_final"),
            onUpdateReservationStart());

        expect(finalState.error).toBeFalsy();
        expect(finalState.reservations.length).toEqual(1);
        expect(finalState.reservations[0].backendObject).toBeTruthy();
        expect(finalState.reservations[0].table.backendObject.id).toEqual(anotherTable.backendObject.id);
        expect(finalState.reservations[0].dateAndTime).toEqual(expectedFinalReservationDate);
        expect(finalState.reservations[0].customerName).toEqual(customerName + "_final");
        expect(finalState.reservations[0].customerPhone).toEqual(customerPhone + "_final");
    });
    it('delete a reservation', async () => {
        const reservationCreationSagaResult = await testSaga(INITIAL_STATE, reservationReducer,
            createReservationStart(table, new Date(2021, 1, 4, 0, 0),
                "Customer name", "000000000"),
            onCreateReservationStart());

        const {finalState} = await testSaga(reservationCreationSagaResult.finalState,
            reservationReducer,
            deleteReservationStart(reservationCreationSagaResult.finalState.reservations[0]),
            onDeleteReservationStart());

        expect(finalState.error).toBeFalsy();
        expect(finalState.reservations.length).toEqual(0);
    });
    it('clear reservations on sign out', async () => {
        const reservationCreationSagaResult = await testSaga(INITIAL_STATE, reservationReducer,
            createReservationStart(table, new Date(2021, 1, 5, 0, 0),
                "Customer name", "000000000"),
            onCreateReservationStart());
        const {finalState} = await testSaga(reservationCreationSagaResult.finalState, reservationReducer, signOutStart(), onSignOutStart());

        expect(finalState.error).toBeFalsy();
        expect(finalState.reservations.length).toEqual(0);
    });
    it('read reservations paginated', async () => {
        const initialReservationDate = new Date(2021, 1, 6, 0, 0);

        const reservations = [];
        for (let i= 0; i< 150; i++) {
            const reservation = new Parse.Object('Reservation');
            reservation.set('table', table.backendObject);
            const dateAndTime = new Date(initialReservationDate.setHours(initialReservationDate.getHours() + i));
            reservation.set('dateAndTime', dateAndTime);
            reservation.set('customerName', customerName);
            reservation.set('customerPhone', customerPhone);
            reservations.push(reservation);
        }
        await Parse.Object.saveAll(reservations);

        const {finalState: initial100State} = await testSaga(INITIAL_STATE, reservationReducer,
            getReservationsStart(table), onGetReservationsStart());

        expect(initial100State.error).toBeFalsy();
        expect(initial100State.reservations.length).toEqual(100);

        const {finalState} = await testSaga(initial100State, reservationReducer,
            getReservationsStart(table), onGetReservationsStart());

        expect(finalState.error).toBeFalsy();
        expect(finalState.reservations.length).toEqual(150);
    });
    it('read reservation in the future', () => {
    });
    it('read reservation in the past', () => {
    });
    it('clearing gotten reservations when querying another table', () => {
    });
    it('clearing gotten reservations when changing sorting', () => {
    });
    it('get grouped reservations for a date', () => {
    });
    it('cannot create a reservation in the same reservation at the same time', () => {
        //
    });
    it('cannot move a reservation in the same reservation at the same time', () => {
        //
    });
});
describe('signed it reservation tests against other user', () => {
    it('cannot create reservation for other user\'s reservation', () => {
        //
    });
    it('cannot list reservations for other user\'s reservation', () => {
    });
    it('cannot modify other user\'s reservations', () => {
    });
    it('cannot delete other user\'s reservations', () => {
    });
});
