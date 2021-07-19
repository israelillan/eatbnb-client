import {all, call, put, takeLatest} from "redux-saga/effects";
import Parse from "../../backend/parse.utils";
import TableActionsTypes from "./table.actions.types";
import {
    backendError,
    createTableSuccess,
    deleteTableSuccess,
    getTablesSuccess,
    updateTableSuccess
} from "./table.actions";
import UserActionTypes from "../user/user.actions.types";
import {tableFromBackendObject} from "./table.utils";

function* createTable({payload: {x, y, seats}}) {
    try {
        const table = new Parse.Object('Table');
        table.set('x', x);
        table.set('y', y);
        table.set('seats', seats);
        const result = yield table.save();
        yield put(createTableSuccess(tableFromBackendObject(result)));
    } catch (error) {
        yield put(backendError(error));
    }
}

export function* onCreateTableStart() {
    yield takeLatest(TableActionsTypes.CREATE_TABLE_START, createTable);
}

function* updateTable({payload: {table, x, y, seats}}) {
    try {
        table.backendObject.set('x', x);
        table.backendObject.set('y', y);
        table.backendObject.set('seats', seats);
        const result = yield table.backendObject.save();

        yield put(updateTableSuccess(tableFromBackendObject(result)));
    } catch (error) {
        yield put(backendError(error));
    }
}

export function* onUpdateTableStart() {
    yield takeLatest(TableActionsTypes.UPDATE_TABLE_START, updateTable);
}

function* deleteTable({payload: table}) {
    try {
        yield table.backendObject.destroy();

        yield put(deleteTableSuccess(table));
    } catch (error) {
        yield put(backendError(error));
    }
}

export function* onDeleteTableStart() {
    yield takeLatest(TableActionsTypes.DELETE_TABLE_START, deleteTable);
}

function* getTables() {
    try {
        let results = [];
        let skip = 0;
        const LIMIT = 100;
        while(true) {
            const query = new Parse.Query('Table')
            query.limit(LIMIT);
            query.skip(skip);
            const tempResults = yield query.find();
            results = results.concat(tempResults);
            if (tempResults.length < LIMIT) {
                break;
            }
            skip += LIMIT;
        }
        const tables = results.map(r => {
            return tableFromBackendObject(r)
        });

        yield put(getTablesSuccess(tables));
    } catch (error) {
        yield put(backendError(error));
    }
}

export function* onSignInSuccess() {
    yield takeLatest(UserActionTypes.SIGN_IN_SUCCESS, getTables);
}

export function* tableSagas() {
    yield all([
        call(onCreateTableStart),
        call(onUpdateTableStart),
        call(onDeleteTableStart),
        call(onSignInSuccess)
    ]);
}