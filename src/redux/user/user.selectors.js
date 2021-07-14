import { createSelector } from 'reselect';

const getUser = state => state.user;

export const selectCurrentUser = createSelector(
    [getUser],
    user => user.currentUser
);
