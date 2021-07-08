import {all, call, put, takeLatest} from "redux-saga/effects";
import Parse from "../../backend/parse.utils";
import TableActionsTypes from "./table.actions.types";
import {
    backendError,
    createTableSuccess,
    deleteTableSuccess,
    getTableSuccess,
    updateTableSuccess
} from "./table.actions";
import UserActionTypes from "../user/user.actions.types";

function* createTable({payload: {x, y, seats}}) {
    try {
        const table = new Parse.Object('Table');
        table.set('x', x);
        table.set('y', y);
        table.set('seats', seats);
        const result = yield table.save();
        const attrs = result.attributes;
        yield put(createTableSuccess({id: result.id, ...attrs}));
    } catch (error) {
        yield put(backendError(error));
    }
}

export function* onCreateTableStart() {
    yield takeLatest(TableActionsTypes.CREATE_TABLE_START, createTable);
}

function* updateTable({payload: {table, x, y, seats}}) {
    try {
        const query = new Parse.Query('Table');
        const object = yield query.get(table.id);
        object.set('x', x);
        object.set('y', y);
        object.set('seats', seats);
        const result = yield object.save();
        const attrs = result.attributes;

        yield put(updateTableSuccess({id: result.id, ...attrs}));
    } catch (error) {
        yield put(backendError(error));
    }
}

export function* onUpdateTableStart() {
    yield takeLatest(TableActionsTypes.UPDATE_TABLE_START, updateTable);
}

function* deleteTable({payload: table}) {
    try {
        const query = new Parse.Query('Table');
        const object = yield query.get(table.id);
        yield object.destroy();

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
        const limit = 100;
        while(true) {
            const query = new Parse.Query('Table')
            query.limit(limit);
            query.skip(skip);
            const tempResults = yield query.find();
            results = results.concat(tempResults);
            if (tempResults.length < limit) {
                break;
            }
            skip += limit;
        }
        const tables = results.map(r => {
            return {
                id: r.id,
                ...r.attributes
            }
        });

        yield put(getTableSuccess(tables));
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