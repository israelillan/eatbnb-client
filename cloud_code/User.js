Parse.Cloud.beforeDelete(Parse.User, async (request) => {
	const { object: user }  = request;
	const limit = 100;

	let results = [];
	let skip = 0;

	// delete user sessions
	skip = 0;
	while(true) {
		const sessionsQuery = new Parse.Query(Parse.Session);
		sessionsQuery.equalTo("user", user);
		sessionsQuery.limit(limit);
		sessionsQuery.skip(skip);
		const sessionsResult = await sessionsQuery.find({useMasterKey:true});
		results = results.concat(sessionsResult);
		if (sessionsResult.length < limit) {
			break;
		}
		skip += limit;
	}


	// delete user tables
	skip = 0;
	while(true) {
		const tablesQuery = new Parse.Query("Table");
		tablesQuery.equalTo("user", user);
		tablesQuery.limit(limit);
		tablesQuery.skip(skip);
		const tablesResult = await tablesQuery.find({useMasterKey:true});
		results = results.concat(tablesResult);
		if (tablesResult.length < limit) {
			break;
		}
		skip += limit;
	}

	// delete table reservations
	Parse.Object.destroyAll(results, {useMasterKey: true});
});