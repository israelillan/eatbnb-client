import INITIAL_STATE from "./reservation.state";
import ReservationActionsTypes from "./reservation.actions.types";
import {removeReservation, updateReservation} from "./reservation.utils";
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
                reservations: [],
                thereAreMoreReservations: true
            };
        case ReservationActionsTypes.CREATE_RESERVATION_SUCCESS:
            return {
                ...state,
                error: null,
                reservations: [],
                thereAreMoreReservations: true
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
                reservations: action.payload.reservations,
                table: action.payload.table,
                sort: action.payload.sort,
                query: action.payload.query,
                thereAreMoreReservations: action.payload.thereAreMoreReservations
            };
        case ReservationActionsTypes.GET_RESERVATIONS_REPORT_SUCCESS:
            return {
                ...state,
                reservationsReport: action.payload.reservationsReport
            }
        default:
            return state;

    }
};

export default reservationReducer;