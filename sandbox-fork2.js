var cluster = require('cluster');

cluster.setupMaster({
  exec : "sandbox-fork1-runner.js",
  silent : false
});

const redis = require("redis");
const redisClient = redis.createClient();

redisClient.on("error", function(error) {
  console.error(error);
});

const someService = (() => {
  return {
    fast: async () => {
      await delay();
      return Math.random();
    },
    slow: async () => {
      await delay(3000);
      return Math.random();
    },
    redis: async () => {
      const key = 'key'
      return new Promise((resolve, reject) => {
        redisClient.get(key, (err, v) => {
          resolve(v)
        })
      })
    },
  }
})();

cluster.on( "online", function(worker) {
  worker.send({type: 'start'})

  var timer = 0;
  worker.on( "message", async function(msg) {
    if (msg.type === 'redis') {

      const result = await someService.redis();
      worker.send({type: 'redis', result})

    } else {
      clearTimeout(timer); //The worker responded in under 5 seconds, clear the timeout
      worker.destroy(); //Don't leave him hanging
    }
  });
  // worker.on( "message", function(msg) {
  //   clearTimeout(timer); //The worker responded in under 5 seconds, clear the timeout
  //   worker.destroy(); //Don't leave him hanging
  // });
  timer = setTimeout( function() {
    worker.destroy(); //Give it 5 seconds to run, then abort it
  }, 2000);
});

module.exports.run = async (str, services) => {
  const worker = cluster.fork({key: str})
  return new Promise((resolve, reject) => {
    worker.on( "message", async function(msg) {
      if (msg.type === 'end') {
        return resolve(msg.result)
      }
    });
    worker.on('exit', (code, signal) => {
      return reject({code, signal})
    })
  })
}
