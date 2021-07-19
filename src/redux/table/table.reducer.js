import INITIAL_STATE from "./table.state";
import TableActionsTypes from "./table.actions.types";
import UserActionTypes from "../user/user.actions.types";
import {removeTable, updateTable} from "./table.utils";

const tableReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
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
            };
        case TableActionsTypes.UPDATE_TABLE_SUCCESS:
            return {
                ...state,
                error: null,
                tables: updateTable(state.tables, action.payload)
            };
        case TableActionsTypes.DELETE_TABLE_SUCCESS:
            return {
                ...state,
                error: null,
                tables: removeTable(state.tables, action.payload)
            };
        case TableActionsTypes.GET_TABLES_SUCCESS:
            return {
                ...state,
                tables: action.payload
            };
        default:
            return state;

    }
};

export default tableReducer;