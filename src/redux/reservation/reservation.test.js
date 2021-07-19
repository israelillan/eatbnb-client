import {cleanMockUser, signInMockUser, signUpMockUser, testSaga} from "../../tests/tests.utils";
import INITIAL_STATE from './reservation.state';
import TABLE_INITIAL_STATE from '../table/table.state';
import {
    createReservationStart,
    deleteReservationStart,
    getReservationsReportStart,
    getReservationsStart,
    updateReservationStart
} from "./reservation.actions";
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
import {reservationFromBackendObject} from "./reservation.utils";

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
        try {
            await reservation.destroy();
        } catch (e) {
            console.error(e);
        }
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

        const {finalState} = await testSaga({reservation: INITIAL_STATE},
            createReservationStart(table, reservationDate, customerName, customerPhone),
            onCreateReservationStart());

        expect(finalState.reservation.reservations.length).toEqual(1);
        expect(finalState.reservation.reservations[0].backendObject).toBeTruthy();
        expect(finalState.reservation.reservations[0].table.backendObject.id).toEqual(table.backendObject.id);
        expect(finalState.reservation.reservations[0].dateAndTime).toEqual(reservationDate);
        expect(finalState.reservation.reservations[0].customerName).toEqual(customerName);
        expect(finalState.reservation.reservations[0].customerPhone).toEqual(customerPhone);
    });
    it('creating a reservation must be at the beginning of the hour', async () => {
        const table = await createTable(0, 1);

        const reservationDate = new Date(2021, 1, 2, 0, 22);
        const expectedReservationDate = new Date(2021, 1, 2, 0, 0);

        const {finalState} = await testSaga({reservation: INITIAL_STATE},
            createReservationStart(table, reservationDate, customerName, customerPhone),
            onCreateReservationStart());

        expect(finalState.backend.error).toBeFalsy();
        expect(finalState.reservation.reservations.length).toEqual(1);
        expect(finalState.reservation.reservations[0].backendObject).toBeTruthy();
        expect(finalState.reservation.reservations[0].table.backendObject.id).toEqual(table.backendObject.id);
        expect(finalState.reservation.reservations[0].dateAndTime).toEqual(expectedReservationDate);
        expect(finalState.reservation.reservations[0].customerName).toEqual(customerName);
        expect(finalState.reservation.reservations[0].customerPhone).toEqual(customerPhone);
    });
    it('update a reservation', async () => {
        const table = await createTable(0, 2);
        const anotherTable = await createTable(0, 3);

        const initialReservationDate = new Date(2021, 1, 3, 2, 0);
        const finalReservationDate = new Date(2021, 1, 3, 3, 0);

        const reservationCreationSagaResult = await testSaga({reservation: INITIAL_STATE},
            createReservationStart(table, initialReservationDate, customerName, customerPhone),
            onCreateReservationStart());

        const {finalState} = await testSaga(reservationCreationSagaResult.finalState,
            updateReservationStart(reservationCreationSagaResult.finalState.reservation.reservations[0],
                anotherTable, finalReservationDate,
                customerName + "_final",
                customerPhone + "_final"),
            onUpdateReservationStart());

        expect(finalState.backend.error).toBeFalsy();
        expect(finalState.reservation.reservations.length).toEqual(1);
        expect(finalState.reservation.reservations[0].backendObject).toBeTruthy();
        expect(finalState.reservation.reservations[0].table.backendObject.id).toEqual(anotherTable.backendObject.id);
        expect(finalState.reservation.reservations[0].dateAndTime).toEqual(finalReservationDate);
        expect(finalState.reservation.reservations[0].customerName).toEqual(customerName + "_final");
        expect(finalState.reservation.reservations[0].customerPhone).toEqual(customerPhone + "_final");
    });
    it('updating  a reservation must be at the beginning of the hour', async () => {
        const table = await createTable(0, 4);
        const anotherTable = await createTable(0, 5);

        const initialReservationDate = new Date(2021, 1, 3, 4, 0);
        const finalReservationDate = new Date(2021, 1, 3, 5, 33);
        const expectedFinalReservationDate = new Date(2021, 1, 3, 5, 0);

        const reservationCreationSagaResult = await testSaga({reservation: INITIAL_STATE},
            createReservationStart(table, initialReservationDate, customerName, customerPhone),
            onCreateReservationStart());

        expect(reservationCreationSagaResult.finalState.reservation.reservations[0].dateAndTime).toEqual(initialReservationDate);

        const {finalState} = await testSaga(reservationCreationSagaResult.finalState,
            updateReservationStart(reservationCreationSagaResult.finalState.reservation.reservations[0],
                anotherTable, finalReservationDate,
                customerName + "_final",
                customerPhone + "_final"),
            onUpdateReservationStart());

        expect(finalState.backend.error).toBeFalsy();
        expect(finalState.reservation.reservations.length).toEqual(1);
        expect(finalState.reservation.reservations[0].backendObject).toBeTruthy();
        expect(finalState.reservation.reservations[0].table.backendObject.id).toEqual(anotherTable.backendObject.id);
        expect(finalState.reservation.reservations[0].dateAndTime).toEqual(expectedFinalReservationDate);
        expect(finalState.reservation.reservations[0].customerName).toEqual(customerName + "_final");
        expect(finalState.reservation.reservations[0].customerPhone).toEqual(customerPhone + "_final");
    });
    it('delete a reservation', async () => {
        const table = await createTable(0, 6);

        const reservationCreationSagaResult = await testSaga({reservation: INITIAL_STATE},
            createReservationStart(table, new Date(2021, 1, 4, 0, 0),
                "Customer name", "000000000"),
            onCreateReservationStart());

        const {finalState} = await testSaga(reservationCreationSagaResult.finalState,
            deleteReservationStart(reservationCreationSagaResult.finalState.reservation.reservations[0]),
            onDeleteReservationStart());

        expect(finalState.backend.error).toBeFalsy();
        expect(finalState.reservation.reservations.length).toEqual(0);
    });
    it('clear reservations on sign out', async () => {
        const table = await createTable(0, 7);

        const reservationCreationSagaResult = await testSaga({reservation: INITIAL_STATE},
            createReservationStart(table, new Date(2021, 1, 5, 0, 0),
                "Customer name", "000000000"),
            onCreateReservationStart());
        const {finalState} = await testSaga(reservationCreationSagaResult.finalState, signOutStart(), onSignOutStart());

        expect(finalState.backend.error).toBeFalsy();
        expect(finalState.reservation.reservations.length).toEqual(0);
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

        const {finalState: initial100State} = await testSaga({reservation: INITIAL_STATE},
            getReservationsStart(table), onGetReservationsStart());

        expect(initial100State.backend.error).toBeFalsy();
        expect(initial100State.reservation.reservations.length).toEqual(100);

        const {finalState} = await testSaga(initial100State,
            getReservationsStart(table), onGetReservationsStart());

        expect(finalState.backend.error).toBeFalsy();
        expect(finalState.reservation.reservations.length).toEqual(150);
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

        const {finalState: ascendingState} = await testSaga({reservation: INITIAL_STATE},
            getReservationsStart(table, 'dateAndTime'), onGetReservationsStart());

        expect(ascendingState.backend.error).toBeFalsy();
        expect(ascendingState.reservation.reservations.length).toEqual(8);
        let prev = ascendingState.reservation.reservations[0].dateAndTime;
        for (let i = 1; i < ascendingState.reservation.reservations.length; i++) {
            expect(ascendingState.reservation.reservations[i].dateAndTime > prev).toBeTruthy();
            prev = ascendingState.reservation.reservations[i].dateAndTime;
        }

        const {finalState: descendingState} = await testSaga(ascendingState,
            getReservationsStart(table, '-dateAndTime'), onGetReservationsStart());

        expect(descendingState.backend.error).toBeFalsy();
        expect(descendingState.reservation.reservations.length).toEqual(8);
        prev = descendingState.reservation.reservations[0].dateAndTime;
        for (let i = 1; i < descendingState.reservation.reservations.length; i++) {
            expect(descendingState.reservation.reservations[i].dateAndTime < prev).toBeTruthy();
            prev = descendingState.reservation.reservations[i].dateAndTime;
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

        const {finalState} = await testSaga({reservation: INITIAL_STATE},
            getReservationsStart(table, undefined, (q) => {
                q.greaterThan('dateAndTime', now)
            }), onGetReservationsStart());

        expect(finalState.backend.error).toBeFalsy();
        expect(finalState.reservation.reservations.length).toEqual(4);
        finalState.reservation.reservations.forEach((r) => {
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

        const {finalState} = await testSaga({reservation: INITIAL_STATE},
            getReservationsStart(table, undefined, (q) => {
                q.lessThan('dateAndTime', now)
            }), onGetReservationsStart());

        expect(finalState.backend.error).toBeFalsy();
        expect(finalState.reservation.reservations.length).toEqual(4);
        finalState.reservation.reservations.forEach((r) => {
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

        const {finalState: ascendingState} = await testSaga({reservation: INITIAL_STATE},
            getReservationsStart(table, 'dateAndTime'), onGetReservationsStart());

        expect(ascendingState.backend.error).toBeFalsy();
        expect(ascendingState.reservation.reservations.length).toEqual(8);

        const {finalState: descendingState} = await testSaga(ascendingState,
            getReservationsStart(table, '-dateAndTime'), onGetReservationsStart());

        expect(descendingState.backend.error).toBeFalsy();
        expect(descendingState.reservation.reservations.length).toEqual(8);
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

        const {finalState: firstTable} = await testSaga({reservation: INITIAL_STATE},
            getReservationsStart(table), onGetReservationsStart());

        expect(firstTable.backend.error).toBeFalsy();
        expect(firstTable.reservation.reservations.length).toEqual(8);

        const {finalState: secondTable} = await testSaga(firstTable,
            getReservationsStart(anotherTable), onGetReservationsStart());

        expect(secondTable.backend.error).toBeFalsy();
        expect(secondTable.reservation.reservations.length).toEqual(0);
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
        const {finalState: ascendingState} = await testSaga({reservation: INITIAL_STATE},
            getReservationsStart(table, undefined, (q) => {
                q.greaterThan('dateAndTime', initialReservationDate)
            }), onGetReservationsStart());

        expect(ascendingState.backend.error).toBeFalsy();
        expect(ascendingState.reservation.reservations.length).toEqual(8);

        const {finalState: descendingState} = await testSaga(ascendingState,
            getReservationsStart(table, undefined, (q) => {
                q.lessThan('dateAndTime', initialReservationDate)
            }), onGetReservationsStart());

        expect(descendingState.backend.error).toBeFalsy();
        expect(descendingState.reservation.reservations.length).toEqual(0);
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

        const {finalState} = await testSaga({reservation: INITIAL_STATE, table: TABLE_INITIAL_STATE },
            getReservationsReportStart(now), onGetReservationsReportStart());

        expect(finalState.backend.error).toBeFalsy();
        expect(finalState.reservation.reservationsReport[1].reservations.length).toEqual(8);
        expect(finalState.reservation.reservationsReport[2].reservations.length).toEqual(8);
    });
    it('cannot create a reservation in the same table at the same time', async () => {
        const table = await createTable(1, 8);

        const reservationDate = new Date(2021, 1, 1, 0, 0);

        const {finalState: creationState} = await testSaga({reservation: INITIAL_STATE},
            createReservationStart(table, reservationDate, customerName, customerPhone),
            onCreateReservationStart());

        expect(creationState.backend.error).toBeFalsy();
        const {finalState} = await testSaga(creationState,
            createReservationStart(table, reservationDate, "other " + customerName, "other " + customerPhone),
            onCreateReservationStart());

        expect(finalState.backend.error).toBeTruthy();
        expect(finalState.reservation.reservations[0].customerName).toEqual(customerName);
        expect(finalState.reservation.reservations[0].customerPhone).toEqual(customerPhone);
    });
    it('cannot move a reservation in the same table at the same time', async () => {
        const table = await createTable(1, 9);

        const firstReservationDate = new Date(2021, 1, 1, 0, 0);
        const {finalState: firstCreationState} = await testSaga({reservation: INITIAL_STATE},
            createReservationStart(table, firstReservationDate, customerName, customerPhone),
            onCreateReservationStart());
        expect(firstCreationState.backend.error).toBeFalsy();

        const secondReservationDate = new Date(2021, 1, 1, 1, 0);
        const otherCustomerName = "other " + customerName;
        const otherCustomerPhone = "other " + customerPhone;
        const {finalState: secondCreationState} = await testSaga(firstCreationState,
            createReservationStart(table, secondReservationDate, otherCustomerName, otherCustomerPhone),
            onCreateReservationStart());
        expect(secondCreationState.backend.error).toBeFalsy();

        const {finalState} = await testSaga(secondCreationState,
            updateReservationStart(secondCreationState.reservation.reservations[1],
                table, firstReservationDate),
            onUpdateReservationStart());

        expect(finalState.backend.error).toBeTruthy();
        expect(finalState.reservation.reservations[0].dateAndTime).toEqual(firstReservationDate);
        expect(finalState.reservation.reservations[0].customerName).toEqual(customerName);
        expect(finalState.reservation.reservations[0].customerPhone).toEqual(customerPhone);
        expect(finalState.reservation.reservations[1].dateAndTime).toEqual(secondReservationDate);
        expect(finalState.reservation.reservations[1].customerName).toEqual(otherCustomerName);
        expect(finalState.reservation.reservations[1].customerPhone).toEqual(otherCustomerPhone);
    });
});

describe('signed in reservation tests against other user', () => {
    const oneMockUser = {
        email: 'testReservations_1@eatbnb.com',
        managerName: 'Test Tables'
    };
    const otherMockUser = {
        email: 'testReservations_2@eatbnb.com',
        managerName: 'Test Tables'
    };

    const customerName = "Customer name";
    const customerPhone = "000000000";

    let otherUserTable
    let otherUserReservation
    beforeAll(async () => {
        await signUpMockUser(otherMockUser);

        otherUserTable = await createTable(0, 0);

        const reservation = new Parse.Object('Reservation');
        reservation.set('table', otherUserTable.backendObject);
        reservation.set('dateAndTime', new Date());
        reservation.set('customerName', customerName);
        reservation.set('customerPhone', customerPhone);
        const result = await reservation.save();
        otherUserReservation = reservationFromBackendObject(result, otherUserTable)

        await signUpMockUser(oneMockUser);
    });
    afterAll(async () =>
    {
        await cleanMockUser(oneMockUser);
        await cleanMockUser(otherMockUser);
    });

    it('cannot create reservation for other user\'s table', async () => {
        const reservationDate = new Date(2021, 2, 1, 0, 0);

        const {finalState} = await testSaga({reservation: INITIAL_STATE},
            createReservationStart(otherUserTable, reservationDate, customerName, customerPhone),
            onCreateReservationStart());

        expect(finalState.backend.error).toBeTruthy();
        expect(finalState.reservation.reservations.length).toEqual(0);
    });
    it('cannot list reservations for other user\'s table', async () => {
        const {finalState} = await testSaga({reservation: INITIAL_STATE},
            getReservationsStart(otherUserTable), onGetReservationsStart());

        expect(finalState.backend.error).toBeFalsy();
        expect(finalState.reservation.reservations.length).toEqual(0);
    });
    it('cannot modify other user\'s reservations', async () => {
        const finalReservationDate = new Date(2021, 2, 3, 3, 0);

        const {finalState} = await testSaga({reservation: INITIAL_STATE},
            updateReservationStart(
                otherUserReservation,
                otherUserTable,
                finalReservationDate,
                customerName + "_final",
                customerPhone + "_final"),
            onUpdateReservationStart());

        expect(finalState.backend.error).toBeTruthy();
    });
    it('cannot delete other user\'s reservations', async () => {
        const {finalState} = await testSaga({reservation: INITIAL_STATE},
            deleteReservationStart(otherUserReservation),
            onDeleteReservationStart());

        expect(finalState.backend.error).toBeTruthy();
    });
});
