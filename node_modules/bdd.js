db.createCollection("joueur", {
	validator: {
		$jsonSchema: {
			bsonType: "object",
			required: [ "username", "password"],
			properties: {
				username: {
					bsonType: "string",
					description: "have to be a string and is required "
				},
				password: {
					bsonType: "string",
					description: "have to contain letter and number if people want"
				}
			} 

		}
	}
})