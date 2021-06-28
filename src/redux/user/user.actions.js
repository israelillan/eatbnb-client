import UserActionTypes from "./user.actions.types";

export const signUpStart = (email, password, managerName) => ({
    type: UserActionTypes.SIGN_UP_START,
    payload: { email, password, managerName }
});

export const signUpSuccess = (user) => ({
    type: UserActionTypes.SIGN_UP_SUCCESS,
    payload: user
});

export const signUpFailure = error => ({
    type: UserActionTypes.SIGN_IN_OR_UP_FAILURE,
    payload: error
});

export const signInSuccess = (user) => ({
    type: UserActionTypes.SIGN_IN_SUCCESS,
    payload: user
});

export const signInFailure = (user) => ({
    type: UserActionTypes.SIGN_IN_OR_UP_FAILURE,
    payload: user
});
