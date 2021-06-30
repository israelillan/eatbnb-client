import INITIAL_STATE from "./table.state";
import TableActionsTypes from "./table.actions.types";
import UserActionTypes from "../user/user.actions.types";

const tableReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TableActionsTypes.TABLE_BACKEND_ERROR:
            return {
                ...state,
                error: action.payload.error
            };
        case UserActionTypes.SIGN_OUT_SUCCESS:
            return {
                ...state,
                error: null,
                tables: []
            };
        case TableActionsTypes.CREATE_TABLE_SUCCESS:
            return {
                ...state,
                error: null,
                tables: [...state.tables, action.payload]
            }
    }
};

export default tableReducer;