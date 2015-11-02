# AsyncBox [![npm version](https://badge.fury.io/js/async-box.svg)](https://badge.fury.io/js/async-box)

AsyncBox is a library for your main `application` object, it supports Sync and Async APIs

Requires runtime with `Map` and `Promise` APIs available.

Node 4+ and evergreen browsers will be the best option.

`Promise` can be polifilled with [Bluebird](https://github.com/petkaantonov/bluebird) library.

App object provides own API plus evented `EventEmitter` API

Usage:

```javascript
var AsyncBox = require('async-box');

var app = new AsyncBox();

app.respondAsync('some-request-name', function(requestData) {
    // response can be any plain JavaScript value or object or ...
    return 'response-text';
});

app.respondAsync('async-promise-request', function(requestData) {
    // ... or Promise
    return new Promise(function(resolve, reject) {
        resolve('response-promise');
    });
});

app.requestAsync('some-request-name').then(function(response) {
    console.log(response); // -> response-text
});

app.requestAsync('async-promise-request').then(function(response) {
    console.log(response); // -> response-promise
});

TODO: Batch API example
TODO: Sync API example
```
