import TableActionsTypes from "./table.actions.types";

export const createTableStart = (x, y, seats) => ({
    type: TableActionsTypes.CREATE_TABLE_START,
    payload: {x, y, seats}
});

export const createTableSuccess = (table) => ({
    type: TableActionsTypes.CREATE_TABLE_SUCCESS,
    payload: table
});

export const updateTableStart = (table, x, y, seats) => {
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