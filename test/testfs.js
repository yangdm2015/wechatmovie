var fs = require('fs')
var path = require('path')
var wechat_file = path.join(__dirname,'./config/wechat.txt')
console.log(fs.existsSync(wechat_file))