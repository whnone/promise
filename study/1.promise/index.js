
// const Promise = require('../../class/1.promise/history/3.promise')
const Promise = require('./promose-2')

const p = new Promise((resolve, reject) => resolve())

let p2 = p.then(() => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(100002)
        }, 1000)
    })
}, (reasons) => {
    console.log(reasons, 'f')
})

p2.then((value) => {
    console.log(value, 's')
}, (reason) => {
    console.log(reason, 'ff')
})
