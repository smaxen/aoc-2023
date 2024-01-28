
import { check } from "aoc-util"
import _ from "lodash"

const file = Bun.file(`${import.meta.dir}/input.txt`)
const input = await file.text()
const lines: string[] = input.split('\n')

function q1LineVal(s: string): number {
    if (s.length==0) return 0
    const r = s.replaceAll(/[a-z]/g, '')
    const f = parseInt(r[0])
    const l = parseInt(r[r.length-1])
    const v = 10 * f + l
    // console.log(s, v)
    return v
}

type MatchValue = {
    m1: string,
    m2: string,
    value: number,
}

const matchValues: MatchValue[] = [
    {m1: '1', m2: 'one', value: 1},
    {m1: '2', m2: 'two', value: 2},
    {m1: '3', m2: 'three', value: 3},
    {m1: '4', m2: 'four', value: 4},
    {m1: '5', m2: 'five', value: 5},
    {m1: '6', m2: 'six', value: 6},
    {m1: '7', m2: 'seven', value: 7},
    {m1: '8', m2: 'eight', value: 8},
    {m1: '9', m2: 'nine', value: 9},
];

type MatchResult = {
    position: number,
    value: number
}

function q2LineVal(s: string): number {

    function minMv(result: MatchResult, mv: MatchValue): MatchResult {
        const m1v = _.filter([s.indexOf(mv.m1), s.indexOf(mv.m2)], i => i != -1 && i < result.position)
        return m1v.length ? { position: _.min(m1v)!, value: mv.value} : result
    }

    function maxMv(result: MatchResult, mv: MatchValue): MatchResult {
        const m1v = _.filter([s.lastIndexOf(mv.m1), s.lastIndexOf(mv.m2)], i => i != -1 && i > result.position)
        return m1v.length ? { position: _.max(m1v)!, value: mv.value} : result
    }

    const minResult = _.reduce(matchValues, minMv, {position: 1000, value: 0})
    const maxResult = _.reduce(matchValues, maxMv, {position: -1, value: 0})

    const result = 10 * minResult.value + maxResult.value

    // console.log(s, result)

    return result
}

check("A1", _.sum(_.map(lines, q1LineVal)), 55621)
check("A2", _.sum(_.map(lines, q2LineVal)), 53592)
