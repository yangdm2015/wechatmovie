'use strict'
var Koa = require('koa')
var app = new Koa()
var g = require('./Middleware')
app.use(g());
var port = 3006;
app.listen(port)