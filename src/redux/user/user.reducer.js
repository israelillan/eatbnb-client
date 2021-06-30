import INITIAL_STATE from "./user.state";
import UserActionTypes from "./user.actions.types";

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UserActionTypes.SIGN_IN_OR_UP_FAILURE:
            return {
                ...state,
                currentUser: null,
                error: action.payload.error
            };
        case UserActionTypes.SIGN_IN_SUCCESS:
            return {
                ...state,
                currentUser: action.payload,
                error: null
            };
        case UserActionTypes.SIGN_OUT_SUCCESS:
            return {
                ...state,
                currentUser: null,
                error: null
            };
        case UserActionTypes.USER_BACKEND_ERROR:
            return {
                ...state,
                error: action.payload.error
            };
        case UserActionTypes.SET_RESTAURANT_NAME_SUCCESS:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    restaurantName: action.payload.restaurantName
                },
                error: null
            };
        default:
            return state;
    }
};

export default userReducer;