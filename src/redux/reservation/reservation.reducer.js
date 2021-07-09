import INITIAL_STATE from "./reservation.state";
import ReservationActionsTypes from "./reservation.actions.types";
import {addReservations, removeReservation, updateReservation} from "./reservation.utils";
import UserActionTypes from "../user/user.actions.types";

const reservationReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ReservationActionsTypes.RESERVATION_BACKEND_ERROR:
            return {
                ...state,
                error: action.payload.error
            }
        case UserActionTypes.SIGN_OUT_SUCCESS:
            return {
                ...state,
                error: null,
                reservations: []
            };
        case ReservationActionsTypes.CREATE_RESERVATION_SUCCESS:
            return {
                ...state,
                error: null,
                reservations: []
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
        case ReservationActionsTypes.GET_RESERVATIONS_SUCCESS:
            return {
                ...state,
                error: null,
                reservations: action.payload.reservations
            };
        default:
            return state;

    }
};

export default reservationReducer;