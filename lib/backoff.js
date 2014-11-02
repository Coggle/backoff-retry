
var EventEmitter = require('events').EventEmitter;
var util         = require('util');


function Backoff(fn, callback, opts){
    this.attempts = 0;
    this.delay = (opts && opts.delay) || 100;
    this.exponent = (opts && opts.delay) || 1.4;
    this.maxAttemps = (opts && opts.maxAttemps) || 10;
    this.fn = fn;
    this.cancelled = false;

    return this.attempt(callback);
}
util.inherits(Backoff, EventEmitter);

Backoff.prototype.cancel = function() {
    if (this.queued_timeout) {
        clearTimeout(queued_timeout);
    }
    this.cancelled = true;
    return this;
}

Backoff.prototype.attempt = function(callback) {
    this.fn(function(err){
        if (err){
            if (this.attempts > this.maxAttemps) {
                return callback(err);
            } else {
                err.message = 'Backoff Failed ('+this.attempts+'): ' + err.message;
                this.emit("attempt_failed", err);
                if (!this.cancelled) {
                    this.attempts++;
                    this.queued_timeout = setTimeout(function() {
                        this.queued_timeout = null;
                        this.attempt(callback);
                    }.bind(this), this.backoff());
                }
            } 
        } else {
            callback.apply(callback, arguments);
        }
    }.bind(this));
    return this;
}

Backoff.prototype.backoff = function() {
    return Math.pow(this.exponent, this.attempts) * this.delay * Math.random(); 
}

module.exports = Backoff;
