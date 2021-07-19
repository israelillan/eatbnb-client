import {all, put, select, takeLatest} from "redux-saga/effects";
import Parse from "../../backend/parse.utils";
import ReservationActionsTypes from "./reservation.actions.types";
import {
    backendError,
    createReservationSuccess,
    deleteReservationSuccess,
    getReservationsReportSuccess,
    getReservationsSuccess,
    updateReservationSuccess
} from "./reservation.actions";
import {reservationFromBackendObject} from "./reservation.utils";
import {selectQuery, selectReservations, selectSort, selectTable} from "./reservation.selectors";

function* createReservation({payload: {table, dateAndTime, customerName, customerPhone}}) {
    try {
        const reservation = new Parse.Object('Reservation');
        reservation.set('table', table.backendObject);
        reservation.set('dateAndTime', dateAndTime);
        reservation.set('customerName', customerName);
        reservation.set('customerPhone', customerPhone);
        const result = yield reservation.save();
        yield put(createReservationSuccess(reservationFromBackendObject(result, table)));
        yield queryReservations({payload: {table}});
    } catch (error) {
        yield put(backendError(error));
    }
}

export function* onCreateReservationStart() {
    yield takeLatest(ReservationActionsTypes.CREATE_RESERVATION_START, createReservation);
}

function* updateReservation({payload: {reservation, table, dateAndTime, customerName, customerPhone}}) {
    try {
        reservation.backendObject.set('table', table.backendObject);
        reservation.backendObject.set('dateAndTime', dateAndTime);
        reservation.backendObject.set('customerName', customerName);
        reservation.backendObject.set('customerPhone', customerPhone);
        const result = yield reservation.backendObject.save();
        yield put(updateReservationSuccess(reservationFromBackendObject(result, table)));
    } catch (error) {
        yield put(backendError(error));
    }
}

export function* onUpdateReservationStart() {
    yield takeLatest(ReservationActionsTypes.UPDATE_RESERVATION_START, updateReservation);
}

function* deleteReservation({payload: reservation}) {
    try {
        yield reservation.backendObject.destroy();
        yield put(deleteReservationSuccess(reservation));
    } catch (error) {
        yield put(backendError(error));
    }
}

export function* onDeleteReservationStart() {
    yield takeLatest(ReservationActionsTypes.DELETE_RESERVATION_START, deleteReservation);
}

function* queryReservations({payload: {table, sort, query: reservationsQuery}}) {
    try {
        const currentSort = yield select(selectSort);
        let currentTable = yield select(selectTable);

        sort = sort ?? currentSort;
        currentTable = currentTable ?? table;

        const currentQuery = yield select(selectQuery);
        let currentReservations = [];
        if (currentSort === sort && currentTable === table && currentQuery === reservationsQuery) {
            currentReservations = yield select(selectReservations);
        }

        const query = new Parse.Query('Reservation');
        query.equalTo('table', table.backendObject);
        if (reservationsQuery) {
            reservationsQuery(query);
        }
        query.skip(currentReservations.length);
        if (sort.startsWith('-')) {
            query.descending(sort.substring(1));
        } else {
            query.ascending(sort);
        }

        const LIMIT = 100;
        const results = yield query.find();
        query.limit(LIMIT);
        const reservations = results.map(r => {
            return reservationFromBackendObject(r, table)
        });
        yield put(getReservationsSuccess(currentReservations.concat(reservations), table, sort, reservationsQuery,
            results.length === LIMIT));
    } catch (error) {
        yield put(backendError(error));
    }
}

export function* onGetReservationsStart() {
    yield takeLatest(ReservationActionsTypes.GET_RESERVATIONS_START, queryReservations);
}

function* queryReservationsReport({payload: {date}}) {
    try {
        const today = new Date(date);
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const query = new Parse.Query('Reservation');
        let results = [];
        let skip = 0;
        const limit = 100;
        while (true) {
            query.greaterThanOrEqualTo('dateAndTime', today);
            query.lessThan('dateAndTime', tomorrow);
            query.include('table');
            query.ascending('table.reference');
            query.addAscending('dateAndTime');
            query.limit(limit);
            query.skip(skip);

            const tempResults = yield query.find();
            results = results.concat(tempResults);
            if (tempResults.length < limit) {
                break;
            }
            skip += limit;
        }
        const reservationsReport = {};
        for (const result of results) {
            const table = result.get('table');
            const tableReference = table.get('reference');
            if (!(tableReference in reservationsReport)) {
                reservationsReport[tableReference] = {
                    table: table.attributes,
                    reservations: []
                };
            }
            reservationsReport[tableReference].reservations.push(
                result.attributes
            );
        }
        yield put(getReservationsReportSuccess(reservationsReport));
    } catch (error) {
        yield put(backendError(error));
    }
}

export function* onGetReservationsReportStart() {
    yield takeLatest(ReservationActionsTypes.GET_RESERVATIONS_REPORT_START, queryReservationsReport);
}

export function* reservationSagas() {
    yield all([
        onCreateReservationStart(),
        onUpdateReservationStart(),
        onDeleteReservationStart(),
        onGetReservationsStart(),
        onGetReservationsReportStart()
    ]);
}