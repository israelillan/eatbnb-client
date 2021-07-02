Parse.Cloud.beforeSave("Table", async (request) => {
    const user = request.user;

    if (!user) {
        throw new Parse.Error(200, 'User must be authenticated to write tables');
    }

    if (request.object.get('seats') < 1) {
        throw new Parse.Error(201, 'Table needs at least 1 seat');
    }

    const x = request.object.get('x');
    const y = request.object.get('y');
    if (x < 0 || y < 0 || x > 14 || y > 9) {
        throw new Parse.Error(202, 'Table layout is 15x10');
    }
    const tablesInSamePositionQuery = new Parse.Query("Table");
    tablesInSamePositionQuery.equalTo('user', user);
    tablesInSamePositionQuery.equalTo('x', x);
    tablesInSamePositionQuery.equalTo('y', y);
    const tablesInSamePosition = await tablesInSamePositionQuery.find({useMasterKey: true});

    if (request.object.isNew()) {
        if (tablesInSamePosition.length !== 0) {
            throw new Parse.Error(203, 'There is already a table in that spot');
        }

        const allUserTablesQuery = new Parse.Query("Table");
        allUserTablesQuery.equalTo('user', user);
        const allUserTables = await allUserTablesQuery.find({useMasterKey: true});

        const existingReferences = new Set();
        for(let i = 0; i < allUserTables.length; i++) {
            const reference = allUserTables[i].get('reference');
            existingReferences.add(reference);
        }

        let nextReference = 1;
        while(existingReferences.has(nextReference)) {
            nextReference++;
        }

        request.object.set('reference', nextReference);
        request.object.set('user', user);

        await Parse.Config.save({
            tableAutoReference: nextReference
        }, {useMasterKey: true});
    } else {
        const tableId = request.object.id;
        for(let i = 0; i < tablesInSamePosition.length; i++) {
            if (tablesInSamePosition[i].id !== tableId) {
                throw new Parse.Error(203, 'There is already a table in that spot');
            }
        }

        if (request.object.get("user").id !== user.id) {
            throw new Parse.Error(204, 'You don\'t have permission to do that');
        }
    }
});

Parse.Cloud.beforeFind("Table", async (request) => {
    if (!request.master) {
        const user = request.user;

        if (!user) {
            throw new Parse.Error(200, 'User must be authenticated to read tables');
        }

        const query = request.query;
        const otherQuery = new Parse.Query('Table');
        otherQuery.equalTo('user', user);

        return Parse.Query.and(query, otherQuery);
    }
});