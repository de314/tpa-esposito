"use strict";


let Twitter = require('twitter'),
	config = require('app/conf'), // {base}/app/conf/index.js
	_ = require('underscore');


// configure twitter client. Configs come from the process.env.NODE_ENV specified config.
// See {base}/app/conf/index.js for more details.
let client = new Twitter({
  consumer_key: config.TWITTER_CONSUMER_KEY,
  consumer_secret: config.TWITTER_CONSUMER_SECRET,
  access_token_key: config.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: config.TWITTER_ACCESS_TOKEN_SECRET,
});


// Export the raw twitter client as well as special functionality for calls to the twitter search/timeline endpoints.
module.exports = {
	tClient: client,
	/*
		Makes a request to the twitter search endpoint.
		q: is the query string. MUST be a String. MUST NOT be empty.
		cb: The success callback. MUST be a function. MUST NOT be null. Should accept a search results object.
				See twitter api docs for more info. https://dev.twitter.com/rest/reference/get/search/tweets
				Provides the callback with literal bool false if there was an error.
	*/
	search: function(q, cb) {
		// if no callback, then no reason to make the call
		if (_.isFunction(cb)) {
			// fail on bad input
			if (_.isString(q) && !_.isEmpty(q)) {
				client.get('search/tweets', {q: q}, function(error, tweets){
					if (!!error) {
						console.error("Failed to get search reqsults for query: " + q);
						console.error(error);
						// return false if there was an error.
						cb(false);
					} else {
						cb(tweets);
					}
				});
			} else {
				console.error("query param 'q' not provided");
				// return false if there was an error.
				cb(false);
			}
		} else {
			console.error("Callback not provided");
		}
	},
	/*
		Makes a request to the twitter timeline endpoint.
		screenName: The screen name for the requested user. MUST be a String. MUST NOT be empty. Does not 
				check if user exists before making request. If user does not exist then an Error is thrown.
		cb: The success callback. MUST be a function. MUST NOT be null. Should accept a search results object.
				See twitter api docs for more info. https://dev.twitter.com/rest/reference/get/search/tweets
				Provides the callback with literal bool false if there was an error.
	*/
	timeline: function(screenName, cb) {
		if (_.isFunction(cb)) {
			if (_.isString(screenName) && !_.isEmpty(screenName)) {
				if (screenName.charAt(0) === '@') {
					screenName = screenName.substring(1);
				}
				client.get('statuses/user_timeline', { screen_name: screenName }, function(error, tweets) {
					if (!!error) {
						console.error("Failed to get user timeline for " + screenName);
						console.error(error);
						// return false if there was an error
						cb(false);
					} else {
						cb(tweets);
					}
				});
			} else {
				console.error("screenName missing");
				// return false if there was an error
				cb(false);
			}
		} else {
			console.error("Callback not provided");
		}
	}
};