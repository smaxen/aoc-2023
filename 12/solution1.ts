
import _ from 'lodash'
import {Input, data} from './parser'
import { check, log } from 'aoc-util'

const input = await data.input()

const debug = false

function hit() {
    if (debug) log("hit")
    return 1
}
function fail() {
    if (debug) log("fail")
    return 0
}

// operational, damaged, unknown

function go(damagedBuffer: number, springs: string[], damaged: number[]): number {
    if (debug) log(damagedBuffer, springs, damaged)
    if (springs.length === 0) {
        switch (damaged.length) {
            case 0: return (damagedBuffer === 0) ? hit() : fail()
            case 1: return (damagedBuffer === damaged[0]) ? hit() : fail()
            default: return fail()
        }
    }
    const tail = _.tail(springs)
    if (damagedBuffer > 0) {
        if (_.isEmpty(damaged)) return fail()
        if (damaged[0] == damagedBuffer) {
            if (springs[0] === "#") return fail()
            return go(0, tail, _.tail(damaged))
        }
        if (springs[0] === '.') return fail()
        return go(damagedBuffer+1, tail, damaged)    
    }
    switch(springs[0]) {
        case '#': return go(1, tail, damaged)
        case '.': return go(0, tail, damaged)
        case '?': return go(0, tail, damaged) + go(1, tail, damaged)
        default: throw "Unexpected"
    }
}

function go1(s: string, a: number[], e: number) {
    const act = go(0, [... s], a)
    if (act !== e) log("go1", act, e, s, a)
}

check('A1', _.sum(input.map(([s, d]) => go(0, [...s], d))), 7361)







