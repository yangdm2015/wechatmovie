'use strict'
var express = require('express')
var path = require('path')
var fs = require('fs')
var wechat_file = path.join(__dirname,'./times.txt')
var app = express()
var req,res,times;
app.get('/',function(request,response){
  req = request;
  res = response

  if(!!!wechat_file){
     console.log("Error, no file path passed")
     return;
  }
  if(!fs.existsSync(wechat_file)){
    writeFile(0,read)     
  }else{
    read(0)
  }
})


var port = 3000;
app.listen(port)
console.log('listening on port '+ port)

var writeFile = function(content,f){
  fs.writeFile(wechat_file,content,f) 
  }

var read = function(err){
    if(err){
      console.log("wrong!")
    }else{

      fs.readFile(wechat_file,"utf-8",getreaddata)
    }
  }
var writeandsend = function(err){
    /*console.log("in writeandsend! content = " +content)*/
    if(err){
      console.log("wrong!")
    }else{
      res.send(times+" ")
    }
  }

  var getreaddata = function(err,content){
      if(err) {
        console.log("wrong!" )
      }else {
        sendandwritedata(content);
      }
    }
  var sendandwritedata = function(content){
    if(req.method === "GET"&&req.url!='/favicon.ico'){
          times = parseInt(content)
          times+=1
          writeFile(times,writeandsend)
          
      }  
  }
  

  
