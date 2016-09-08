var koa = require('koa');
var app = koa();
var fs =require('fs')

// response-time中间件
app.use(function *(next){
  var start = new Date;

  yield next;
  console.log("3")
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
});

// logger中间件
app.use(function *(next){
  var start = new Date;
  console.log("1")
  yield next;
  console.log("2")
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

// 响应中间件
/*app.use(function *(){
  this.body = 'Hello World';
});*/
app.use(function*(){
  console.log("2")
  var text = yield new Promise(function(resolve){
    console.log("3")
    fs.readFile('./index.html', 'utf-8', function(err, data){
        resolve(data);
    })
  });
  this.body = text;
});


app.listen(3002);