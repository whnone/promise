// 高阶函数的概念  1.一个函数参数是一个函数， 我们可以将这个函数认作是高阶函数
//                2. 一个函数返回一个函数  也可以称之为高阶函数
//                这两点满足任何一个都是高阶函数
function say(who) { // 普通的函数
  console.log("say", who);
}
// 对原函数进行扩展 但是不破坏原函数
// @装饰器对类来扩展
Function.prototype.before = function (beforeSay) {
  // 接受到了回调方法
  return (...args) => {
    // newSay
    beforeSay(...args);
    this(...args);
  };
};
let beforeSay = (args) => {
  // 传入一个回调方法
  console.log("say before", args);
};
 let newSay = say.before(beforeSay);
newSay("我"); // 这里调用的应该是新的方法


// 1) 原型的使用 给某个类型添加原型 可以在所有的公共方法上进行扩展
// 2）箭头函数 可以保证this不被篡改，找到的是上一级的this
// 3) ...args 放到参数里面 可以把所有参数组合成数组  放到执行中可以将数组展开