"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);// it.next(value)
    var value = info.value; 
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) { // 如果完成则让这个promise 直接成功
    resolve(value);
  } else { 
    Promise.resolve(value).then(_next, _throw); // _throw 调用的是it.throw 可以抛出异常
  }
}

// co库
function _asyncToGenerator(fn) { // fn指代的是生成器执行后的结果 就是迭代器
  return function () { // co 直接编译出了一个co
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args); // 调用函数 拿到了gen
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

function read() {
  return _read.apply(this, arguments);
}

// _asyncToGenerator  async 函数最后会被编译成 generator
function _read() {
  _read = _asyncToGenerator(
    /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
      var out1, out2;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              _context.next = 2;
              return fs.readFile("a1.txt", "utf8");

            case 2:
              out1 = _context.sent;
              _context.next = 5;
              return fs.readFile(out1, "utf-8");

            case 5:
              out2 = _context.sent;
              return _context.abrupt("return", out2);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })
  );
  return _read.apply(this, arguments);
}


// 浏览器的事件环 + node中的基本用法
// generator 唯一使用的场景就是saga  dva -> redux-saga
// async + await 就是可以让promise的写法尽可能的同步化 