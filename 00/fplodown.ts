

import _ from 'lodash/fp'

const abc = ['a','b','c']


const abc1 = _.clone(abc)
const rev = _.reverse(_.clone(abc1))
abc1[1]='x'
console.log(abc1, rev)

const abc2 = _.clone(abc)
const fil = _.filter(c => c !== 'b', abc2)
abc2[1]='x'
console.log(abc2, fil)

const abc3 = _.clone(abc)
const map = _.map(c => `${c}3`, abc3)
abc3[1]='x'
console.log(abc3, map)

const abc4 = _.clone(abc)
const tal = _.tail(abc4)
abc4[1]='x'
console.log(abc4, tal)

const abc5 = _.clone(abc)
const fild = _.fill(0, abc.length, -1, abc5)
abc5[1]='x'
console.log(abc5, fild)
