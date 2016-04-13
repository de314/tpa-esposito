"use strict";


var ES = require('app/express-server');

ES.get('/api/twitter', (req, res) =>  res.send('Twitter Feature!!!!'));

ES.post('/api/twitter/seed', (req, res) =>  {
	let userId = req.query.userId;
	if (!userId) {
		res.send(false);
		return;
	}
	// TODO
	console.log(userId);
	res.send(true);
});
