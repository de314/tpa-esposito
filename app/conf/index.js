"use strict";


switch (process.env.NODE_ENV) {
  case 'dev':
    module.exports = require('./dev');
    break;
  default:
    console.error("Unrecognized NODE_ENV: " + process.env.NODE_ENV);
    process.exit(1);
}
