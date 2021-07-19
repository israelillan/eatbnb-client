import {createSelector} from "reselect";

export const selectLoading = createSelector(
    [state=> state.backend],
    (state) => state.loading
);

export const selectError = createSelector(
    [state=> state.backend],
    (state) => state.error
);