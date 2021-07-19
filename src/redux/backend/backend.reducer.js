import INITIAL_STATE from "./backend.state";
import BackendActionsTypes from "./backend.actions.types";

const backendReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case BackendActionsTypes.LOADING_START:
            return {
                ...state,
                loading: true
            }
        case BackendActionsTypes.LOADING_END:
            return {
                ...state,
                loading: false
            }
        case BackendActionsTypes.BACKEND_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case BackendActionsTypes.CLEAR_BACKEND_ERROR:
            return {
                ...state,
                loading: false,
                error: null
            }
        default:
            return state;

    }
};

export default backendReducer;