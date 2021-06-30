import UserActionTypes from "./user.actions.types";

export const signUpStart = (email, password, managerName) => ({
    type: UserActionTypes.SIGN_UP_START,
    payload: {email, password, managerName}
});

export const signInStart = (email, password) => ({
    type: UserActionTypes.SIGN_IN_START,
    payload: {email, password}
})

export const signInSuccess = (user) => ({
    type: UserActionTypes.SIGN_IN_SUCCESS,
    payload: user
});

export const signInOrUpFailure = (error) => ({
    type: UserActionTypes.SIGN_IN_OR_UP_FAILURE,
    payload: error
});

export const signOutStart = () => ({
    type: UserActionTypes.SIGN_OUT_START
})

export const signOutSuccess = () => ({
    type: UserActionTypes.SIGN_OUT_SUCCESS
})