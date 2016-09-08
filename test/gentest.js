'use strict'
function* g() {}

g.prototype.hello = function () {
  return 'hi!';
};
g.a="world"
 new g();

/*obj instanceof g // true
console.log(obj.hello()) // 'hi!'
console.log(obj.a) // 'hi!'*/
function* F() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}
F.prototype.a = 1;
F.prototype.b = 2;
F.prototype.c = 3;
var f = new F();

console.log(f.next());  // Object {value: 2, done: false}
console.log(f.next());  // Object {value: 3, done: false}
console.log(f.next());  // Object {value: undefined, done: true}

console.log(f.a) // 1
console.log(f.b) // 2
console.log(f.c) // 3
