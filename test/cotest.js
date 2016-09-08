function co(generator){
    var gen = generator();

    var next = function(data){
        var result = gen.next(data);
        console.log("after var result = gen.next(data);");
        if(result.done) return;

        if (result.value instanceof Promise) {

            result.value.then(function (d) {
                next(d);
            }, function (err) {
                next(err);
            })
        }else {
            next();
        }
    };

    next();
}
co(function*(){
    var text1 = yield new Promise(function(resolve){
        console.log("in 1st Promise");
         resolve("I am text1")
        /*setTimeout(function(){
            resolve("I am text1");
        }, 1000);*/
    });

    console.log(text1);

    var text2 = yield new Promise(function(resolve){
        setTimeout(function(){
            resolve("I am text2");
        }, 1000);
    });

    console.log(text2);
});