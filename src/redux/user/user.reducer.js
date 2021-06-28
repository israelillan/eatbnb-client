import INITIAL_STATE from "./user.state";
import UserActionTypes from "./user.actions.types";

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UserActionTypes.SIGN_IN_OR_UP_FAILURE:
            return {
                ...state,
                currentUser: null,
                error: action.payload
            };
        case UserActionTypes.SIGN_IN_SUCCESS:
            return {
                ...state,
                currentUser: action.payload,
                error: null
            };
        default:
            return state;
    }
};

export default userReducer;