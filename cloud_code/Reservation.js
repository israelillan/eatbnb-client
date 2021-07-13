Parse.Cloud.beforeSave("Reservation", async (request) => {
    const user = request.user;

    if (!user) {
        throw new Parse.Error(300, 'User must be authenticated to write reservations');
    }

    const requestTable = request.object.get('table');
    const tableQuery = new Parse.Query('Table');
    const table = await tableQuery.get(requestTable.id, {useMasterKey: true});
    if (table.get("user").id !== user.id) {
        throw new Parse.Error(304, 'You don\'t have permission to do that');
    }

    const dateAndTime = request.object.get('dateAndTime');
    if (!dateAndTime) {
        throw new Parse.Error(301, 'Date and time must be defined');
    }

    dateAndTime.setHours(dateAndTime.getHours() + Math.floor(dateAndTime.getMinutes()/60));
    dateAndTime.setMinutes(0, 0, 0);
    request.object.set('dateAndTime', dateAndTime);

    const reservationsInSameTimeQuery = new Parse.Query("Reservation");
    reservationsInSameTimeQuery.equalTo('table', requestTable);
    reservationsInSameTimeQuery.equalTo('dateAndTime', dateAndTime);
    const reservationInSameTime = await reservationsInSameTimeQuery.find({useMasterKey: true});

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

Parse.Cloud.beforeFind("Reservation", async (request) => {
    if (!request.master) {
        const user = request.user;

        if (!user) {
            throw new Parse.Error(300, 'User must be authenticated to read reservations');
        }

        request.query.include('table');
    }
});

Parse.Cloud.afterFind("Reservation", async (request) => {
    const {objects} = request;

    if (!request.master) {
        const user = request.user;

        if (!user) {
            throw new Parse.Error(300, 'User must be authenticated to read reservations');
        }

        const ret = objects.filter(o => {
            const table = o.get('table');
            const tableUser = table.get('user');
            if(!tableUser) {
                return true;
            }
            return tableUser.id === user.id;
        });
        return ret;
    } else {
        return objects;
    }
});

Parse.Cloud.beforeDelete("Reservation", async (request) => {
    if (!request.master) {
        const user = request.user;

        if (!user) {
            throw new Parse.Error(300, 'User must be authenticated to delete reservations');
        }

        const requestTable = request.object.get('table');
        const tableQuery = new Parse.Query('Table');
        const table = await tableQuery.get(requestTable.id, {useMasterKey: true});
        if (table.get("user").id !== user.id) {
            throw new Parse.Error(304, 'You don\'t have permission to do that');
        }
    }
});