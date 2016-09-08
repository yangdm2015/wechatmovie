var compute = function* () {
  var foo ={v:0} 
  while(true){
     foo.v += foo.v yield opt(foo ,3) ;
    console.log("******"+foo.v);
  }
};
var opt = function (a, b){
  a.v = a.v+b
  return a.v 
}
var generator = compute();
var ret = generator.next(2);
console.log("**"+ret.value);
ret = generator.next(5);
console.log("**"+ret.value);
ret=generator.next(27);
console.log("**"+ret.value);
ret=generator.next(25);
console.log("**"+ret.value);