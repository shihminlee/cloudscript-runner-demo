const fs = require('fs')
const vm = require('vm');
const params = {};

module.exports.run = async (str, services) => {
  const ctx = { console, context: services, params };
  vm.createContext(ctx);
  const code = fs.readFileSync(`./scripts/${str}.js`).toString();
  const script = new vm.Script('(' + code + ')()');
  return await script.runInContext(ctx, {displayErrors: true, timeout: 1000, microtaskMode: 'afterEvaluate'});
}
