const fs = require("fs").promises;
function* read() { // 生成器  固定写法 加个*
  // 很像同步的
  let out1 = yield fs.readFile("a.txt", "utf8");
  let out2 = yield fs.readFile(out1, "utf-8");
  return out2;
}
// 流程控制 1 2 3 4  -> 减缓了then链
function co(it){ // co的核心源码
    return new Promise((resolve,reject)=>{
        function next(data){
            let {value,done} = it.next(data); // 拿到 done 是否完成 value就是本次yield的返回值
            if(done){ // 如果解析完毕直接将结果作为co的成功结果
                return resolve(value)
            }
            Promise.resolve(value).then(data=>{
                next(data)
            },reject)
        }
        next();
    })
}
co(read()).then(data=>{
    console.log(data)
})

// let it = read();
// let { value, done } = it.next();
// value.then(data=>{
//     let {value,done} = it.next(data);
//     value.then(data=>{
//         let {value , done} = it.next(data);
//         console.log(value)
//     })
// })
