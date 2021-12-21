// const Promise = require("./history/2.promise");

// let promise = new Promise((resolve,reject)=>{

// })

// promise.then((value)=>{
//     console.log('s',value)
// },(reason)=>{
//     console.log('f',reason)
// })

// 多个请求之间的依赖关系  上一个人的输出是下一个人的输入
// 异步嵌套 我们能把他变得优雅一些  (发布订阅模式)
// const fs = require("fs");

// function readFile(...args) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(...args, function (err, data) {
//       if (err) return reject(err);
//       resolve(data);
//     });
//   });
// }
// 3.如果不是1,2的情况 则会将返回的值向下传递给下一个then的成功
// 2.在then的成功和失败的回调中发生异常了
// 1.如果用户在then的成功或者失败的回调函数中返回一个promise， 会根据这个promise的状态来决定走外层下一个then的成功还是失败，并且将原因向下传递

// 什么时候会走失败 1） 抛错   2) 返回一个失败的promose   3) 其他都走成功

// 为题1：如何实现的链式调用呢？ 返回this
// let p1 = readFile("a.txt", "utf8")  // p1  成功  return this
//   .then(
//     (data) => {
//      throw new Error('失败')
//     },
//     (err) => {
//       return 100
//     }
//   ).then( // p1已经成功了 还能变成失败吗？  为了保证每次then之后都能产生一个全新的promise 我们采用每次调用then都返回一个promise实例
//     (data) => {
//       console.log(data,'s');
//     },
//     (err) => {
//       console.log(err,'f');
//     }
//   );

let Promise = require("./history/2.promise");
// ----------------------------------
const fs = require("fs");
function readFile(...args) {
  return new Promise((resolve, reject) => {
      resolve();
    // fs.readFile(...args, function (err, data) {
    //   if (err) return reject(err);
    //   resolve(data);
    // });
  });
}
// x 决定promise2 的状态
// 如果x是普通值 直接调用promise2的resolve即可
// 如果x是promise
let promise2 = readFile("a.txt", "utf8").then(
  (data) => {
    return 100
  },
  (err) => {
    return 200;
  }
);

promise2.then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err, "e");
  }
);
