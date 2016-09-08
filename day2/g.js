'use strict'
var sha1 = require('sha1')
var Promise = require('bluebird')
var getRewBody = require('raw-body')
var fs = require('fs')

module.exports = function(opts){
  
  return function *(next){
    
    /*this.type = 'application/xml'
    this.status = 200
    this.body = 1
    return*/
    this.readFile = opts.readFile
    this.writeFile = opts.writeFile
    var that = this
    var wechat_file = opts.wechat_file
    if(!!!wechat_file){
       console.log("Error, no file path passed")
       return;
    }
    if(!fs.existsSync(wechat_file)){
      this.writeFile(0)     
    }

    var data = yield this.readFile()
    if(that.method === "GET"&&that.url!='/favicon.ico'){

          var tmp = parseInt(data)
          tmp+=1
          console.log(tmp)
          that.writeFile(tmp)
          that.body = tmp
          return
        }
      /*.then(function(data){
        
        if(that.method === "GET"&&that.url!='/favicon.ico'){

          var tmp = parseInt(data)
          tmp+=1
          console.log(tmp)
          that.writeFile(tmp)
          that.body = yield  data
          return
        }
      })*/
  } 
}

