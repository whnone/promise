// const Promise = require("./history/4.promise");
// const fs = require("fs");
// 我们的proimise 为了解决嵌套问题

// deferred 延迟对象 目的是产生一个可以延迟的promise对象

// function readFile(...args) {
//   let dfd = Promise.deferred();
//   fs.readFile(...args, function (err, data) {
//     if (err) return dfd.reject(err);
//     dfd.resolve(data);
//   });
//   return dfd.promise;
// }

// readFile('a.txt','utf8').then(data=>{
//     return readFile(data+1,'utf8')
// }).catch(err=>{
//     console.log('2错')
// }).then((data)=>{
//     console.log(data)
// })

// catch方法也经常使用到

// Promise.resolve / Promise.reject

// Promise.reject(new Promise((resolve,reject)=>{
//     setTimeout(() => {
//         resolve('ok');
//     }, 1000);
// })).catch(err=>{
//     console.log(err)
// });
// Promise.resolve(new Promise((resolve,reject)=>{
//     setTimeout(() => {
//         resolve('ok');
//     }, 1000);
// })).then(data=>{
//     console.log(data)
// })

//  注意区别 Promise.resolve 会解析里面的promise (会有等待效果)
//  对于Pormise.reject 而言 不具备等待效果的

// Promise.all

// const Promise = require("./history/4.promise")

const fs = require("fs");
function readFile(...args) {
  return new Promise((resolve, reject) => {
    fs.readFile(...args, function (err, data) {
      if (err) return reject(err);
      resolve(data);
    });
  });
}
// promise.all 就是都成功就是成功了 , 有一个失败就失败了
Promise.all([readFile('a.txt','utf8'), readFile('b.txt','utf8'), 3, 4, 5]).then((data) => {
  console.log(data);
}).catch(err=>{
    console.log(err)
})

// promise.finally
Promise.prototype.finally = function(cb){
    return this.then((y)=>{
        return Promise.resolve(cb()).then(()=>y)
    },(r)=>{
        return Promise.resolve(cb()).then(()=>{throw r})
    })
}

Promise.resolve('abc')
.finally((...args)=>{
    console.log('无论成功和失败都执行',args)
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            resolve()
        }, 1000);
    })
}).then(data=>{
    console.log(data,'s')
}).catch(err=>{
    console.log(err,'err')
})


// race , promisify generator async + await 
// 前端事件环 

// node  node事件环 基础， 模块 内置模块 fs 使用buffer。。。 net http koa express mongo redis