import INITIAL_STATE from "./reservation.state";
import ReservationActionsTypes from "./reservation.actions.types";
import {removeReservation, updateReservation} from "./reservation.utils";

const reservationReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ReservationActionsTypes.RESERVATION_BACKEND_ERROR:
            return {
                ...state,
                error: action.payload.error
            };
        case ReservationActionsTypes.CREATE_RESERVATION_SUCCESS:
            return {
                ...state,
                error: null,
                reservations: [...state.reservations, action.payload]
            };
        case ReservationActionsTypes.UPDATE_RESERVATION_SUCCESS:
            return {
                ...state,
                error: null,
                reservations: updateReservation(state.reservations, action.payload)
            };
        case ReservationActionsTypes.DELETE_RESERVATION_SUCCESS:
            return {
                ...state,
                error: null,
                reservations: removeReservation(state.reservations, action.payload)
            };
        default:
            return state;

    }
};

export default reservationReducer;