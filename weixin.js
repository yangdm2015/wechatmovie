'use strict'

var config = require('./config')

var Wechat = require('./wechat/wechat.js')

var wechatApi = new Wechat(config.wechat)
exports.reply = function* (next){
  console.log("\n*********in weixin.js! *********" );
  var message = this.weixin

  if(message.MsgType === 'event'){
    if(message.Event === 'subscribe'){
      if(message.EventKey){
        console.log('扫描二维码进来'+message.EventKey + ' ' + message.ticket)
      }
      this.body='感谢订阅！\n' + '消息 ID:'+message.MsgID
    }else if(message.Event === 'unsubscribe'){
    console.log('无情取关')
    this.body = ''
    }else if(message.Event === 'LOCATION'){
      this.body='你的位置是： '+message.Latitude + '/'+ message.Longitude + '-' +message.Precision
    }else if(message.Event === 'CLICK'){
      this.body='你点击了菜单： '+message.EventKey 
    }else if(message.Event === 'SACN'){
      console.log('关注后扫二维码'+message.EventKey+' '+message.Ticket)
      this.body = '你扫了一下'
    }else if(message.Event === 'VIEW'){
      
      this.body = '你点击了菜单中的连接 ： '+message.EventKey
    }
    
  }else if(message.MsgType ==='text'){
    var content = message.Content
    var reply = '你说的' + message.Content + '太复杂了'

    if(content === '1'){
      reply = '白雪公主'
    }else if(content ==='2'){
      reply = '七个小矮人'
    }else if(content ==='3'){
      reply = '小红帽'
    }else if(content ==='4'){
      reply = [{
        title:'清代地图',
        description:'描绘',
        picurl:'http://imgsrc.baidu.com/forum/pic/item/46d6ae773912b31b9ea360658e18367adbb4e10e.jpg',
        url:'http://tieba.baidu.com/f?kw=%CE%A2%D0%C5&fr=ala0&tpl=5'
      },{
        title:'魔兽世界',
        description:'尤迪安',
        picurl:'http://img0.imgtn.bdimg.com/it/u=2673037192,1171078808&fm=21&gp=0.jpg',
        url:'http://nodejs.cn/'
      }]
    }else if(content ==='5'){
      var data = yield wechatApi.uploadMaterial('image',__dirname +'/jpg/2.gif')
      reply = {
        type : 'image',
        mediaId: data.media_id
      }
    }else if(content ==='6'){
      var data = yield wechatApi.uploadMaterial('video',__dirname +'/video/b.mp4')
      reply = {
        type : 'video',
        title : '测试视频',
        description : '女神一枚',
        mediaId: data.media_id
      }
      
    }else if(content ==='7'){
      var data = yield wechatApi.uploadMaterial('image',__dirname +'/jpg/3.jpg')
      reply = {
        type : 'music',
        title : 'Paper & Pen',
        description : '垫底辣妹',
        musicUrl:'http://59.108.200.42/files/8002000003E5B4B8/m10.music.126.net/20160626231918/0518097a69b89110b6a817702cb29f55/ymusic/ea13/e17d/6c5a/0b000b780e3f19c3965841f663e2c2c8.mp3',
        thumbMediaId:data.media_id        
      }      
    }else if(content ==='8'){
      var data = yield wechatApi.uploadMaterial('image',__dirname +'/jpg/2.gif',{type:'image'})
      reply = {
        type : 'image',
        mediaId: data.media_id
      }
    }else if(content ==='9'){
      var data = yield wechatApi.uploadMaterial('video',__dirname +'/video/b.mp4',{type:'video',description:'{"title":"Nice girl","introduction":"You must like it"}'})
      console.log("data="+data)
      console.log(data)
      reply = {
        type : 'video',
        title : '测试视频',
        description : '女神一枚',
        mediaId: data.media_id
      }
    }else if(content ==='10'){
      var picData = yield wechatApi.uploadMaterial('image',__dirname +'/jpg/3.jpg',{})
      var media = {
        articles:[{
          title:'girl',
          thumb_media_id:picData.media_id,
          author: 'AUTHOR',
          digest: 'DIGEST',
          show_cover_pic: 1,
          content: 'CONTENT',
          content_source_url: 'CONTENT_SOURCE_URL'
        },{
          title:'4',
          thumb_media_id:picData.media_id,
          author: 'AUTHOR',
          digest: 'DIGEST',
          show_cover_pic: 1,
          content: 'CONTENT',
          content_source_url: 'https://github.com'
        }]
      }
      data = yield wechatApi.uploadMaterial('news',media,{})
      data = yield wechatApi.fetchMaterial(data.media_id,'news',{})

      console.log(data)

      var items = data.news_item
      var news = []
      items.forEach(function(item){
        news.push({
          title:item.title,
          description:item.digest,
          picUrl:picData.url,
          url:item.url
        })
      })
      reply =news
    }else if(content ==='11'){
      var counts = yield wechatApi.countMaterial()
      console.log('JSON.stringify(counts)')
      console.log(JSON.stringify(counts))


      var results = yield [
        wechatApi.batchMaterial({
          type:'news',
          count:10
        }),
        wechatApi.batchMaterial({
          type:'video',
          count:10
        }),
        wechatApi.batchMaterial({
          type:'voice',
          count:10
        }),
        wechatApi.batchMaterial({
          type:'image',
          count:10
        }),
      ]
      console.log('results')
      console.log(JSON.stringify(results))
      reply = '1'
    }
    this.body = reply
  }
  yield next
}