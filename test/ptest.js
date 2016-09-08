'use strict'
var koa = require('koa')
var app = koa();
var fs =require('fs')

app.use(function *(next){
  /*var index = yield readcurrentfile("index.html");*/
  var index =  dosomething("index.html");
  console.log("1");

});


function readcurrentfile(filename){
  return new Promise(function(resolve,reject){
    filename = "./"+filename
    fs.readFile(filename, 'utf-8', function(err, data){
        resolve(data);
    })
  })  
}
function dosomething(filename){
  return new Promise(function(resolve,reject){
    console.log(filename)
    resolve(filename)
  })  
}
app.listen(3001);