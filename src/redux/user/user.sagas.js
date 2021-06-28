import { takeLatest, put, all, call } from 'redux-saga/effects';
import UserActionTypes from "./user.actions.types";
import {signInSuccess, signInFailure, signUpFailure, signUpSuccess} from "./user.actions";
import {auth} from "../../firebase/firebase.utils";
import {createUserProfileDocument} from "./user.firebase";

export function* signUp({ payload: { email, password, managerName } }) {
    try {
        const user = yield auth.createUserWithEmailAndPassword(email, password);
        yield put(signUpSuccess({ user, managerName }));
    } catch (error) {
        yield put(signUpFailure(error));
    }
}

export function* onSignUpStart() {
    yield takeLatest(UserActionTypes.SIGN_UP_START, signUp);
}

export function* onSignUpSuccess() {
    yield takeLatest(UserActionTypes.SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* signInAfterSignUp({ payload: { userAuth, managerName } }) {
    try {
        const userRef = yield createUserProfileDocument(
            userAuth,
            managerName
        );
        const userSnapshot = yield userRef.get();
        yield put(signInSuccess({ id: userSnapshot.id, ...userSnapshot.data() }));
    } catch (error) {
        yield put(signInFailure(error));
    }
}

export function* userSagas() {
    yield all([
        call(onSignUpStart),
        call(onSignUpSuccess)
    ]);
}