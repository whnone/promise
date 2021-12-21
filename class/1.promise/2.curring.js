// 柯里化函数
// 柯里化是将一个多个参数的函数 转化成成 一个个参数传入的函数
// 柯里化的目的 就是将一个函数进行细化

// 判断一个参数的类型
// typeof 判断类型 只适合基本类型 object array
// constuctor   {}.constructor = Object  [].constructor = Array
// instanceof
// Object.prototype.toString.call()

// 原来的函数
// function isType(type,val) {
//     return Object.prototype.toString.call(val) === `[object ${type}]`
// }
// function isType(type) {
//     return function(val){
//         return Object.prototype.toString.call(val) === `[object ${type}]`
//     }
// }
// 让某个功能变得更具体一些
// let isString = isType('String');
// console.log(isString('abc'))

// 实现一个通用的柯里化函数 可以将这个函数自动转换成柯理化的形式

// 偏函数 (可以分批传入参数) 柯里化的区别 (一个个传递)  我们一般不去区分是偏函数还是柯里化
function sum(a, b, c) {
  // [a,b,c]
  return a + b + c;
}
// 通用的柯里化函数 需要拿函数的参数个数sum.length  ,我们需要将每次调用时传递的参数组成一个数组

let curring = (fn,...args) => {
  // 需要根据fn的长度 和 我们当前调用时传递的参数做比较， 比较两个数的大小，如果参数个数大于用户传递的参数 需要返回一个新的函数，否则让这个函数执行
  function inner(args) {
    // args 每次用户调用时的参数列表
    //                                            累计参数  [1] [2,3] =》 【1,2,3】
    return fn.length > args.length ? (...args2) => inner([...args,...args2]): fn(...args);
  }
  return inner(args);
};
// let fn1 = curring(sum);
// let fn2 = fn1(1);
// let r = fn2(2,3);
// console.log(r);

// ------------------

function isType(type,val) {
    return Object.prototype.toString.call(val) === `[object ${type}]`
}
let isString = curring(isType,'String')
// let isString = newType('String')
let r = isString('4356')
// console.log(isString('123'));
// console.log(isString(123));
console.log(r);

