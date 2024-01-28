
import _ from 'lodash'
import {Input, Part, Rule, data} from './parser'
import { check, ll, log } from 'aoc-util'

const [wf, parts]: Input = (await data.input())
// ll(wf)
// ll(parts)

const wfMap: Map<string, [Rule[], string]> = new Map(wf.map(([n, r, d]) => [n, [r, d]]))

function accept(p: Part): boolean {
    function go(wf: string): boolean {
        const [rules, def] = wfMap.get(wf)!
        const nwf = _.find(rules, ([c, o, n, s]) => {
            const v = p.get(c)!
            switch(o) {
            case ">": return v > n
            case "<": return v < n
        }})?.[3]??def
        switch(nwf) {
            case "A": return true
            case "R": return false
            default: return go(nwf)
        }
    }
    const result = go("in")
    return result
}

function value(p: Part): number {
    return _.sum([... p.values()])
}

const results = parts.filter(accept).map(value)
check("A1", _.sum(results), 509597)
