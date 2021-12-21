// const Promise = require("./promise");
Promise.race = function (values) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < values.length; i++) {
      let p = values[i]; //  p可能是promise 也可能是普通值
      // 无论谁先成功就成功 谁先失败就失败
      // 原生的promise， 如果你里面放的是一个promise 会进行优化， 不会在进行包装了   1次then
      // 我们自己写的promise 多了一个条件 如果当前resolve里面放的是promise，我会调用这个promise.then  2次then
      Promise.resolve(p).then(resolve, reject);
    }
  });
};
// 赛跑   面试的时候 会考察如何实现超时处理  有一个成功或者失败就结束了

Promise.race([
  new Promise((resolve, reject) => {
    // 这个玩意没有所谓的异步任务
    reject(100);
  }),
  200,
])
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err, "catch");
  });

// ------------race使用场景---------------

// 超时 模拟取消操作 promise 不能随便取消
// 延迟对象 dfd = {promise,resolve,reject}
// let abort = null;
let p = new Promise((resolve, reject) => {
  //   abort = reject;
  setTimeout(() => {
    resolve("ok");
  }, 3000);
});
function withAbort(p) {
  // Promise.race([p,'我的内部的promise '])
  let abort = null;
  let myErrorPromise = new Promise((resolve, reject) => {
    abort = reject;
  });
  let returnPromise = Promise.race([p, myErrorPromise]); // 有任何一个promise失败了就失败
  returnPromise.abort = abort;
  return returnPromise;
}
let promise2 = withAbort(p);
setTimeout(() => {
  promise2.abort("超时"); // 抢先调用了promise的失败方法 , 自己控制这个promise走向失败
}, 5000);
promise2
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err, "fail");
  });
