import {all, call, put, takeLatest} from "redux-saga/effects";
import Parse from "../../backend/parse.utils";
import TableActionsTypes from "./table.actions.types";
import {backendError, createTableSuccess} from "./table.actions";

function* createTable({payload: {x, y, seats}}) {
    try {
        Parse.User.current().set('restaurantName', restaurantName);
        yield Parse.User.current().save();
        yield put(createTableSuccess(table));
    } catch (error) {
        yield put(backendError(error));
    }
}

export function* onCreateTableStart() {
    yield takeLatest(TableActionsTypes.CREATE_TABLE_START, createTable)
}

export function* tableSagas() {
    yield all([
        call(onCreateTableStart)
    ]);
}