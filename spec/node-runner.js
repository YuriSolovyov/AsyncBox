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
runner.loadConfig({
    spec_dir: "spec",
    spec_files: [
        "**/*[sS]pec.js"
    ],
    helpers: [
        "helpers/**/*.js"
    ]
});

runner.execute();
