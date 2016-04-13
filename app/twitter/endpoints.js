"use strict";


let ES = require('app/express-server'),
	TwitterService = require('app/twitter/twitter'),
	_ = require('underscore');


let tClient = TwitterService.tClient;


// Register a proxy for the twitter search API
ES.get('/api/twitter/search', (req, res) =>  {
	let q = req.query.q;
	TwitterService.search(q, function(tweets) {
		res.send(tweets);
	});
});


// Register a proxy for the twitter profile timeline API
ES.get('/api/twitter/timeline', (req, res) =>  {
	let screenName = req.query.screen_name;
	TwitterService.timeline(screenName, function(tweets) {
		res.send(tweets);
	});
});
