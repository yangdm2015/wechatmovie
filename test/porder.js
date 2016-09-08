new Promise(function(resolve){
    console.log('promise begin')
    for( var i=0 ; i<10000 ; i++ ){
        i==5000 && console.log('loop...')
        i==9999 && resolve()
    }
    console.log('promise end')
})/*.then(function(){
    console.log('callback')
})
console.log('other...')*/
.then(function(){(1)
    console.log('callback')
}) // 放入队列，等待调用栈空闲

setTimeout(function() {(2)
  console.log('other...');
}, 0); // 放入调用队列，在(1)之后

