import {createSelector} from "reselect";

export const selectReservations = createSelector(
    [state=> state.reservation],
    (state) => state.reservations
);
export const selectSort = createSelector(
    [state=> state.reservation],
    (state) => state.sort
);
export const selectTable = createSelector(
    [state=> state.reservation],
    (state) => state.table
);
export const selectQuery = createSelector(
    [state=> state.reservation],
    (state) => state.query
);
export const selectThereAreMoreReservations = createSelector(
    [state=> state.reservation],
    (state) => state.thereAreMoreReservations
);
