// const Promise = require('./history/3.promise');


// x and promise2 refer to same object
// let p1 = new Promise((resolve,reject)=>resolve());

// let p2 = p1.then(()=>{
//   return new Promise((resolve,reject)=>{
//     setTimeout(() => {
//      reject( new Promise((resolve,reject)=>{
//        setTimeout(() => {
//          resolve(10000000)
//        }, 3000);
//      }))
//     }, 1000);
//   })
//    // 如果x 是promise我需要等待promise变成成功或者失败
// })

// p2.then((data)=>{
//   console.log(data,'s')
// },err=>{
//   console.log(err,'f')
// })


// retrying x proerty  thrown exception e
// let promise = {}
// Object.defineProperty(promise,'then',{
//   get(){
  //   if(index === 2)
//     throw new Error('')
//   }
// })
// promise.then


// then optional arguments 穿透
new Promise((resolve,reject)=> {
  reject('err')
}).then().then().then().then((data)=>{
  console.log(data,'sss')
},err=>{
  console.log('err')
})