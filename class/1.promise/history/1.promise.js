// 原生的es6 是自己实现了promise 不需要考虑兼容
// 1.promise是一个类 在使用的时候 需要new这个类  √
// 2,在newPromise的时候 需要传入一个executor执行器 默认会立即被调用，而且参数有两个 resolve,reject √
// 3.promise有三个状态 分别是 pendding 默认等待态  onfulfilled 成功态  onrejected 失败态
//   我们的promise默认就是pendding 当用户调用resolve时会变成成功态 调用reject的时候会变成失败态
//   成功可以传入成功的原因 失败可以传入失败的原因 √
// 4.new Promise 会返回一个promise实例 这个实例上有一个then方法 , then方法中有两个参数一个是成功的回调一个是失败的回调   √
// 5.走向失败有两种情况 reject()  用户主抛出异常  √
// 6.一个promise中可以then多次 （发布订阅模式）
// 7.promise的状态是不能从成功变成失败，也不能从失败变成成功 只有pendingg的时候才能更改状态

const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";
class Promise {
  constructor(exector) {
    this.status = PENDING;
    this.value = undefined; // 成功的原因
    this.reason = undefined; // 失败的原因

    this.onResolvedCallbacks = []; // 存放成功的回调
    this.onRejectedCallbacks = []; // 存放失败的回调
    const resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onResolvedCallbacks.forEach((fn) => fn());
      }
    }; // 每次new 都生成两个方法 reoslve,reject
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };
    try {
      exector(resolve, reject); // 传递给用户两个参数
    } catch (e) {
      reject(e);
    }
  }
  then(onFulfilled, onRejected) {
    if (this.status == FULFILLED) {
      onFulfilled(this.value);
    }
    if (this.status == REJECTED) {
      onRejected(this.reason);
    }
    if (this.status == PENDING) {
      // 稍后成功了 除了执行回调外 还有其他的逻辑
      this.onResolvedCallbacks.push(() => {
        // todo...
        onFulfilled(this.value);
      });
      this.onRejectedCallbacks.push(() => {
        // todo...
        onRejected(this.reason);
      });
    }
  }
}

module.exports = Promise;
