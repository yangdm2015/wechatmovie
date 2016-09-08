'use strict'
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});
for(let i =0;i<1000001;i++){
  i==500000&&console.log("i = "+i)
}
console.log('script end');