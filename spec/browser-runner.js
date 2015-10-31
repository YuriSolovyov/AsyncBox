require.config({
    paths: {
       "async-box": "../dist/async-box.min",
    }
 });

 require(['async-box', './async-box-spec'], function(AsyncBox, Promise) {
    window.AsyncBox = AsyncBox;

    jasmine.getEnv().execute();
 });
