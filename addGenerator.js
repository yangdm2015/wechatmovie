function *addGenerator() {
  var i = 0;
  var y = 0
  while (true) {   
    y += 1;
    yield y
    console.log(y) 
  }
}
var adder = addGenerator();
adder.next()
adder.next(5)
adder.next(5)
adder.next(5)
adder.next(50)
/*console.log(adder.next().value); // 0
console.log(adder.next(5).value); // 5
console.log(adder.next(5).value); // 10
console.log(adder.next(5).value); // 15
console.log(adder.next(50).value); // 65*/