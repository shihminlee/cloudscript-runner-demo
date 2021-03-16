const fs = require('fs');
const util = require('util');
var rp = require('request-promise');
const { v4: uuidv4 } = require('uuid');
const execFile = util.promisify(require('child_process').execFile);

module.exports.run = async function run(str) {
  const key = uuidv4();
  const result = await execFile('node', ['sandbox-execfile-runner.js', '--key', key, '--script', str], {timeout: 1000});
  const options = {
    method: 'GET',
    uri: `http://localhost:3000/get?key=${key}`,
    json: true
  }
  return await rp(options);
}
