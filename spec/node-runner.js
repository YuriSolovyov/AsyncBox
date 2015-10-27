var Jasmine = require('jasmine');
var Reporter = require('jasmine-spec-reporter');

var runner = new Jasmine();
runner.configureDefaultReporter({
    print: function() {},
});
var reporter = new Reporter({
    displayStacktrace: 'specs',
    displaySpecDuration: true,
    prefixes: {
        success: '> ',
        failure: 'X ',
        pending: '~ '
    }
});

jasmine.getEnv().addReporter(reporter);
runner.loadConfigFile();

require('jasmine-expect');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 100;

runner.execute();
