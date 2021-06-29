import { takeLatest, put, all, call } from 'redux-saga/effects';
import UserActionTypes from "./user.actions.types";
import {signInSuccess, signInOrUpFailure} from "./user.actions";
import Parse from "../../backend/parse.utils";

export function* signUp({ payload: { email, password, managerName } }) {
    const user = new Parse.User();
    user.set("username", email);
    user.set("password", password);
    user.set("email", email);
    user.set("managerName", managerName);

    try {
        yield user.signUp();
        const currentUser = Parse.User.current();
        const attrs = currentUser.attributes
        yield put(signInSuccess({ id: currentUser.id, ...attrs}));
    } catch (error) {
        yield put(signInOrUpFailure(error));
    }
}

export function* onSignUpStart() {
    yield takeLatest(UserActionTypes.SIGN_UP_START, signUp);
}

export function* signIn({ payload: { email, password } }) {
    try {
        const { user } = yield auth.signInWithEmailAndPassword(email, password);
        yield getSnapshotFromUserAuth(user);
    } catch (error) {
        yield put(signInFailure(error));
    }
}

export function* onSignInStart() {
    yield takeLatest(UserActionTypes.SIGN_IN_START, signIn);
}

export function* userSagas() {
    yield all([
        call(onSignUpStart),
        call(onSignInStart)
    ]);
}