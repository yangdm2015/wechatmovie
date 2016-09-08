var sha1 = require('sha1')
var Promise = require('bluebird')
var req = require('request')
var request = Promise.promisify(req, {multiArgs: true})
/*var request = Promise.promisify(req)*/
/*Promise.promisifyAll(request);*/
/*var request =require('request')*/
var prefix='https://api.weixin.qq.com/cgi-bin/'
var api={
  accssToken:prefix+'token?grant_type=client_credential'
}

function re(){
  var appID = 'wxdbcc70429c96ee69'
  var appSecret = '3090fb7c58ab33a8eff07b6a3359ce5f'
  var url = api.accssToken+'&appid='+appID + '&secret=' + appSecret
  console.log("url = "+url)
  /*request.get(url,function(error, response, body){
    
    var data = JSON.parse(body)
    var tmp={"access_token":"ACCESS_TOKEN","expires_in":7200}
    console.log("\n********* body = "+data.expires_in+"  *********" )
    console.log("\n********* tmp = "+tmp+"  *********" )
    
    console.log("\n********* data = "+data+"*********" )
  })*/
var urltest = "http://andyyshan.p.imooc.io/nodeport/?echo=3dm"
  return new Promise(function(resolve,reject){
    request({url: url,json:true}).then(function(response){
      var data = response[1];
      /*console.log("\n********* response[0] = "+response[0]+"  *********" )    */
       console.log("\n********* data = "+data.expires_in+"  *********" )   
       for(var index in data){
         console.log(("\n********* response[0]["+index+"] = "+data[index]+"  *********" )    )
       }          
    })
  })
  
}
re()