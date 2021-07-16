import {tableFromBackendObject} from "../table/table.utils";

export const reservationFromBackendObject = (backendObject, table) => {
    return {backendObject: backendObject, ...backendObject.attributes, table: tableFromBackendObject(table.backendObject)};
}

export const updateReservation = (reservations, reservationToUpdate) => {
    return reservations.map(reservation =>
        reservation.backendObject.id === reservationToUpdate.backendObject.id
            ? reservationToUpdate
            : reservation
    );
};

export const removeReservation = (reservations, reservationToRemove) => {
    return reservations.filter(reservation => reservation.backendObject.id !== reservationToRemove.backendObject.id);
};
