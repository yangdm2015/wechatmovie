'use strict'
module.exports = function (){
  console.log(this); // is the Context
  console.log(this.request); // is the Context
  console.log(this.response); // is the Context
    return function *(next){
    console.log("\n********* g returned! *********" );
  }
}