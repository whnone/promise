// 最早异步 回调 -> promise (基于回调的) -> generator 生成器

// 生成器就是生成迭代器的  迭代器的含义就是 可以拥有迭代方法的

// Array.from 将类数组 转化成数组 拓展运算符必须要求对象是可以被迭代的

// function* read() { // 这就表示他是一个generator函数, 配合yield使用
//     yield 'react'
//     yield 'vue'
//     yield 'node'
// }
// let it = read();
// let done = false
// do{
//    let {value,done:flag} = it.next();
//    console.log(value);
//    done = flag
// }while (!done)
// console.log(it.next()); // 特点就是碰到yield 就停止

// console.log([
//   ...{
//     0: 1,
//     1: 2,
//     2: 3,
//     length: 3,
//     [Symbol.iterator]: function* () {
//         let i = 0;
//         while (i !== this.length) { // 怎么看this 谁调用的方法this 就是谁
//             yield this[i++]
//         }
//       // 迭代器函数返回会一个对象 对象中有next方法  方法中返回value和done
//       //   let i = 0;
//       //   return {
//       //     next: () => {
//       //       // 迭代函数 每次迭代都会调用next方法
//       //       return {
//       //         // 对象里有value和done
//       //         value: this[i],
//       //         done: i++ == this.length,
//       //       };
//       //     },
//       //   };
//     },
//   },
// ]);



// function* read(){
//     let a = yield 'node';
//     console.log(a,52)
//     let b = yield 'react';
//     console.log(b,53)
//     let c = yield 'vue'
//     console.log(c)
// }
// let it = read();
// console.log(it.next()) // 第一次传递参数是没有任何意义的
// console.log(it.next('xxx')); // next传递的参数， 是可以赋予给上一次yield的返回值
// console.log(it.next('ooo')); // next传递的参数， 是可以赋予给上一次yield的返回值
// console.log(it.next('qqq')); // next传递的参数， 是可以赋予给上一次yield的返回值