
import _ from 'lodash'
import {Input, data} from './parser'
import { check, log } from 'aoc-util'
import { mxTR } from 'aoc-mx'

const input = await data.input()

// input.forEach(l => {l.forEach(n => log(n)), log("---")})

function solution(pattern: Input): number[] {
    const cols = pattern[0].length
    return _.range(1, cols).filter(i => {
        const s = (i < cols/2) ? i : cols-i
        return pattern.every(p => _.isEqual(p.slice(i-s,i), _.reverse(p.slice(i,i+s))))
    })
}

function rcs(pattern: Input): number[] {
    const a1 = solution(pattern)
    const a2 = solution(mxTR(pattern)).map(i=>100*i)
    return _.concat(a1, a2)
}

function smudge(pattern: Input): number {
    const cols = pattern[0].length
    const exclude = rcs(pattern)[0]
    const [c1, c2] = _.range(0, pattern.length).flatMap(r => {
        return _.range(0, cols).flatMap(c => {
            const b = pattern[r][c]
            pattern[r][c] = (b === ".") ? "#" : "."
            const a = rcs(pattern)
            pattern[r][c] = b
            return a
        }).filter(i => (i !== exclude))  
    })
    if (c1 !== c2) throw "ux"
    return c1
}

const answers = input.map(smudge)
check("A1", _.sum(answers), 32497)

