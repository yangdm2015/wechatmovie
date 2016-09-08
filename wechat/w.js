'use strict'
var sha1 = require('sha1')
var Promise = require('bluebird')
var Wechat = require('./wechat')
var getRewBody = require('raw-body')
var util = require('./util')

module.exports = function(opts){
  this.num = 998;
  console.log(this.num); 
  var wechat = new Wechat(opts);
  console.log("\n********* Wechat init end *********" );
  return function *(next){
    var that = this
    /*console.log(this.query)*/

    var token = opts.token
    var signature = this.query.signature
    var nonce = this.query.nonce
    var timestamp = this.query.timestamp
    var echostr = this.query.echostr
    var str = [token,timestamp,nonce].sort().join('')
    var sha = sha1(str)

    console.log(sha)
    if(this.method === "GET"){
      if(sha===signature){
        console.log("success!")
        this.body = echostr +''
      }else{
        this.body = 'wrong'
      }  
    }else if(this.method ==="POST"){
      if(sha!==signature){
        this.body = 'wrong'
        return false
      }else{
        var data = yield getRewBody(this.req,{
          length:this.length,
          limit:'1mb',
          encoding:this.charset
        })
        /*console.log(data.toString())*/
        var content = yield util.parseXMLAsync(data)
        /*console.log(content)*/
        var message = util.formatMessage(content.xml)
        /*console.log(message)*/
        console.log(message)
        this.weixin = message

        yield handler.call(this,next)

        wechat.reply.call(this)
      }  
    }
    
  }
}

