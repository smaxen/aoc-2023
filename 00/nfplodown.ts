

import _, { identity } from 'lodash'

const abc = ['a','b','c']


const abc1 = _.clone(abc)
const rev = _.reverse(_.clone(abc1))
abc1[1]='x'
console.log(abc1, rev)

const abc2 = _.clone(abc)
const fil = _.filter(abc2, c => c !== 'b')
abc2[1]='x'
console.log(abc2, fil)

const abc3 = _.clone(abc)
const map = _.map(abc3, c => `${c}3`)
abc3[1]='x'
console.log(abc3, map)

const abc4 = _.clone(abc)
const tal = _.tail(abc4)
abc4[1]='x'
console.log(abc4, tal)

const abc5 = _.clone(abc)
// const sby = abc5.sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
const sby = _.sortBy(abc5, a => a.charCodeAt(0))
abc5[1]='x'
console.log("sby", abc5, sby)

const abc6 = _.clone(abc)
const tak = _.take(abc6, 2)
const drp = _.drop(abc6, 2)
abc6[1]='x'
console.log(abc6, tak, drp)

const m1 = new Map([[1, 2]])
const m2 = new Map(m1)
m2.set(1, 4)
m1.set(1, 3)
console.log("m1", m1)
console.log("m2", m2)
