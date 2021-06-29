import UserActionTypes from "./user.actions.types";

export const signUpStart = (email, password, managerName) => ({
    type: UserActionTypes.SIGN_UP_START,
    payload: { email, password, managerName }
});

export const signInSuccess = (user) => ({
    type: UserActionTypes.SIGN_IN_SUCCESS,
    payload: user
});

export const signInOrUpFailure = (error) => ({
    type: UserActionTypes.SIGN_IN_OR_UP_FAILURE,
    payload: error
});

export const logoutStart = () => ({
    type: UserActionTypes.LOGOUT_START
})

export const logoutSuccess = () => ({
    type: UserActionTypes.LOGOUT_SUCCESS
})