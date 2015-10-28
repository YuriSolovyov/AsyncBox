module.exports = (function() {
    var Promise = require('bluebird');
    var EventEmitter = require('wolfy87-eventemitter');

    var AsyncBox = function() {
        var asyncHandlers = new Map();
        var syncHandlers = new Map();

        var checkHandlerIsNew = function(type) {
            var handlerInstalled = asyncHandlers.has(type) || syncHandlers.has(type);
            if (handlerInstalled) {
                throw new Error('Handler for ' + type + ' request is already set');
            }
        };

        var getRequestHandler = function(type, map) {
            var handler = map.get(type);
            if (handler) {
                return handler;
            }
            throw new Error('No handler found for ' + type + ' request');
        };

        var respondAsync = function(type, handler) {
            asyncHandlers.set(type, handler);
        };

        var respondSync = function(type, handler) {
            syncHandlers.set(type, handler);
        };

        var requestAsync = function(type, handler, args) {
            return new Promise(function(resolve) {
                resolve(handler.apply(null, args.slice(1)));
            });
        };

        var requestSync = function(type, handler, args) {
            return handler.apply(null, args.slice(1));
        };

        EventEmitter(this);

        this.respondAsync = function(type, handler) {
            checkHandlerIsNew(type);
            respondAsync(type, handler);
        };

        this.respondSync = function(type, handler) {
            checkHandlerIsNew(type);
            respondSync(type, handler);
        };

        this.requestAsync = function(type) {
            var handler = getRequestHandler(type, asyncHandlers);
            var args = new Array(arguments.length);
            for (var i = 0; i < arguments.length; ++i) {
                args[i] = arguments[i];
            }
            return requestAsync(type, handler, args);
        };

        this.requestSync = function(type) {
            var handler = getRequestHandler(type, syncHandlers);
            var args = new Array(arguments.length);
            for (var i = 0; i < arguments.length; ++i) {
                args[i] = arguments[i];
            }
            return requestSync(type, handler, args);
        };

        this.requestAllAsync = function(array) {
            return Promise.map(array, function(requestArgs) {
                var type = requestArgs[0];
                var handler = getRequestHandler(type, asyncHandlers);
                return requestAsync(type, handler, requestArgs);
            }).all();
        };

        this.requestAllSync = function(array) {
            return array.map(function(requestArgs) {
                var type = requestArgs[0];
                var handler = getRequestHandler(type, syncHandlers);
                return requestSync(type, handler, requestArgs);
            });
        };
    };

    AsyncBox.prototype = Object.create(EventEmitter.prototype);

    if (typeof window !== 'undefined') {
        window.AsyncBox = AsyncBox;
        window.Promise = Promise;
    }

    return AsyncBox;
})();
