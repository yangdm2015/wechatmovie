'use strict'

var Promise = require('bluebird')
var _ = require('lodash')
var request = Promise.promisify(require('request'), {multiArgs: true})
var prefix='https://api.weixin.qq.com/cgi-bin/'
var util = require('./util')
var fs = require('fs')
var api={
  accssToken:prefix+'token?grant_type=client_credential',
  temporary:{
    upload: prefix + 'media/upload',
    fetch: prefix + 'media/get'

  },
  permanent:{
    upload: prefix + 'material/add_material',
    fetch: prefix + 'material/get_material',
    uploadNews: prefix + 'material/add_news' ,
    uploadNewsPic: prefix + 'media/uploadimg', 
    del: prefix + 'material/del_material' ,
    update: prefix + 'material/update_news' ,
    count:prefix + 'material/get_materialcount',
    batch:prefix + 'material/batchget_material',
  },
  group:{
    create:prefix +'/groups/create',
    fetch:prefix +'/groups/get',
    check:prefix +'/groups/getid',
    update:prefix +'/groups/update',
    move:prefix +'/groups/members/update',
    batchupdate:prefix +'/groups/members/batchupdate',
    del:prefix +'/groups/delete',
  }
  
}

function Wechat(opts){

  var that = this
  this.appID = opts.appID
  this.appSecret = opts.appSecret
  this.getAccessToken = opts.getAccessToken
  this.saveAccessToken = opts.saveAccessToken
  this.fetchAccesToken()
  
}

Wechat.prototype.fetchAccesToken = function(){
  var that = this
  if(this.access_token && this.expires_in){
    if(this.isValiAccessToken(this)){
      console.log("\n********* in fetchAccesToken! *********" );
      return Promise.resolve(this)
    }
  }
  
  /*console.log("this.expires_in = "+ this.expires_in);*/
  this.getAccessToken()
    .then(function(data){         
      try{
        data = JSON.parse(data)
      }catch(e){        
        return that.updateAccessToken()
      }
      if(that.isValiAccessToken(data)){     
        /*console.log("expires_in is valid ");*/
        return Promise.resolve(data)
      }else{        
        console.log("expires_in is NOT valid ! ");
        return that.updateAccessToken()
      }
    })
    .then(function(data){
      that.access_token = data.access_token
      that.expires_in = data.expires_in
      that.saveAccessToken(data)
      return Promise.resolve(data)
    })
}

Wechat.prototype.isValiAccessToken = function(data){
  if(!data|| !data.access_token || !data.expires_in){
    return false
  }
  var access_token = data.access_token
  var expires_in = data.expires_in
  var now = (new Date().getTime())
  if(now<expires_in){
    return true
  }else{
    return false
  }
}


Wechat.prototype.updateAccessToken = function(){
  var appID = this.appID
  var appSecret = this.appSecret
  var url = api.accssToken+'&appid='+appID + '&secret=' + appSecret
  
  return new Promise(function(resolve,reject){
    request({url: url,json:true}).then(function(response){
    console.log("in request ");         
      var data = response[1]             
      var now = (new Date().getTime())
      var expires_in = now + (data.expires_in - 20)*1000
      data.expires_in = expires_in;
      console.log(data);   
      resolve(data)     
    })
  })
}
Wechat.prototype.uploadMaterial = function(type,material,permanent){
  var that = this;
  var form = {}
  var uploadUrl = api.temporary.upload
  if(permanent){
    uploadUrl = api.permanent.upload
    _.extend(form, permanent)
  }
  if(type === 'pic'){
    uploadUrl = api.permanent.uploadNewsPic
  }
  if(type === 'news'){
    uploadUrl = api.permanent.uploadNews
    form = material
  }else{
    form.media = fs.createReadStream(material)
  }
  return new Promise(function(resolve,reject){
    that
      .fetchAccesToken()
      .then(function(data){
        console.log("uploadMaterial")
        var url = uploadUrl + '?access_token='+data.access_token 
        if(!permanent){
          url += '&type='+type
        }else{
          form.access_token = data.access_token
        }       
        var options = {
          method:'POST',
          url:url,
          json:true
        }
        if(type==='news'){
          options.body = form
        }else{
          options.formData = form
        }       
      request(options)
      /*.then(resdata(response,'Upload material fails'))*/
      .then(function(response){
        resdata(response,'Upload material fails')      
      })
      .catch(function(err){
        reject(err)
      })
    })
  })
}
function resdata(response,message){  
  var _data = response[1]
  if(_data){
    resolve(_data)
  }else{
    throw new Error(message)
  }
}
Wechat.prototype.fetchMaterial = function(mediaId,type,permanent){
  var that = this;
  var form = {}
  var fetchUrl = api.temporary.fetch
  if(permanent){
    fetchUrl = api.permanent.fetch
  }
  
  return new Promise(function(resolve,reject){
    that
      .fetchAccesToken()
      .then(function(data){
        console.log("uploadMaterial")
        var url = fetchUrl + '?access_token='+data.access_token +'&media_id='+mediaId
        var form = {}
        var options = {method:'POST',url: url,json:true,}

        if(permanent){
          form.media_id = mediaId
          form.access_token = data.access_token
          options.body = form
        }else{
          if(type ==='video'){
            url = url.replace('https://','http')
          }
          url += '&media_id='+mediaId
        }

        if(type ==='news'||type==='video'){
          request(options).then(function(response){ 
            var _data = response[1]
            if(_data){
              resolve(_data)
            }else{
              throw new Error('Fetch material fails')
            }
          })
          .catch(function(err){
            reject(err)
          })
        }else{
          resolve(url)
        }

    })
  })
}

Wechat.prototype.deleteMaterial = function(mediaId){
  var that = this;
  var form = {
    media_id:mediaId
  }
  return new Promise(function(resolve,reject){
    that
      .fetchAccesToken()
      .then(function(data){
        var url = api.permanent.del + '?access_token='+data.access_token +'&media_id='+mediaId
        request({method:'POST',url: url,body:form,json:true,})
        .then(function(response){ 
          var _data = response[1]
          if(_data){
            resolve(_data)
          }else{
            throw new Error('Delete material fails')
          }
        })
        .catch(function(err){
          reject(err)
        })
    })
  })
}
Wechat.prototype.updateMaterial = function(mediaId,news){
  var that = this;
  var form = {
    media_id:mediaId
  }
  _.extend(form,news)
  return new Promise(function(resolve,reject){
    that
      .fetchAccesToken()
      .then(function(data){
        var url = api.permanent.update + '?access_token='+data.access_token +'&media_id='+mediaId
        request({method:'POST',url: url,body:form,json:true,})
        .then(function(response){ 
          var _data = response[1]
          if(_data){
            resolve(_data)
          }else{
            throw new Error('Update material fails')
          }
        })
    })
  })
}
Wechat.prototype.countMaterial = function(mediaId){
  var that = this;
  return new Promise(function(resolve,reject){
    that
      .fetchAccesToken()
      .then(function(data){
        var url = api.permanent.count + '?access_token='+data.access_token
        request({method:'GET',url: url,json:true,})
        .then(function(response){ 
          var _data = response[1]
          if(_data){
            resolve(_data)
          }else{
            throw new Error('Count material fails')
          }
        })
    })
  })
}
Wechat.prototype.batchMaterial = function(options){
  var that = this;
  options.type = options.type || 'image'
  options.offset = options.offset || 0
  options.count = options.count || 1

  return new Promise(function(resolve,reject){
    that
      .fetchAccesToken()
      .then(function(data){
        var url = api.permanent.batch + '?access_token='+data.access_token
        request({method:'POST',url: url,body:options,json:true,})
        .then(function(response){ 
          var _data = response[1]
          if(_data){
            resolve(_data)
          }else{
            throw new Error('Batch material fails')
          }
        })
    })
  })
}
Wechat.prototype.reply = function(){
  var content = this.body  
  /*for(var item in content){
    console.log('$$$$$$'+item);
    console.log(content[item]);
  }*/
  console.log("content = ");
  console.log(content);
  var message = this.weixin
  console.log("message = ");
  console.log(message);
  var xml = util.tpl(content,message)
  /*console.log('@@@@@@@@xml = '+xml);*/
  this.status = 200
  this.type = 'application/xml'
  this.body = xml
}

Wechat.prototype.createGroup = function(name){
  var that = this;
  return new Promise(function(resolve,reject){
    that
      .fetchAccesToken()
      .then(function(data){
        var url = api.group.create + '?access_token='+data.access_token
        var form ={
          group:{
            name:name
          }
        }
        request({method:'POST',url: url,body:form,json:true,})
        .then(function(response){ 
          var _data = response[1]
          if(_data){
            resolve(_data)
          }else{
            throw new Error('Create group fails')
          }
        })
    })
  })
}

Wechat.prototype.fetchGroup = function(name){
  var that = this;
  return new Promise(function(resolve,reject){
    that
      .fetchAccesToken()
      .then(function(data){
        var url = api.group.fetch + '?access_token='+data.access_token
        
        request({url: url,json:true,})
        .then(function(response){ 
          var _data = response[1]
          if(_data){
            resolve(_data)
          }else{
            throw new Error('Fetch group fails')
          }
        })
    })
  })
}
Wechat.prototype.checkGroup = function(openId){
  var that = this;
  return new Promise(function(resolve,reject){
    that
      .fetchAccesToken()
      .then(function(data){
        var url = api.group.check + '?access_token='+data.access_token
        var form = {
          openid : openid
        }
        request({method:'POST',url: url,form:form,json:true,})
        .then(resdata(response,'Check group fails'))
    })
  })
}

Wechat.prototype.updateGroup = function(id,name){
  var that = this;
  return new Promise(function(resolve,reject){
    that
      .fetchAccesToken()
      .then(function(data){
        var url = api.group.update + '?access_token='+data.access_token
        var form = {
          group : {
            id:id,
            name:name
          }
        }
        request({method:'POST',url: url,json:true,})
        .then(resdata(response,'Update group fails'))
    })
  })
}


function printall(_data){
  console.log("this is "+ _data);
  for(var item in _data){
    if(typeof(_data[item])=="object"){
      printall(_data[item])
    }else{
      console.log(item+"="+_data[item]);
    }   
  } 
}
function c(i){
  console.log(i);
}
module.exports = Wechat

