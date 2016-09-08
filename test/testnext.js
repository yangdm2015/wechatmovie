function* f() {
  for(var i=0; true; i++) {
    var reset = yield i;
    if(reset) { i = -1; }
  }
}

var g = f();

console.log(g.next().value) // { value: 0, done: false }
console.log(g.next().value) // { value: 1, done: false }
console.log(g.next().value) // { value: 1, done: false }
console.log(g.next().value) // { value: 1, done: false }
console.log(g.next().value) // { value: 1, done: false }
console.log(g.next(true).value)  // { value: 0, done: false }