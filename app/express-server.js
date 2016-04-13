"use strict";


let express = require('express'),
	config = require('app/conf');

let ExpressServer = express();

// Confgiure Express Environment
ExpressServer.set('port', config.EXPRESS_PORT || 3333);

// serve public dir
ExpressServer.use('/', express.static('ui'));

// Start Express Server
ExpressServer.listen(ExpressServer.get('port'), () => console.log('Express started. Press CTRL-C to terminate.'));


module.exports = ExpressServer;