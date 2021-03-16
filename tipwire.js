var tripwire = require('tripwire');

process.on('uncaughtException', function (e) {
  if (undefined === tripwire.getContext())
    console.log('The exception was not caused by tripwire.');
  else
    console.log('The event loop was blocked for longer than 2000 milliseconds');
  process.exit(1);
});

// set the limit of execution time to 2000 milliseconds
var context = { someData: "foobar" };
tripwire.resetTripwire(2000, context);