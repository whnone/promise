const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";
  // 所有的promise 都要遵循这个规范 这样就可以保证不同人写的promise可以混用
  // 核心就在这个resolvePromise方法中
function resolvePromise(x, promise2, resolve, reject) {
  // x 决定promise2 的状态 走成功还是失败
  if(promise2 === x){
    return reject(new TypeError('循环引用'));
  }
  // 判断x 是不是一个promise 先保证x 得是一个对象或者函数，如果不是对象或者函数那么x 一定不是promise
  if((typeof x === 'object' && x !== null) || typeof x === 'function'){
    let called;
    // 我需要看 这个x 上有没有then方法 有then方法才说明他是一个promise
    try{
      let then = x.then; // x可能是别人写的promise 那么取then有风险，
      if(typeof then === 'function'){ 
        then.call(x,(y)=>{ // x.then((y)=>{},r=>{}) 取then就会有风险
          if(called) return;
          called = true;
          resolvePromise(y,promise2,resolve,reject); // 递归解析直到我们的y的值是一个普通值
        },(r)=>{
          if(called) return;
          called = true;
          reject(r);
        })
      }else{ //  没有then方法的都执行这里
        resolve(x); // 只是一个对象而已 就是一个普通值
      }
    }catch(e){
      if(called) return;
          called = true;
      reject(e);
    }
  }else{
     // x 就是一个普通的值,直接把x 传递给promise2的成功即可
     resolve(x);
  }
}
class Promise {
  constructor(executor) {
    this.value = undefined;
    this.reason = undefined;
    this.status = PENDING;
    this.onResvoledCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onResvoledCallbacks.forEach((fn) => fn());
      }
    };
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  then(onFulfilled, onRejected) {
    // 有可能这个 onFulfilled, onRejected 是可选的
    onFulfilled = typeof onFulfilled === 'function'  ? onFulfilled :function(data){return data};
    onRejected = typeof onRejected === 'function'? onRejected : err=> {throw err}
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(x, promise2, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(x, promise2, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.status === PENDING) {
        this.onResvoledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(x, promise2, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(x, promise2, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    return promise2;
  }
}

// 在测试的时候 会测试你的promise对象是否符合规范
Promise.deferred = function(){
  let dfd = {};
  dfd.promise = new Promise((resolve,reject)=>{
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd
}
// npm install promises-aplus-tests -g
// promises-aplus-tests 3.promise
// catch Promise.resolve Promise.reject

module.exports = Promise;
