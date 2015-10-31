describe("async-box", function() {

    delay = function(ms) {
        return new Promise(function(resolve) {
            setTimeout(function() {
                resolve();
            }, ms);
        });
    };

    var app;
    beforeEach(function() {
        app = new AsyncBox();
    });

    describe('Infrastructure', function() {

        it('should create proper app object', function() {
            expect(AsyncBox).toBeFunction();

            expect(app).toBeObject();
            expect(app instanceof AsyncBox).toBe(true);

            expect(app.on).not.toBeUndefined();
            expect(app.emit).not.toBeUndefined();
        });

    });

    describe('Sync API', function() {

        it('should respond to sync request', function() {
            app.respondSync('req-type', function() {
                return 'sync-response';
            });

            expect(app.requestSync('req-type')).toBe('sync-response');
        });

        it('should pass request arguments', function() {
            app.respondSync('req-type', function(arg1, arg2, arg3) {
                expect(arg1).toBe('arg1');
                expect(arg2).toBe('arg2');
                expect(arg3).toBe('arg3');
                return [arg1, arg2, arg3].join('-');
            });

            expect(app.requestSync('req-type', 'arg1', 'arg2', 'arg3')).toBe('arg1-arg2-arg3');
        });

        it('should throw if no response handler installed', function() {
            expect(function() {
                app.requestSync('no-such-handler');
            }).toThrow();
        });

        it('should throw if handler is already set', function() {
            app.respondSync('req-type', function() {
                return 'response-1';
            });

            expect(app.requestSync('req-type')).toBe('response-1');

            expect(function() {
                app.respondSync('req-type', function() {
                    return 'response-2';
                });
            }).toThrow();
        });

    });

    describe('Async API', function() {

        it('should respond to async request with plain value', function(done) {
            app.respondAsync('req-type', function() {
                return 'async-response';
            });

            app.requestAsync('req-type').then(function(response) {
                expect(response).toBe('async-response');
                done();
            });
        });

        it('should respond to async request with promise', function(done) {
            app.respondAsync('req-type', function() {
                return delay(42).then(function() {
                    return 'async-response';
                })
            });

            app.requestAsync('req-type').then(function(response) {
                expect(response).toBe('async-response');
                done();
            });
        });

        it('should pass async request arguments', function(done) {
            app.respondAsync('req-type', function(arg1, arg2, arg3) {
                expect(arg1).toBe('arg1');
                expect(arg2).toBe('arg2');
                expect(arg3).toBe('arg3');
                return [arg1, arg2, arg3].join('-');
            });


            app.requestAsync('req-type', 'arg1', 'arg2', 'arg3').then(function(response) {
                expect(response).toBe('arg1-arg2-arg3');
                done();
            });
        });

    });

    describe('Batch API', function() {

        it('should return array as response of requestAllSync call', function() {
            app.respondSync('request-type-1', function(arg) {
                return arg;
            });

            app.respondSync('request-type-2', function(arg) {
                return 'request-arg-' + arg;
            });

            var responses = app.requestAllSync([
                ['request-type-1', 'request-arg-1'],
                ['request-type-1', 'request-arg-2'],
                ['request-type-1', 'request-arg-3'],

                ['request-type-2', 4],
                ['request-type-2', 5],
                ['request-type-2', 6],
            ]);

            expect(responses).toBeArray();
            expect(responses.length).toBe(6);

            expect(responses).toContain('request-arg-1');
            expect(responses).toContain('request-arg-2');
            expect(responses).toContain('request-arg-3');

            expect(responses).toContain('request-arg-4');
            expect(responses).toContain('request-arg-5');
            expect(responses).toContain('request-arg-6');

        });

        it('should resolve a promise with responses array', function(done) {
            app.respondAsync('request-type-1', function(arg) {
                return delay(42).then(function() {
                    return arg;
                });
            });

            app.respondAsync('request-type-2', function(arg) {
                return delay(33).then(function() {
                    return 'request-arg-' + arg;
                });
            });

            app.requestAllAsync([
                ['request-type-1', 'request-arg-1'],
                ['request-type-1', 'request-arg-2'],
                ['request-type-1', 'request-arg-3'],

                ['request-type-2', 4],
                ['request-type-2', 5],
                ['request-type-2', 6],
            ]).then(function(responses) {
                expect(responses).toBeArray();
                expect(responses.length).toBe(6);

                expect(responses).toContain('request-arg-1');
                expect(responses).toContain('request-arg-2');
                expect(responses).toContain('request-arg-3');

                expect(responses).toContain('request-arg-4');
                expect(responses).toContain('request-arg-5');
                expect(responses).toContain('request-arg-6');

                done()
            });

        });

    });
});
