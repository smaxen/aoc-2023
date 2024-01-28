
import _ from 'lodash'
import {Input, data} from './parser'
import { check, log } from 'aoc-util'
import { mxTR } from 'aoc-mx'

const input = await data.input()

// input.forEach(l => {l.forEach(n => log(n)), log("---")})

function solution(pattern: Input): number {
    const cols = pattern[0].length
    const first = 1+_.range(1, cols).findIndex(i => {
        const s = (i < cols/2) ? i : cols-i
        return pattern.every(p => _.isEqual(p.slice(i-s,i), _.reverse(p.slice(i,i+s))))
    })
    return first
}

function rcs(pattern: Input): number {
    return solution((pattern)) + 100 * solution((mxTR(pattern)))
}

const answers = input.map(rcs)
// log(answers)

check("A1", _.sum(answers), 37975)

