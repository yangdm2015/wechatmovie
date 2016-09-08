var koa = require('koa');
var app = koa();

// x-response-time

app.use(function *(next){
  var start = new Date;
  console.log("1")
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
  console.log("5")
});

// logger

app.use(function *(next){
  var start = new Date;
  console.log("2")
  yield next;
  console.log("4")
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
 
});

// response

app.use(function *(){
  console.log("3")
  this.body = 'Hello World';
});

app.listen(3100);