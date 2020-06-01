module.exports = {
    db: "mongo-connection-uri",
    auth: {
        github: {
            client_id: "",
            client_secret: ""
        }
    },
    "jwt": {
		"sign_key":"4cahrtgdertrizwqq23egimnpeduizxx",
		"algorithm":"HS256",
		"ttl": 1296000
    },
    port: 3001,
}