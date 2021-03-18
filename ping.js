// workaround: https://i.imgur.com/NOOtV1l.png

const { VM } = require('vm2');
const delay = require('delay');
const code = 'async () => { \n const r = await context.helloService.slow(); console.log(`vm`); while (true) {}; ping(); return r; }';

const helloService = (() => {
  return {
    fast: async () => {
      await delay(100);
      return Math.random();
    },
    slow: async () => {
      await delay(5000);
      return Math.random();
    },
  }
})();

let ispinged = false;
const ping = () => {
  ispinged = true;
}

const vm = new VM({
    timeout: 1000,
    sandbox: {
      console, ping,
      context: { helloService }
    }
});

async function run() {
  vm.run('(' + code + ')()');
  const interval = setInterval(() => {
    if (!ispinged) {
      clearInterval(interval)
      throw new Error('...')
    }
  }, 10000)
}
run();

setInterval(() => {
  console.log('main loop')
}, 100)