var koa = require('koa');
var app = koa();

// response-time中间件
app.use(function *(next){
  var start = new Date;
  console.log('1');
  yield next;
  console.log('5');
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
});

// logger中间件
app.use(function *(next){
  var start = new Date;
  console.log('2');
  yield next;
  console.log(this);
  console.log('4');
  var ms = new Date - start;
  console.log('logger中间件');
  console.log('%s %s - %s', this.method, this.url, ms);
});

// 响应中间件
app.use(function *(){
  console.log('3');

  console.log(this);
  this.body = 'Hello World';
  console.log('@@@@@@@@@@'+this.body);
});

app.listen(3001);