// 我们需求是这个样子的 同时读取两个文件 拿到最终的结果

// 对于异步而言常见的两个场景
// 1) 我么希望同步多个异步请求结果  (可以采用计数器的方式)
// 2) 第一个请求的结果是第二个请求的输入的结果
// 3) 解决异步的问题的解决方案可以 使用 回调的方式

const fs = require("fs");
let school = {};
// function out() {
//     if(Object.keys(school).length === 2){
//         console.log(school);
//     }
// }
const after = (times,callback) => {
    return function(){
        if(--times === 0){
            callback()
        }
    }
};
let out = after(2, () => { // 这个逻辑好拆分 
  console.log(school);
});
// 使用发布订阅模式 将这个模型再次简化 ， 我期望每次执行我都能监控到结果
// after函数只能拿到最终的结果，中间的过程是无法监控的
fs.readFile("./a.txt", "utf8", function (err, data) {
  school.name = data;
  out();
});
fs.readFile("./b.txt", "utf8", function (err, data) {
  school.age = data;
  out();
});
