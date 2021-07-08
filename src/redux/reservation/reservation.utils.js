export const updateReservation = (reservations, reservationToUpdate) => {
    return reservations.map(reservation =>
        reservation.id === reservationToUpdate.id
            ? reservationToUpdate
            : reservation
    );
};
export const removeReservation = (reservations, reservationToRemove) => {
    return reservations.filter(reservation => reservation.id !== reservationToRemove.id);
};