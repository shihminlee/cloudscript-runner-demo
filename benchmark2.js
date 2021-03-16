const deepFreeze = require('deep-freeze');
const delay = require('delay');
const sandboxVm = require('./sandbox-vm')
const sandboxVm2 = require('./sandbox-vm2')
const sandboxFork = require('./sandbox-fork')
const sandboxFork1 = require('./sandbox-fork1')
const sandboxFork2 = require('./sandbox-fork2')
const sandboxExecfile = require('./sandbox-execfile')

const someService = (() => {
  return {
    fast: async () => {
      await delay(0);
      return Math.random();
    },
    slow: async () => {
      await delay(2000);
      return Math.random();
    },
  }
})();
const services = { someService: deepFreeze(someService) }

let a = 0;

console.time('vm')

const run1 = async () => {
  await sandboxVm.run('fast', services)
}
for (var i = 0; i < 10; i++) {
  run1()
}

console.timeEnd('vm')

console.time('vm2')

const run2 = async () => {
  await sandboxVm2.run('fast', services)
}
for (var i = 0; i < 10; i++) {
  run2()
}

console.timeEnd('vm2')

console.time('fork')

const run3 = async () => {
  await sandboxFork.run('fast', services)
}
for (var i = 0; i < 10; i++) {
  run3()
}

console.timeEnd('fork')

// console.time('fork1')

// const run4 = async () => {
//   await sandboxFork1.run('redis', services)
// }
// for (var i = 0; i < 10; i++) {
//   run4()
// }

// console.timeEnd('fork1')

// console.time('fork2')

// const run5 = async () => {
//   await sandboxFork2.run('redis', services)
// }
// for (var i = 0; i < 10; i++) {
//   run5()
// }

// console.timeEnd('fork2')

// console.time('execfile')

// const run6 = async () => {
//   await sandboxExecfile.run('fast', services)
// }
// for (var i = 0; i < 10; i++) {
//   run6()
// }

// console.timeEnd('execfile')
