backoff-retry
=============

Simple library for retrying an async operation with exponential backoff.


```javascript
var Backoff = require('../lib/backoff');

function runAttempt(callback) {
    setTimeout(function(){
        // alwasy fail for this example 
        callback(new Error("Failing on purpose"));
    }, 100);
}

var retrier = new Backoff(runAttempt, function(err) {
    console.log('finished', err);
});

retrier.on('attempt_failed', console.log);

```

Will output

```
[Error: Backoff Failed (0): Failing on purpose]
[Error: Backoff Failed (1): Failing on purpose]
[Error: Backoff Failed (2): Failing on purpose]
[Error: Backoff Failed (3): Failing on purpose]
[Error: Backoff Failed (4): Failing on purpose]
[Error: Backoff Failed (5): Failing on purpose]
[Error: Backoff Failed (6): Failing on purpose]
[Error: Backoff Failed (7): Failing on purpose]
[Error: Backoff Failed (8): Failing on purpose]
[Error: Backoff Failed (9): Failing on purpose]
[Error: Backoff Failed (10): Failing on purpose]
finished [Error: Failing on purpose]
```
