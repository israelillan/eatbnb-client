import {all, call, put, takeLatest} from 'redux-saga/effects';
import UserActionTypes from "./user.actions.types";
import {
    backendError,
    setRestaurantNameSuccess,
    signInOrUpFailure,
    signInSuccess,
    signOutSuccess
} from "./user.actions";
import Parse from "../../backend/parse.utils";
import {userFromBackendObject} from "./user.utils";

function* isUserAuthenticated() {
    try {
        const user = Parse.User.current();
        if (user) {
            const query = new Parse.Query(Parse.User);
            const currentUser = yield query.get(user.id);
            yield put(signInSuccess(userFromBackendObject(currentUser)));
        }
    } catch (error) {
        yield put(signInOrUpFailure(error));
    }
}

export function* onCheckUserSession() {
    yield takeLatest(UserActionTypes.CHECK_USER_SESSION, isUserAuthenticated);
}

function* signUp({payload: {email, password, managerName}}) {
    const user = new Parse.User();
    user.set("username", email);
    user.set("password", password);
    user.set("email", email);
    user.set("managerName", managerName);

    try {
        yield user.signUp();
        const currentUser = Parse.User.current();
        yield put(signInSuccess(userFromBackendObject(currentUser)));
    } catch (error) {
        yield put(signInOrUpFailure(error));
    }
}

export function* onSignUpStart() {
    yield takeLatest(UserActionTypes.SIGN_UP_START, signUp);
}

function* signOut() {
    try {
        yield Parse.User.logOut();
        yield put(signOutSuccess());
    } catch (error) {
        yield put(signInOrUpFailure(error));
    }
}

export function* onSignOutStart() {
    yield takeLatest(UserActionTypes.SIGN_OUT_START, signOut);
}

function* signIn({payload: {email, password}}) {
    try {
        yield Parse.User.logIn(email, password);
        const currentUser = Parse.User.current();
        const attrs = currentUser.attributes
        yield put(signInSuccess({id: currentUser.id, ...attrs}));
    } catch (error) {
        yield put(signInOrUpFailure(error));
    }
}

export function* onSignInStart() {
    yield takeLatest(UserActionTypes.SIGN_IN_START, signIn);
}

function* setRestaurantName({payload: {restaurantName}}) {
    try {
        Parse.User.current().set('restaurantName', restaurantName);
        yield Parse.User.current().save();
        yield put(setRestaurantNameSuccess(restaurantName));
    } catch (error) {
        yield put(backendError(error));
    }
}

export function* onSetRestaurantNameStart() {
    yield takeLatest(UserActionTypes.SET_RESTAURANT_NAME_START, setRestaurantName)
}

export function* userSagas() {
    yield all([
        call(onCheckUserSession),
        call(onSignUpStart),
        call(onSignInStart),
        call(onSignOutStart),
        call(onSetRestaurantNameStart)
    ]);
}