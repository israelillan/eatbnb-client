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

export const updateTableStart = (table, x = undefined, y = undefined, seats = undefined) => {
    x = x ? x : table.x;
    y = y ? y : table.y;
    seats = seats ? seats : table.seats;
    return {
        type: TableActionsTypes.UPDATE_TABLE_START,
        payload: {
            table, x, y, seats
        }
    }
};

export const updateTableSuccess = (table) => ({
    type: TableActionsTypes.UPDATE_TABLE_SUCCESS,
    payload: table
});

export const deleteTableStart = (table) => ({
    type: TableActionsTypes.DELETE_TABLE_START,
    payload: table
});

export const deleteTableSuccess = (table) => ({
    type: TableActionsTypes.DELETE_TABLE_SUCCESS,
    payload: table
});

export const getTablesSuccess = (tables) => ({
    type: TableActionsTypes.GET_TABLES_SUCCESS,
    payload: tables
})