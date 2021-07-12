import {cleanMockUser, signInMockUser, signUpMockUser, testSaga} from "../../tests/tests.utils";
import INITIAL_STATE from './reservation.state';
import {
    createReservationStart,
    deleteReservationStart,
    getReservationsReportStart,
    getReservationsStart,
    updateReservationStart
} from "./reservation.actions";
import reservationReducer from "./reservation.reducer";
import {
    onCreateReservationStart,
    onDeleteReservationStart,
    onGetReservationsReportStart,
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
    for (const reservation of reservations) {
        await reservation.destroy();
    }
};

describe('signed it reservation tests', () => {
    const mockUser = {
        email: 'testReservations_single@eatbnb.com',
        managerName: 'Test Reservations'
    };
    const customerName = "Customer name";
    const customerPhone = "000000000";

    beforeAll(async () => {
        await signUpMockUser(mockUser);
    });
    afterEach(async () => await deleteAllUserReservations(mockUser));
    afterAll(async () => await cleanMockUser(mockUser));

    it('create a reservation', async () => {
        const table = await createTable(0, 0);

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
        const table = await createTable(0, 1);

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
        const table = await createTable(0, 2);
        const anotherTable = await createTable(0, 3);

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
        const table = await createTable(0, 4);
        const anotherTable = await createTable(0, 5);

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
        const table = await createTable(0, 6);

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
        const table = await createTable(0, 7);

        const reservationCreationSagaResult = await testSaga(INITIAL_STATE, reservationReducer,
            createReservationStart(table, new Date(2021, 1, 5, 0, 0),
                "Customer name", "000000000"),
            onCreateReservationStart());
        const {finalState} = await testSaga(reservationCreationSagaResult.finalState, reservationReducer, signOutStart(), onSignOutStart());

        expect(finalState.error).toBeFalsy();
        expect(finalState.reservations.length).toEqual(0);
    });
    it('read reservations paginated', async () => {
        const table = await createTable(0, 8);

        const initialReservationDate = new Date(2021, 1, 6, 0, 0);

        const reservations = [];
        for (let i = 0; i < 150; i++) {
            const reservation = new Parse.Object('Reservation');
            reservation.set('table', table.backendObject);
            const dateAndTime = new Date(initialReservationDate);
            dateAndTime.setHours(initialReservationDate.getHours() + i);
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
    it('sort reservations', async () => {
        const table = await createTable(0, 9);

        const initialReservationDate = new Date(2021, 1, 7, 0, 0);

        const reservations = [];
        for (let i = 0; i < 8; i++) {
            const reservation = new Parse.Object('Reservation');
            reservation.set('table', table.backendObject);
            const dateAndTime = new Date(initialReservationDate);
            dateAndTime.setHours(initialReservationDate.getHours() + i);

            reservation.set('dateAndTime', dateAndTime);
            reservation.set('customerName', customerName);
            reservation.set('customerPhone', customerPhone);
            reservations.push(reservation);
        }
        await Parse.Object.saveAll(reservations);

        const {finalState: ascendingState} = await testSaga(INITIAL_STATE, reservationReducer,
            getReservationsStart(table, 'dateAndTime'), onGetReservationsStart());

        expect(ascendingState.error).toBeFalsy();
        expect(ascendingState.reservations.length).toEqual(8);
        let prev = ascendingState.reservations[0].dateAndTime;
        for (let i = 1; i < ascendingState.reservations.length; i++) {
            expect(ascendingState.reservations[i].dateAndTime > prev).toBeTruthy();
            prev = ascendingState.reservations[i].dateAndTime;
        }

        const {finalState: descendingState} = await testSaga(ascendingState, reservationReducer,
            getReservationsStart(table, '-dateAndTime'), onGetReservationsStart());

        expect(descendingState.error).toBeFalsy();
        expect(descendingState.reservations.length).toEqual(8);
        prev = descendingState.reservations[0].dateAndTime;
        for (let i = 1; i < descendingState.reservations.length; i++) {
            expect(descendingState.reservations[i].dateAndTime < prev).toBeTruthy();
            prev = descendingState.reservations[i].dateAndTime;
        }
    });
    it('read reservation in the future', async () => {
        const table = await createTable(1, 0);

        const now = new Date();
        const initialReservationDate = new Date(now);
        initialReservationDate.setHours(now.getHours() - 3);

        const reservations = [];
        for (let i = 0; i < 8; i++) {
            const reservation = new Parse.Object('Reservation');
            reservation.set('table', table.backendObject);
            const dateAndTime = new Date(initialReservationDate);
            dateAndTime.setHours(initialReservationDate.getHours() + i);

            reservation.set('dateAndTime', dateAndTime);
            reservation.set('customerName', customerName);
            reservation.set('customerPhone', customerPhone);
            reservations.push(reservation);
        }
        await Parse.Object.saveAll(reservations);

        const {finalState} = await testSaga(INITIAL_STATE, reservationReducer,
            getReservationsStart(table, undefined, (q) => {
                q.greaterThan('dateAndTime', now)
            }), onGetReservationsStart());

        expect(finalState.error).toBeFalsy();
        expect(finalState.reservations.length).toEqual(4);
        finalState.reservations.forEach((r) => {
            expect(r.dateAndTime > now).toBeTruthy();
        });
    });
    it('read reservation in the past', async () => {
        const table = await createTable(1, 1);

        const now = new Date();
        const initialReservationDate = new Date(now);
        initialReservationDate.setHours(now.getHours() - 3);

        const reservations = [];
        for (let i = 0; i < 8; i++) {
            const reservation = new Parse.Object('Reservation');
            reservation.set('table', table.backendObject);
            const dateAndTime = new Date(initialReservationDate);
            dateAndTime.setHours(initialReservationDate.getHours() + i);

            reservation.set('dateAndTime', dateAndTime);
            reservation.set('customerName', customerName);
            reservation.set('customerPhone', customerPhone);
            reservations.push(reservation);
        }
        await Parse.Object.saveAll(reservations);

        const {finalState} = await testSaga(INITIAL_STATE, reservationReducer,
            getReservationsStart(table, undefined, (q) => {
                q.lessThan('dateAndTime', now)
            }), onGetReservationsStart());

        expect(finalState.error).toBeFalsy();
        expect(finalState.reservations.length).toEqual(4);
        finalState.reservations.forEach((r) => {
            expect(r.dateAndTime < now).toBeTruthy();
        });
    });
    it('clearing gotten reservations when changing sorting', async () => {
        const table = await createTable(1, 2);

        const initialReservationDate = new Date(2021, 1, 7, 0, 0);

        const reservations = [];
        for (let i = 0; i < 8; i++) {
            const reservation = new Parse.Object('Reservation');
            reservation.set('table', table.backendObject);
            const dateAndTime = new Date(initialReservationDate);
            dateAndTime.setHours(initialReservationDate.getHours() + i);

            reservation.set('dateAndTime', dateAndTime);
            reservation.set('customerName', customerName);
            reservation.set('customerPhone', customerPhone);
            reservations.push(reservation);
        }
        await Parse.Object.saveAll(reservations);

        const {finalState: ascendingState} = await testSaga(INITIAL_STATE, reservationReducer,
            getReservationsStart(table, 'dateAndTime'), onGetReservationsStart());

        expect(ascendingState.error).toBeFalsy();
        expect(ascendingState.reservations.length).toEqual(8);

        const {finalState: descendingState} = await testSaga(ascendingState, reservationReducer,
            getReservationsStart(table, '-dateAndTime'), onGetReservationsStart());

        expect(descendingState.error).toBeFalsy();
        expect(descendingState.reservations.length).toEqual(8);
    });
    it('clearing gotten reservations when querying another table', async () => {
        const table = await createTable(1, 3);
        const anotherTable = await createTable(1, 4);

        const initialReservationDate = new Date(2021, 1, 7, 0, 0);

        const reservations = [];
        for (let i = 0; i < 8; i++) {
            const reservation = new Parse.Object('Reservation');
            reservation.set('table', table.backendObject);
            const dateAndTime = new Date(initialReservationDate);
            dateAndTime.setHours(initialReservationDate.getHours() + i);

            reservation.set('dateAndTime', dateAndTime);
            reservation.set('customerName', customerName);
            reservation.set('customerPhone', customerPhone);
            reservations.push(reservation);
        }
        await Parse.Object.saveAll(reservations);

        const {finalState: firstTable} = await testSaga(INITIAL_STATE, reservationReducer,
            getReservationsStart(table), onGetReservationsStart());

        expect(firstTable.error).toBeFalsy();
        expect(firstTable.reservations.length).toEqual(8);

        const {finalState: secondTable} = await testSaga(firstTable, reservationReducer,
            getReservationsStart(anotherTable), onGetReservationsStart());

        expect(secondTable.error).toBeFalsy();
        expect(secondTable.reservations.length).toEqual(0);
    });
    it('clearing gotten reservations query changes', async () => {
        const table = await createTable(1, 5);

        const initialReservationDate = new Date();

        const reservations = [];
        for (let i = 0; i < 8; i++) {
            const reservation = new Parse.Object('Reservation');
            reservation.set('table', table.backendObject);
            const dateAndTime = new Date(initialReservationDate);
            dateAndTime.setHours(initialReservationDate.getHours() + i);

            reservation.set('dateAndTime', dateAndTime);
            reservation.set('customerName', customerName);
            reservation.set('customerPhone', customerPhone);
            reservations.push(reservation);
        }
        await Parse.Object.saveAll(reservations);

        initialReservationDate.setHours(initialReservationDate.getHours() - 1); // reservation date gets rounded down
        const {finalState: ascendingState} = await testSaga(INITIAL_STATE, reservationReducer,
            getReservationsStart(table, undefined, (q) => {
                q.greaterThan('dateAndTime', initialReservationDate)
            }), onGetReservationsStart());

        expect(ascendingState.error).toBeFalsy();
        expect(ascendingState.reservations.length).toEqual(8);

        const {finalState: descendingState} = await testSaga(ascendingState, reservationReducer,
            getReservationsStart(table, undefined, (q) => {
                q.lessThan('dateAndTime', initialReservationDate)
            }), onGetReservationsStart());

        expect(descendingState.error).toBeFalsy();
        expect(descendingState.reservations.length).toEqual(0);
    });
    it('get reservations report', async () => {
        const table = await createTable(1, 6);
        const anotherTable = await createTable(1, 7);

        const now = new Date();
        const initialReservationDate = new Date(now);
        initialReservationDate.setHours(0);

        const reservations = [];
        for (let i = 0; i < 8; i++) {
            const dateAndTime = new Date(initialReservationDate);
            dateAndTime.setHours(initialReservationDate.getHours() + i);

            const reservationTable1 = new Parse.Object('Reservation');
            reservationTable1.set('table', table.backendObject);
            reservationTable1.set('dateAndTime', dateAndTime);
            reservationTable1.set('customerName', customerName + " table 1");
            reservationTable1.set('customerPhone', customerPhone + " table 1");
            reservations.push(reservationTable1);

            const reservationTable2 = new Parse.Object('Reservation');
            reservationTable2.set('table', anotherTable.backendObject);
            reservationTable2.set('dateAndTime', dateAndTime);
            reservationTable2.set('customerName', customerName + " table 2");
            reservationTable2.set('customerPhone', customerPhone + " table 2");
            reservations.push(reservationTable2);
        }
        await Parse.Object.saveAll(reservations);

        const {finalState} = await testSaga(INITIAL_STATE, reservationReducer,
            getReservationsReportStart(now), onGetReservationsReportStart());

        expect(finalState.error).toBeFalsy();
        expect(finalState.reservationsReport.length).toEqual(16);
    });
    it('cannot create a reservation in the same table at the same time', async () => {
        const table = await createTable(1, 8);

        const reservationDate = new Date(2021, 1, 1, 0, 0);

        const {finalState: creationState} = await testSaga(INITIAL_STATE, reservationReducer,
            createReservationStart(table, reservationDate, customerName, customerPhone),
            onCreateReservationStart());

        expect(creationState.error).toBeFalsy();
        const {finalState} = await testSaga(creationState, reservationReducer,
            createReservationStart(table, reservationDate, "other " + customerName, "other " + customerPhone),
            onCreateReservationStart());

        expect(finalState.error).toBeTruthy();
        expect(finalState.reservations[0].customerName).toEqual(customerName);
        expect(finalState.reservations[0].customerPhone).toEqual(customerPhone);
    });
    it('cannot move a reservation in the same table at the same time', async () => {
        const table = await createTable(1, 9);

        const firstReservationDate = new Date(2021, 1, 1, 0, 0);
        const {finalState: firstCreationState} = await testSaga(INITIAL_STATE, reservationReducer,
            createReservationStart(table, firstReservationDate, customerName, customerPhone),
            onCreateReservationStart());
        expect(firstCreationState.error).toBeFalsy();

        const secondReservationDate = new Date(2021, 1, 1, 1, 0);
        const otherCustomerName = "other " + customerName;
        const otherCustomerPhone = "other " + customerPhone;
        const {finalState: secondCreationState} = await testSaga(firstCreationState, reservationReducer,
            createReservationStart(table, secondReservationDate, otherCustomerName, otherCustomerPhone),
            onCreateReservationStart());
        expect(secondCreationState.error).toBeFalsy();

        const {finalState} = await testSaga(secondCreationState,
            reservationReducer,
            updateReservationStart(secondCreationState.reservations[1],
                table, firstReservationDate),
            onUpdateReservationStart());

        expect(finalState.error).toBeTruthy();
        expect(finalState.reservations[0].dateAndTime).toEqual(firstReservationDate);
        expect(finalState.reservations[0].customerName).toEqual(customerName);
        expect(finalState.reservations[0].customerPhone).toEqual(customerPhone);
        expect(finalState.reservations[1].dateAndTime).toEqual(secondReservationDate);
        expect(finalState.reservations[1].customerName).toEqual(otherCustomerName);
        expect(finalState.reservations[1].customerPhone).toEqual(otherCustomerPhone);
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
