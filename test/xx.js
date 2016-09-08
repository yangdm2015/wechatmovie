
function* xx(){
  this.geturl=geturl,
}

xx.prototype.get1=function(){
  this.geturl()
  .then(function(data){
    return Promise.resolve(data)
  })
}
function geturl(){
  return new Promise(function(resolve,reject){
    var url =  "www.baidu.com";
    resolve(url);
  })
}