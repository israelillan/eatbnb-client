Parse.Cloud.beforeSave("Reservation", async (request) => {
    const user = request.user;

    if (!user) {
        throw new Parse.Error(300, 'User must be authenticated to write reservations');
    }

    const dateAndTime = request.object.get('dateAndTime');
    if (!dateAndTime) {
        throw new Parse.Error(301, 'Date and time must be defined');
    }

    dateAndTime.setHours(dateAndTime.getHours() + Math.round(dateAndTime.getMinutes()/60));
    dateAndTime.setMinutes(0, 0, 0);
    request.object.set('dateAndTime', dateAndTime);

    const reservationsInSameTimeQuery = new Parse.Query("Reservation");
    reservationsInSameTimeQuery.equalTo('table', request.object.get('table'));
    reservationsInSameTimeQuery.equalTo('dateAndTime', dateAndTime);
    const reservationInSameTime = await reservationsInSameTimeQuery.find();

    if (request.object.isNew()) {
        if (reservationInSameTime.length !== 0) {
            throw new Parse.Error(303, 'There is already a reservation in that time');
        }
    } else {
        const reservationId = request.object.id;
        for(let i = 0; i < reservationInSameTime.length; i++) {
            if (reservationInSameTime[i].id !== reservationId) {
                throw new Parse.Error(303, 'There is already a reservation at that time');
            }
        }
    }
});
