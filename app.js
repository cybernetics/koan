'use strict';

var config = require('./server/config/config'),
    mongo = require('./server/config/mongo'),
    mongoSeed = require('./server/config/mongo-seed'),
    koaConfig = require('./server/config/koa'),
    ws = require('./server/config/ws'),
    co = require('co'),
    koa = require('koa'),
    app = module.exports = koa();

/**
 * Entry point for KOAN app. Initiates database connection and starts listening for requests on configured port.
 */
co(function *() {
  // initialize mongodb and populate the database with seed data if empty
  yield mongo.connect();
  yield mongoSeed();

  // koa config
  koaConfig(app);

  if (!module.parent) {
    // create http and websocket servers and start listening for requests
    exports.server = app.listen(config.app.port);
    ws.listen(exports.server);
    console.log('KOAN listening on port ' + config.app.port);
  }
})();