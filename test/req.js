var Promise = require('bluebird')
var path = require('path')
var _ = require('lodash')
var wechat_file = path.join(__dirname,'../config/wechat.txt')
var util = require('../libs/util')
var Koa = require('koa')
var config = require('../config')
var request = Promise.promisify(require('request'), {multiArgs: true})

function wechat(opts){
  var that = this
  this.appID = opts.appID
  this.appSecret = opts.appSecret
  this.getAccessToken = getAccessToken
  this.saveAccessToken = opts.saveAccessToken
  that.updateAccessToken =updateAccessToken
  this.getAccessToken()
  .then(function(data){ 
    return that.updateAccessToken()
  })
}
/*var app = new Koa()
app.use(g(config.wechat))*/


function g(opts){
  /*var wechat = new wechat(opts)*/
  wechat(opts)
  return function *(next){
    this.body = 'wrong'
  }
}
g(config.wechat);



function getAccessToken(){
  return util.readFileAsync(wechat_file)
}
function updateAccessToken(){
  var appID = this.appID
  var appSecret = this.appSecret
  var url = api.accssToken+'&appid='+appID + '&secret=' + appSecret
  
  return new Promise(function(resolve,reject){
    request({url: url,json:true}).then(function(response){         
      var data = response[1]             
      var now = (new Date().getTime())
      var expires_in = now + (data.expires_in - 20)*1000
      data.expires_in = expires_in;
      resolve(data)     
    })
  })
}


/*var port = 3000;
app.listen(port)
console.log('listening on port '+ port)*/
var prefix='https://api.weixin.qq.com/cgi-bin/'
var api={
  accssToken:prefix+'token?grant_type=client_credential',
  temporary:{
    upload: prefix + 'media/upload'  
  },
  permanent:{
    upload: prefix + 'material/add_material',
    uploadNews: prefix + 'material/add_news' ,
    uploadNewsPic: prefix + 'media/uploadimg' ,
   
  }
  
}