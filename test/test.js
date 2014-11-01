
var Backoff = require('../lib/backoff');

var retrier = new Backoff(function(callback){
    console.log('attempt');
    setTimeout(function(){
        console.log('returning false');
        callback(new Error("Moooo"));
    }, 100);
}, function(err) {
    console.log('finished', err);
});

retrier.on('attempt_failed', function(err){
    console.log("attempt failed: ", err);
    if (Math.random() < 0.2) {
        retrier.cancel();
        console.log("cancelled!");
    }
});

retrier.on('attempt_failed', console.log);
