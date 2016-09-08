'use strict'
var sha1 = require('sha1')
var Promise = require('bluebird')
var Wechat = require('./wechat')
var getRawBody = require('raw-body')
var util = require('./util')

module.exports = function(opts,handler){
  var wechat = new Wechat(opts);

  console.log("\n********* in g! *********" );
  return function *(next){
    console.log("\n********* g returned! *********" );

    var that = this        
    var token = opts.token
    var signature = this.query.signature
    var nonce = this.query.nonce
    var timestamp = this.query.timestamp
    var echostr = this.query.echostr
    var str = [token,timestamp,nonce].sort().join('')
    var sha = sha1(str)

    /*console.log(sha)*/
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
        
        var data = yield getRawBody(this.req,{
          length:this.length,
          limit:'1mb',
          encoding:this.charset
        })
        
        
        console.log("\n********* before parseXMLAsync! *********" );
        var content = yield util.parseXMLAsync(data)
        
        console.log("\n********* after parseXMLAsync! *********" );
        console.log("content.xml =  ")
        console.log(content.xml)
        var message = util.formatMessage(content.xml)
        /*console.log(message)*/
        this.weixin = message

        yield handler.call(this,next)

        wechat.reply.call(this)


      }  
    }
    
  }
}

/*if(message.MsgType === 'event'){
          if(message.Event === 'subscribe'){
            var now = new Date().getTime()
            that.type = 'application/xml'
            that.status = 200
            that.body = ' <xml>'+
                        '<ToUserName><![CDATA['+ message.FromUserName+']]></ToUserName>'+
                        '<FromUserName><![CDATA['+ message.ToUserName+']]></FromUserName>'+
                        '<CreateTime>'+ now +'</CreateTime>'+
                        '<MsgType><![CDATA[text]]></MsgType>'+
                        '<Content><![CDATA[ Hi!, '+ message.Content +']]></Content>'+
                        '</xml>'
             console.log(that.body)           
            return
          }
        }*/