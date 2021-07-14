import {all, put, takeLatest, select} from "redux-saga/effects";
import Parse from "../../backend/parse.utils";
import ReservationActionsTypes from "./reservation.actions.types";
import {
    backendError,
    createReservationSuccess,
    deleteReservationSuccess, getReservationsReportSuccess,
    getReservationsSuccess,
    updateReservationSuccess
} from "./reservation.actions";
import {reservationFromBackendObject} from "./reservation.utils";
import {getQuery, getReservations, getSort, getTable} from "./reservation.selectors";
import {getTables} from "../table/table.selectors";
import {tableFromBackendObject} from "../table/table.utils";

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
    yield takeLatest(ReservationActionsTypes.UPDATE_RESERVATION_START, createReservation);
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
        const currentSort = yield select(getSort);
        const currentQuery = yield select(getQuery);
        let currentTable = yield select(getTable);

        sort = sort ?? currentSort;
        currentTable = currentTable ?? table;

        let currentReservations = [];
        if (currentSort === sort && currentTable === table && currentQuery === reservationsQuery) {
            currentReservations = yield select(getReservations);
        }

        const query = new Parse.Query('Reservation');
        query.equalTo('table', table.backendObject);
        if (reservationsQuery) {
            reservationsQuery(query);
        }
        query.skip(currentReservations.length);
        if(sort.startsWith('-')) {
            query.descending(sort.substring(1));
        } else {
            query.ascending(sort);
        }

        const results = yield query.find();
        const reservations = results.map(r => {
            return reservationFromBackendObject(r, table)
        });
        yield put(getReservationsSuccess(currentReservations.concat(reservations), table, sort, reservationsQuery));
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

        const tableQuery = new Parse.Query('Table');

        let tablesArray = (yield select(getTables));
        if (!tablesArray) {
            const queriedTables = yield tableQuery.find();
            tablesArray = queriedTables.map(t => {
                return tableFromBackendObject(t);
            });
        }
        const tables = tablesArray.reduce((a,x) => ({...a, [x.backendObject.id]: x}), {})

        const query = new Parse.Query('Reservation');
        query.greaterThanOrEqualTo('dateAndTime', today);
        query.lessThan('dateAndTime', tomorrow);
        query.ascending('dateAndTime');

        const results = yield query.find();
        const reservationsReport = [];
        for (const result of results) {
            reservationsReport.push(reservationFromBackendObject(result, tables[result.get('table').id]));
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