
import _ from 'lodash'
import {Category, Input, Part, Rule, data} from './parser'
import { check, ll, log } from 'aoc-util'

const [wf, _p]: Input = (await data.input())

type Range = [number, number]
type PartR = Map<Category, Range>

const wfMap: Map<string, [Rule[], string]> = new Map(wf.map(([n, r, d]) => [n, [r, d]]))

function intersect([f1, t1]: Range, [f2, t2]: Range): Range[] {
    const f = Math.max(f1, f2)
    const t = Math.min(t1, t2)
    return (t >= f) ? [[f, t]] : []
}    

const maxSize = 4000
const maxRange: Range = [1, maxSize]
const maxPartR: PartR = new Map([["x", maxRange],["m", maxRange],["a", maxRange],["s", maxRange]])

function goW(p: PartR, wf: string): PartR[] {
    switch (wf) {
        case "A":
            return [p]
        case "R":
            return []
        default:        
            const [rules, def] = wfMap.get(wf)!
            return goR(p, rules, def)
    }
}

function goR(p: PartR, rules: Rule[], def: string): PartR[] {        
    if (_.isEmpty(rules)) return goW(p, def)
    const [c, o, n, s] = _.head(rules)!
    const cRange = p.get(c)!
    const other = _.tail(rules)
    if (o === ">") {
        return _.concat(
            intersect(cRange, [n+1, maxSize]).flatMap(r => goW((new Map(p)).set(c, r), s)),
            intersect(cRange, [1, n]).flatMap(r => goR((new Map(p)).set(c, r), other, def)),
        )
    } else {
        return _.concat(
            intersect(cRange, [1, n-1]).flatMap(r => goW((new Map(p)).set(c, r), s)),
            intersect(cRange, [n, maxSize]).flatMap(r => goR((new Map(p)).set(c, r), other, def)),
        )
    }
}

function combinations(p: PartR): number {
    function r(c: Category): number {
        const [f, t] = p.get(c)!
        return t-f+1
    }
    return r("x")*r("m")*r("a")*r("s")
}

const partRs = goW(maxPartR, "in")

const results = partRs.map(combinations)

check("A2", _.sum(results), 143219569011526)
