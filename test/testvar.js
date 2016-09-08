/*var x ={
  a:"11",
  b:"代號"
}
var y =[1,"hello",x]

for(var i=0;i<y.length ;i++){
  console.log(y[i]);
}
console.log(i);*/
for(var i=0,arr=[];i<=3;i++) {
  arr.push(
  (function(i){
    return function(){
    alert(i);
    }
  })(i)
  );
}
arr[0](); // ?? 结果不是0
arr[1](); // ?? 全是4