const vm = require('vm');

let a = 0;
console.time('eval')

for (var i = 0; i < 1000; i++) {
  eval('a++')
}

console.timeEnd('eval')

console.time('vm')

for (var i = 0; i < 1000; i++) {
  vm.runInNewContext('a++', { a })
}

console.timeEnd('vm')

const script = new vm.Script('a++');

console.time('script')

for (var i = 0; i < 1000; i++) {
  script.runInNewContext({ a })
}

console.timeEnd('script')