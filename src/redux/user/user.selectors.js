import { createSelector } from 'reselect';

const getUser = state => state.currentUser;

export const selectCurrentUser = createSelector(
    [state => state.user],
    getUser
);
