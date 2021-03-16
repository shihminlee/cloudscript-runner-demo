var cluster = require('cluster');

cluster.setupMaster({
  exec : "sandbox-fork2-runner.js",
  silent : false
});

cluster.on( "online", function(worker) {
  worker.send('')

  var timer = 0;
  worker.on( "message", function(msg) {
    clearTimeout(timer); //The worker responded in under 5 seconds, clear the timeout
    worker.destroy(); //Don't leave him hanging
  });
  timer = setTimeout( function() {
    worker.destroy(); //Give it 5 seconds to run, then abort it
  }, 2000);
});

module.exports.run = async (str) => {
  const worker = cluster.fork({key: str})
  return new Promise((resolve, reject) => {
    worker.on( "message", function(msg) {
      return resolve(msg)
    });
    worker.on('exit', (code, signal) => {
      return reject({code, signal})
    })
  })
}
