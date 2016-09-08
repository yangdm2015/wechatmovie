
var Promise = require('bluebird')
/*var request =require('request')*/
var request = Promise.promisify(require('request'), {multiArgs: true})
var util = require('./libs/util')
var prefix='https://api.weixin.qq.com/cgi-bin/'
var api={
  accssToken:prefix+'token?grant_type=client_credential'
}
var appID='wxdbcc70429c96ee69'
var appSecret='3090fb7c58ab33a8eff07b6a3359ce5f'
var url1 = api.accssToken+'&appid='+appID + '&secret=' + appSecret
var url2 = "www.baidu.com";

/*
request(url1)
.then(function(result){
  console.log(result[1])
  return util.writeFileAsync('1.txt',result[1])
})
.then(function(result){
  return request(url2)
})
.catch(function(e){
  console.log("weong!!!"+e)
})*/
var dd = request(url1)
  console.log("dd = "+dd)


var g=function* (){
  var result = yield request(url1); 
  console.log("result = "+result)
  yield util.writeFileAsync('2.txt',result[1]);
  console.log("yield util.writeFileAsync('2.txt',result[1]);")
  yield request(url2);
  console.log("yield request(url2);")
}

var gen = g()
gen.next(); 
gen.next(); 
gen.next(); 
