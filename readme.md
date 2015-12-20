# AsyncBox [![npm version](https://badge.fury.io/js/async-box.svg)](https://badge.fury.io/js/async-box)

AsyncBox is a library for your main `application` object, it supports Sync and Async APIs

Requires runtime with `Map` and `Promise` APIs available.
Node 4+ and evergreen browsers are the best option.

`Promise` can be polifilled with [Bluebird](https://github.com/petkaantonov/bluebird) library.

App object provides own API plus evented `EventEmitter` API

### Usage:

```javascript
// create app object
var AsyncBox = require('async-box');
var app = new AsyncBox();
```

### Async API:
```javascript
app.respondAsync('some-request-name', function(requestData) {
    // response can be any plain JavaScript value, object or ...
    return 'response-text';
});

app.respondAsync('async-promise-request', function(requestData) {
    // ... or Promise
    return new Promise(function(resolve, reject) {
        resolve('response-promise');
    });
});

app.requestAsync('some-request-name').then(function(response) {
    console.log(response); // -> 'response-text'
});

app.requestAsync('async-promise-request').then(function(response) {
    console.log(response); // -> 'response-promise'
});
```

### Sync API:
```javascript
app.respondSync('some-sync-request', function(request-data) {
    // response is any valid JavaScript value
    return 'some-response-value';
});

const response = app.requestSync('some-sync-request');
console.log(response); // -> 'some-response-value'
```
### Batch API:

#### Async:
```javascript
app.respondAsync('request-type-one', function(requestData) {
    console.log(requestData); // -> { key: 'some-value' }
    // it could be any amount of code here,
    // the main rule is to return a Promise
    return new Promise(function(resolve, reject) {
        resolve('one');
    });
});

app.respondAsync('request-type-two', function(requestData) {
    console.log(requestData); // -> { key: 'other-value' }
    return new Promise(function(resolve, reject) {
        resolve('two');
    });
});

app.requestAllAsync([
    ['request-type-one', { key: 'some-value' }],
    ['request-type-two', { key: 'other-value' }],
]).then(function(results) {
    console.log(results); // -> ['one', 'two']
});
```
#### Sync: 
```javascript
app.respondSync('sync-request-one', function(requestData) {
    console.log(requestData); // -> { key: 'sync-one' }
    return 'sync-one';
});

app.respondSync('sync-request-two', function(requestData) {
    console.log(requestData); // -> { key: 'sync-two' }
    return 'sync-two';
});

const responses = app.requestAllSync([
    ['sync-request-one', { key: 'sync-one' }],
    ['sync-request-two', { key: 'sync-two' }],
]);

console.log(responses); // ['sync-one', 'sync-two']
```
