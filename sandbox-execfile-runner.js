const fs = require('fs-extra');
const delay = require('delay');
const rp = require('request-promise');
const util = require('util');
const minimist = require("minimist");
const redis = require("redis");
const deepFreeze = require('deep-freeze');
const execFile = util.promisify(require('child_process').execFile);
const someService = require('./common-services');

async function run(key, script) {
  process.env = {}
  const context = {
    someService: deepFreeze(someService)
  }
  const params = {

  }
  const result = await require(`./scripts/execfile/${script}`).run(params, context)
  const options = {
    method: 'POST',
    uri: 'http://localhost:3000/set',
    body: {
        key, value: result
    },
    json: true // Automatically stringifies the body to JSON
  }
  return await rp(options);
}
var argv = require('minimist')(process.argv.slice(2));
run(argv.key, argv.script)
