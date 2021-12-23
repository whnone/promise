
function resolvePromise (x, promise2, resolve, reject) {
    if (x === promise2) return reject(new TypeError('循环引用'))

    // 判断x是不是promise，要先保证x是一个对象或者函数，如果不是对象或者函数，那x一定不是promise，而是一个普通值
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {

        let called;

        try {
            let then = x.then
            // 是一个promise
            if (typeof then === 'function') {
                // x.then((y)=>{},r=>{}) 取then就会有风险
                then.call(x, y => {
                    if (called) return
                    called = true
                    resolvePromise(y, promise2, resolve, reject)
                }, r => {
                    if (called) return
                    called = true
                    reject(r)
                })
            
            // 没有then方法，则为普通值(/函数)
            } else {
                resolve(x)
            }


        } catch(err) {
            if (called) return
            called = true
            reject(err)
        }

    } else {
        // x不是promise，是一个普通值，则直接resolve，传递给promise2的成功即可
        resolve(x)
    }


}

const PADDIND = 'PADDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

class Promise {
    constructor(executor){
        this.status = PADDIND
        this.value = null
        this.reason = null
        this.onResolveCallback = []
        this.onRejectCallback = []

        const resolve = (value) => {
            // 处理promise.resolve() 里面是promise对象
            if (value instanceof Promise) {
                return value.then(resolve, reject)
            }
            if (this.status === PADDIND) {
                this.value = value
                this.status = FULFILLED
                this.onResolveCallback.forEach(i => i())
            }
        }

        const reject = (reason) => {
            if (this.status === PADDIND) {
                this.status = REJECTED
                this.reason = reason
                this.onRejectCallback.forEach(i => i())
            }
        }
        try {
            executor(resolve, reject)
        } catch (err) {
            reject(err)
        }
    }
    then (onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
        onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err}

        let promise2 = new Promise((resolve, reject) => {
                if (this.status === FULFILLED) {
                    // promise的then函数是添加到微任务队列中
                    // queueMicrotask将传参函数添加到微任务中
                    // setTimeout会把事件添加到宏任务队列中，所以这个地方没有用setTimeout
                    queueMicrotask(() => {
                        try {
                            let x = onFulfilled(this.value)
                            resolvePromise(x, promise2, resolve, reject)
                        }catch (err) {
                            reject(err)
                        }
                    })
                }

                if (this.status === REJECTED) {
                    queueMicrotask(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(x, promise2, resolve, reject)
                        } catch(err) {
                            reject(err)
                        }

                    })
                }

                if (this.status === PADDIND) {
                    this.onResolveCallback.push(() => {
                        queueMicrotask(() => {
                            try {
                                let x = onFulfilled(this.value)
                                resolvePromise(x, promise2, resolve, reject)
                            } catch(err) {
                                reject(err)
                            }
                        })
                    })

                    this.onRejectCallback.push(() => {
                        queueMicrotask(() => {
                            try {
                                let x = onRejected(this.reason)
                                resolvePromise(x, promise2, resolve, reject)
                            } catch(err) {
                                reject(err)
                            }
                        })
                    })
                }
            
        })
        
        return promise2
    }
    // 拓展方法
    catch (errCallback) {
        return this.then(null, errCallback)
    }
    static reject (reason) {
        return new Promise((resolve,reject) => {
            reject(reason)
        })
    }
    static resolve (value) {
        return new Promise((resolve,reject) => {
            resolve(value)
        })
    }
    static all (values) {
        return new Promise((resolve, reject) => {

            let vals = []
            let times = 0

            function _$initMap (key, data) {
                vals[key] = data
                if (++times == values.length) {
                    resolve(vals)
                }
            }

            for (let i = 0; i< values.length; i++) {
                // 可能是promise/普通值
                let val = values[i]
                let then = val?.then
                if (typeof then === 'function') {
                    then.call(val, (data) => {
                        _$initMap(i, data)
                    }, reject)
                } else {
                    _$initMap(i, val)
                }
            }
        })
    }
    static finally(finallyCallback) {
        return this.then((y) => {
            return new Promise.resolve(finallyCallback()).then(() => y)
        }, (r) => {
            return new Promise.resolve(finallyCallback()).then(() => {throw r})
        })
    }
}

// 测试规范 and 创造一个延迟对象
Promise.deferred = function () {
    let dfd = {}
    dfd.promise = new Promise((resolve ,reject) => {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}
// npm install promises-aplus-tests  -g
// promises-aplus-tests promose-1

module.exports = Promise
