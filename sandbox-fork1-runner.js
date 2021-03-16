const fs = require("fs");
const vm = require("vm");
const delay = require('delay');
const deepFreeze = require('deep-freeze');

const params = {}

const ipc = require('node-ipc');

ipc.config.id   = 'hello';
ipc.config.retry= 1500;
ipc.config.silent   = true;

const someService = (() => {
  return {
    fast: async () => {
      await delay(0);
      return Math.random();
    },
    slow: async () => {
      await delay(3000);
      return Math.random();
    },
    redis: async () => {
      return new Promise((resolve) => {
        ipc.connectTo(
          'world',
          function(){
            ipc.of.world.emit('message', {type: 'redis.get'})
              ipc.of.world.on(
                  'message',
                  function(rec){
                      resolve(rec)
                      // ipc.log('got a message from world : '.debug, data);
                  }
              );
          }
      );
      })
    }
  }
})();
const services = { someService: deepFreeze(someService) }
const ctx = { console, setTimeout, context: services, params };

process.on('message', async function() {
  const str = process.env.key;
  const code = fs.readFileSync(`./scripts/${str}.js`).toString();
  vm.createContext(ctx);
  const script = new vm.Script('(' + code + ')()');
  const result = await script.runInNewContext(ctx);
  process.send(result);
});