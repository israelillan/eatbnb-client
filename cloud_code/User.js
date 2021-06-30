Parse.Cloud.beforeDelete(Parse.User, async (request) => {
	// delete user sessions
	const { object: user }  = request;

	// delete user sessions
	const sessionsQuery = new Parse.Query(Parse.Session);
	sessionsQuery.equalTo("user", user);
	const sessionsResult = await sessionsQuery.find({useMasterKey:true});
	Parse.Object.destroyAll(sessionsResult, {useMasterKey:true});

	// delete user tables
	const tablesQuery = new Parse.Query("Table");
	tablesQuery.equalTo("user", user);
	const tablesResult = await tablesQuery.find({useMasterKey:true});
	Parse.Object.destroyAll(tablesResult, {useMasterKey:true});
});