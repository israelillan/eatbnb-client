import ReservationActionsTypes from "./reservation.actions.types";

export const backendError = (error) => ({
    type: ReservationActionsTypes.RESERVATION_BACKEND_ERROR,
    payload: {error}
});

export const createReservationStart = (table, dateAndTime, customerName, customerPhone) => ({
    type: ReservationActionsTypes.CREATE_RESERVATION_START,
    payload: {table, dateAndTime, customerName, customerPhone}
});

export const createReservationSuccess = (reservation) => ({
    type: ReservationActionsTypes.CREATE_RESERVATION_SUCCESS,
    payload: reservation
});

export const updateReservationStart = (reservation, table, dateAndTime, customerName, customerPhone) => {
    return {
        type: ReservationActionsTypes.UPDATE_RESERVATION_START,
        payload: {
            reservation, table, dateAndTime, customerName, customerPhone
        }
    }
};

export const updateReservationSuccess = (reservation) => ({
    type: ReservationActionsTypes.UPDATE_RESERVATION_SUCCESS,
    payload: reservation
});

export const deleteReservationStart = (reservation) => ({
    type: ReservationActionsTypes.DELETE_RESERVATION_START,
    payload: reservation
});

export const deleteReservationSuccess = (reservation) => ({
    type: ReservationActionsTypes.DELETE_RESERVATION_SUCCESS,
    payload: reservation
});

export const getReservationsStart = (table, sort = undefined, query = undefined) => ({
    type: ReservationActionsTypes.GET_RESERVATIONS_START,
    payload: {
        table, sort, query
    }
});

export const getReservationsSuccess = (reservations, table, sort, query) => ({
    type: ReservationActionsTypes.GET_RESERVATIONS_SUCCESS,
    payload: {reservations, table, sort, query}
});

export const getReservationsReportStart = (date) => ({
    type: ReservationActionsTypes.GET_RESERVATIONS_REPORT_START,
    payload: {date}
})

export const getReservationsReportSuccess = (reservationsReport) => ({
    type: ReservationActionsTypes.GET_RESERVATIONS_REPORT_SUCCESS,
    payload: {reservationsReport}
});