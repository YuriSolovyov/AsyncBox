'use strict';
module.exports = (function() {

    const DefaultPromise = Promise;
    const EventEmitter = require('events');

    const AsyncBox = function(options) {

        const Promise = (options && options.promise) || DefaultPromise;

        const asyncHandlers = new Map();
        const syncHandlers = new Map();

        const checkHandlerIsNew = function(type) {
            const handlerInstalled = asyncHandlers.has(type) || syncHandlers.has(type);
            if (handlerInstalled) {
                throw new Error('Handler for ' + type + ' request is already set');
            }
        };

        const getRequestHandler = function(type, map) {
            const handler = map.get(type);
            if (handler) {
                return handler;
            }
            throw new Error('No handler found for ' + type + ' request');
        };

        const respondAsync = function(type, handler) {
            asyncHandlers.set(type, handler);
        };

        const respondSync = function(type, handler) {
            syncHandlers.set(type, handler);
        };

        const requestAsync = function(type, handler, args) {
            return new Promise(function(resolve) {
                resolve(handler.apply(null, args.slice(1)));
            });
        };

        const requestSync = function(type, handler, args) {
            return handler.apply(null, args.slice(1));
        };

        EventEmitter.apply(this);

        this.respondAsync = function(type, handler) {
            checkHandlerIsNew(type);
            respondAsync(type, handler);
        };

        this.respondSync = function(type, handler) {
            checkHandlerIsNew(type);
            respondSync(type, handler);
        };

        this.requestAsync = function(type) {
            const handler = getRequestHandler(type, asyncHandlers);
            const args = new Array(arguments.length);
            for (var i = 0; i < arguments.length; i += 1) {
                args[i] = arguments[i];
            }
            return requestAsync(type, handler, args);
        };

        this.requestSync = function(type) {
            const handler = getRequestHandler(type, syncHandlers);
            const args = new Array(arguments.length);
            for (var i = 0; i < arguments.length; i += 1) {
                args[i] = arguments[i];
            }
            return requestSync(type, handler, args);
        };

        this.requestAllAsync = function(array) {
            const promises = array.map(function(requestArgs) {
                const type = requestArgs[0];
                const handler = getRequestHandler(type, asyncHandlers);
                return requestAsync(type, handler, requestArgs);
            });

            return Promise.all(promises);
        };

        this.requestAllSync = function(array) {
            return array.map(function(requestArgs) {
                const type = requestArgs[0];
                const handler = getRequestHandler(type, syncHandlers);
                return requestSync(type, handler, requestArgs);
            });
        };
    };

    AsyncBox.prototype = Object.create(EventEmitter.prototype);

    return AsyncBox;

})();
