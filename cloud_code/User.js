Parse.Cloud.beforeDelete(Parse.User, async (request) => {
	// delete user sessions
	const { object: user }  = request;
	const query = new Parse.Query(Parse.Session);
	query.equalTo("user", user);
	
	const results = await query.find({useMasterKey:true});
	Parse.Object.destroyAll(results, {useMasterKey:true});
});
