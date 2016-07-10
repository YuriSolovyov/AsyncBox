# Async-Box 
[![npm version](https://badge.fury.io/js/async-box.svg)](https://www.npmjs.com/package/async-box)
[![Codeship CI status](https://img.shields.io/codeship/463f47b0-897a-0133-9ad9-16883749aea7.svg?maxAge=2592000)](https://codeship.com/projects/162482)

AsyncBox is a library for your main `application` object, it supports Sync and Async APIs

Requires runtime with `Map` and `Promise` APIs available.
Node 4+ and evergreen browsers are the best option.

`Promise` can be polifilled with [Bluebird](https://github.com/petkaantonov/bluebird) library.

App object provides own API plus evented `EventEmitter` API

### Install:

```
npm install async-box
```

### Use:

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
### License

MIT © Yury Solovyov
