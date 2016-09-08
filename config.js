'use strict'

var path = require('path')
var util = require('./libs/util')
var wechat_file = path.join(__dirname,'./config/wechat.txt')

var config = {
  wechat:{
    appID:'wxdbcc70429c96ee69',
    appSecret:'3090fb7c58ab33a8eff07b6a3359ce5f',
    token:'andysfirstwechaprograme',
    getAccessToken: function(){
      return util.readFileAsync(wechat_file)
    },
    saveAccessToken:function(data){
      data = JSON.stringify(data)
      return util.writeFileAsync(wechat_file,data)
    }
  }
}

module.exports = config
