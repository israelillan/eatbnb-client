import {createSelector} from "reselect";

export const selectTables = createSelector(
    [state=> state.table],
    (state) => state.tables
);
