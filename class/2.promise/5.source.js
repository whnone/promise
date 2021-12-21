const fs = require("fs").promises;

const regeneratorRuntime = {
  mark(outerFn) {
    return outerFn;
  },
  wrap(innerFunc, outerFn) {
    // 核心就是 生成器会返回一个迭代器
    const _context = {
      next: 0, // 状态机 不停的改变指针 最终将代码执行完毕
      done: false,
      abrupt(type, value) {
        _context.next = "end";
        innerFunc(_context);
        this.value = value;
        return value;
      },
      stop() {
        this.done = true;
        return this.value;
      },
    };
    return {
      next(data) {
        // 每次调用next 都会执行这个read$函数 inerFunc
        _context.sent = data; // 每次用户调用next 会将数据传递过来
        let value = innerFunc(_context);

        return {
          value,
          done: _context.done,
        };
      },
    };
  },
};
var _marked = /*#__PURE__*/ regeneratorRuntime.mark(read);
// polyfill
function read() {
  // generator 最终被编译出来了 这个方法
  var out1, out2;
  return regeneratorRuntime.wrap(function read$(_context) {
    while (1) {
      // 在编写代码的时候 如果一个函数 会执行多次 我们通常会用一个while(1) 来表识代码会走多次
      switch (
        (_context.prev = _context.next) // next -》 prev 判断的是prev
      ) {
        case 0:
          _context.next = 2;
          return fs.readFile("a.txt", "utf8");

        case 2:
          out1 = _context.sent;
          _context.next = 5;
          return fs.readFile(out1, "utf-8");

        case 5:
          out2 = _context.sent;
          _context.next = 7;
          return _context.abrupt("return", out2);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}
// 流程控制 1 2 3 4  -> 减缓了then链
function co(it) {
  // co的核心源码
  return new Promise((resolve, reject) => {
    function next(data) {
      let { value, done } = it.next(data); // 拿到 done 是否完成 value就是本次yield的返回值
      if (done) {
        // 如果解析完毕直接将结果作为co的成功结果
        return resolve(value);
      }
      Promise.resolve(value).then((data) => {
        next(data);
      }, reject);
    }
    next();
  });
}
co(read()).then((data) => {
  console.log(data);
});

// let it = read();
// let { value, done } = it.next();
// value.then(data=>{
//     let {value,done} = it.next(data);
//     value.then(data=>{
//         let {value , done} = it.next(data);
//         console.log(value)
//     })
// })
