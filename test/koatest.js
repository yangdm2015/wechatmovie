'use strict'
var koa = require('koa')
var app = koa();
var fs =require('fs')

app.use(g());

function g(){
  return function *(next){
  /*var content = yield readFileAsync('./index.html');*/
    readFileAsync('./index.html')
    .then(function(data){
      console.log('data = '+data)
      this.body=data;
    })
  /* console.log('this is '+content);
  console.log('body. '+content);*/
  }
}


function readFileAsync(fpath){
  return new Promise(function(resolve,reject){   
    fs.readFile(fpath,'utf-8',function(err,content){
      if(err) reject(err)
      else {
        resolve(content)}
    })
  })
}
var port = 3001;
app.listen(port)
console.log('listening on port '+ port)