import {createSelector} from "reselect";

export const getTables = (state) => state.tables;

export const selectTables = createSelector(
    [state=> state.table],
    table => table.tables
);
