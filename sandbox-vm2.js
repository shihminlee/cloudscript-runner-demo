const fs = require('fs')
const { VM } = require('vm2');
const params = {};

module.exports.run = async (str, services) => {
  const ctx = {sandbox: { console, setTimeout, context: services, params }, timeout: 1000}
  const vm = new VM(ctx)
  const code = fs.readFileSync(`./scripts/${str}.js`).toString();
  return await vm.run('(' + code + ')()');
}
