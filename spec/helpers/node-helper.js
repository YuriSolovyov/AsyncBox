jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;

require('jasmine-expect');

global.AsyncBox = require('../../lib/main');
global.Promise = require('bluebird');
