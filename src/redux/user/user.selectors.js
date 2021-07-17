import { createSelector } from 'reselect';

export const selectCurrentUser = createSelector(
    [state => state.user],
    state => state.currentUser
);
export const selectError = createSelector(
    [state => state.user],
    state => state.error
);
