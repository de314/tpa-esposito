'use strict';

var Datastore = require('nedb'),
	tweets = new Datastore();

module.exports = tweets;