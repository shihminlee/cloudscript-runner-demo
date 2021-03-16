const express = require('express')
const delay = require('delay');
const deepFreeze = require('deep-freeze');
const bodyParser = require('body-parser')
const redis = require("redis");
const ipc=require('node-ipc');
const redisClient = redis.createClient();
const socketPath = '/tmp/ipc.sock';

redisClient.on("error", function(error) {
  console.error(error);
});
const app = express()
const port = 3000

redisClient.set('key', 'value')

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

const asyncRedisClientGet = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, v) => {
      resolve(v)
    })
  })
}

const services = { someService: deepFreeze(someService), redisClient }
const memory = {}

ipc.config.id   = 'world';
ipc.config.retry= 1500;
ipc.config.silent   = true;

ipc.serve(
    function(){
        ipc.server.on(
            'message',
            async function(data,socket){
                const value = await asyncRedisClientGet('key')

                ipc.server.emit(
                    socket,
                    'message',
                    value
                );
            }
        );
    }
);

ipc.server.start();

app.use(bodyParser.json());

app.get('/runner/vm/scripts/:str', async (req, res) => {
  try {
    try {
      const sandbox = require('./sandbox-vm');
      const str = req.params.str
      const result = await sandbox.run(str, services);
      res.json(result)
    } catch (err) {
      console.log(err)
      res.json(err)
    }
  } catch (err) {
    if (err.signal === 'SIGTERM') {
      res.json(400, {error: 'timeout'})
    }
  }
})

app.get('/runner/vm2/scripts/:str', async (req, res) => {
  try {
    try {
      const sandbox = require('./sandbox-vm2');
      const str = req.params.str
      const result = await sandbox.run(str, services);
      res.json(result)
    } catch (err) {
      console.log(err)
      res.json(err)
    }
  } catch (err) {
    if (err.signal === 'SIGTERM') {
      res.json(400, {error: 'timeout'})
    }
  }
})

app.get('/runner/fork/scripts/:str', async (req, res) => {
  try {
    try {
      const sandbox = require('./sandbox-fork');
      const str = req.params.str
      const result = await sandbox.run(str, services);
      res.json(result)
    } catch (err) {
      console.log(err)
      res.json(err)
    }
  } catch (err) {
    if (err.signal === 'SIGTERM') {
      res.json(400, {error: 'timeout'})
    }
  }
})

app.get('/runner/fork1/scripts/:str', async (req, res) => {
  try {
    try {
      const sandbox = require('./sandbox-fork1');
      const str = req.params.str
      const result = await sandbox.run(str, services);
      res.json(result)
    } catch (err) {
      console.log(err)
      res.json(err)
    }
  } catch (err) {
    if (err.signal === 'SIGTERM') {
      res.json(400, {error: 'timeout'})
    }
  }
})


app.get('/runner/fork2/scripts/:str', async (req, res) => {
  try {
    try {
      const sandbox = require('./sandbox-fork2');
      const str = req.params.str
      const result = await sandbox.run(str, services);
      res.json(result)
    } catch (err) {
      console.log(err)
      res.json(err)
    }
  } catch (err) {
    if (err.signal === 'SIGTERM') {
      res.json(400, {error: 'timeout'})
    }
  }
})

app.get('/runner/execfile/scripts/:str', async (req, res) => {
  try {
    try {
      const sandbox = require('./sandbox-execfile');
      const str = req.params.str
      const result = await sandbox.run(str, services);
      res.json(result)
    } catch (err) {
      console.log(err)
      res.json(err)
    }
  } catch (err) {
    if (err.signal === 'SIGTERM') {
      res.json(400, {error: 'timeout'})
    }
  }
})

app.post('/set', (req, res) => {
  const key = req.body.key
  const value = req.body.value
  memory[key] = value
  res.json(null)
})

app.get('/get', (req, res) => {
  const key = req.query.key
  res.json(memory[key])
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

