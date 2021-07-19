import BackendActionsTypes from "./backend.actions.types";

export const loadingStart = () => ({
    type: BackendActionsTypes.LOADING_START
});

export const loadingEnd = () => ({
    type: BackendActionsTypes.LOADING_END
});

export const backendError = (error) => ({
    type: BackendActionsTypes.BACKEND_ERROR,
    payload: {error}
});
