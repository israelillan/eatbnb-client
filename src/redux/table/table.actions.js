import TableActionsTypes from "./table.actions.types";

export const backendError = (error) => ({
    type: TableActionsTypes.TABLE_BACKEND_ERROR,
    payload: {error}
});

export const createTableStart = (x, y, seats) => ({
    type: TableActionsTypes.CREATE_TABLE_START,
    payload: {x, y, seats}
});

export const createTableSuccess = (table) => ({
   type: TableActionsTypes.CREATE_TABLE_SUCCESS,
   payload: table
});
