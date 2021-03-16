const fs = require("fs");
const vm = require("vm");
const delay = require('delay');
const deepFreeze = require('deep-freeze');
const someService = require('./common-services');
const services = { someService: deepFreeze(someService) }
const params = {}
const ctx = { console, setTimeout, context: services, params };

process.on('message', async function() {
  const str = process.env.key;
  const code = fs.readFileSync(`./scripts/${str}.js`).toString();
  vm.createContext(ctx);
  const script = new vm.Script('(' + code + ')()');
  const result = await script.runInNewContext(ctx);
  process.send(result);
});