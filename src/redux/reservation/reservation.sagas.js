import {all, put, takeLatest, select} from "redux-saga/effects";
import Parse from "../../backend/parse.utils";
import ReservationActionsTypes from "./reservation.actions.types";
import {
    backendError,
    createReservationSuccess,
    deleteReservationSuccess,
    getReservationsSuccess,
    updateReservationSuccess
} from "./reservation.actions";
import {reservationFromBackendObject} from "./reservation.utils";
import {getReservations, getSort, getTable} from "./reservation.selectors";

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

function* queryReservations({payload: {table, sort}}) {
    try {
        const currentSort = yield select(getSort);
        let currentTable = yield select(getTable);

        sort = sort ?? currentSort;
        currentTable = currentTable ?? table;

        let currentReservations = [];
        if (currentSort === sort && currentTable === table) {
            sort = currentSort;
            currentReservations = yield select(getReservations);
        }

        const query = new Parse.Query('Reservation');
        query.equalTo('table', table.backendObject);
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
        yield put(getReservationsSuccess(currentReservations.concat(reservations), table, sort));
    } catch (error) {
        yield put(backendError(error));
    }
}

export function* onGetReservationsStart() {
    yield takeLatest(ReservationActionsTypes.GET_RESERVATIONS_START, queryReservations);
}

export function* tableSagas() {
    yield all([
        onCreateReservationStart(),
        onUpdateReservationStart(),
        onDeleteReservationStart(),
        onGetReservationsStart()
    ]);
}