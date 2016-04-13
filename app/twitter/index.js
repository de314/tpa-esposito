"use strict";


require('app/twitter/endpoints');

let twitter = require('app/twitter/twitter'),
	tClient = twitter.tClient;

// tClient.get('search/tweets', {q: 'node.js'}, function(error, tweets, response){
//    console.log(tweets);
// });
