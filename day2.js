'use strict'
var Koa = require('koa')
var path = require('path')
var fs = require('fs')



var wechat_file = path.join(__dirname,'./times.txt')
var config = {
  wechat_file:wechat_file,
  readFile: function(){
    return readFileAsync(wechat_file)
  },
  writeFile:function(data){
    data = JSON.stringify(data)
    return writeFileAsync(wechat_file,data)
  }
}

var app = new Koa()
app.use(wechat(config))
var port = 3000;
app.listen(port)
console.log('listening on port '+ port)

function wechat(opts){ 
  return function *(next){
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
  } 
}

function readFileAsync(fpath,encodning){
  return new Promise(function(resolve,reject){
    
    fs.readFile(fpath,encodning,function(err,content){
      if(err) reject(err)
      else {
        console.log("\n********* resolved!! *********" )
        resolve(content)}
    })
  })
}
function writeFileAsync(fpath,content){
  return new Promise(function(resolve,reject){
    fs.writeFile(fpath,content,function(err,content){
      if(err) reject(err)
      else resolve()
    })
  })
}