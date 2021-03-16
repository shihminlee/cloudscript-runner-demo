const fs = require("fs");
const vm = require("vm");
const delay = require('delay');
const deepFreeze = require('deep-freeze');

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
      process.send({type: 'redis'})

      return await new Promise((resolve) => {
        process.on('message', async function(message) {
          if (message.type === 'redis') {
            resolve(message.result)
          }
        });
      })
    },
  }
})();
const services = { someService: deepFreeze(someService) }
const params = {}
const ctx = { console, setTimeout, context: services, params };

process.on('message', async function(message) {
  if (message.type === 'start') {
    const str = process.env.key;
    const code = fs.readFileSync(`./scripts/${str}.js`).toString();
    vm.createContext(ctx);
    const script = new vm.Script('(' + code + ')()');
    const result = await script.runInNewContext(ctx);
    process.send({type: 'end', result});
  }
});