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

export const updateReservationStart = (reservation, table= undefined, dateAndTime= undefined, customerName= undefined, customerPhone = undefined) => {
    table = table ? table : reservation.table;
    dateAndTime = dateAndTime ? dateAndTime : reservation.dateAndTime;
    customerName = customerName ? customerName : reservation.customerName;
    customerPhone = customerPhone ? customerPhone : reservation.customerPhone;
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
