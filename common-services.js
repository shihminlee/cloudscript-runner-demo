const delay = require('delay');

module.exports = (() => {
  return {
    fast: async () => {
      await delay(0);
      return Math.random();
    },
    slow: async () => {
      await delay(3000);
      return Math.random();
    },
  }
})();