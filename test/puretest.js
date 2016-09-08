'use strict'
var koa = require('koa')
var app = koa();
var fs =require('fs')

app.use(function *(next){
  
  /*console.log(this);*/
  console.log('\n')
  /*console.log(this.header);*/
  console.log('\n')
  console.log(this.url);
  console.log('\n')
  this.body="你好"
  this.status = 404
  /*setTimeout('this.type ="text/plain"', 3000)*/
  this.type ="text/json"
  console.log("in puretest,this.type = " +this.type);
  
});


app.listen(3001);