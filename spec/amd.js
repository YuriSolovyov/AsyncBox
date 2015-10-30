require.config({
    paths: {
       "bluebird": "../node_modules/bluebird/js/browser/bluebird.min",
       "wolfy87-eventemitter": "../node_modules/wolfy87-eventemitter/EventEmitter.min",
       "async-box": "../dist/async-box.min",
    }
 });

 require(['async-box', 'bluebird', './async-box-spec'], function(AsyncBox, Promise) {
    window.AsyncBox = AsyncBox;
    window.Promise = Promise;

    jasmine.getEnv().execute();
 });
