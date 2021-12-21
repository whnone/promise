const Promise = require("./history/1.promise");
let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("ok");
  }, 1000);
});

p.then(
  (value) => {
    console.log(value, "s");
  },
  (reason) => {
    console.log(reason, "f");
  }
);

p.then(
  (value) => {
    console.log(value, "s");
  },
  (reason) => {
    console.log(reason, "f");
  }
);
// 调用then的时候可能 会出现既没有成功也没有失败的情况
// 那么我需要将成功 存放起来， 在把失败存放起来,稍后调用resolve 在走存放好的成功 和 存放好的失败
