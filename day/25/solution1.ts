
import _ from 'lodash'
import {data} from './parser'
import { check, ll, log } from 'aoc-util'
import { Set, Map } from 'hash-set-map'
import chalk from 'chalk'

const input = await data.input()
// mx.mxLog(input)

const all = new Set(input.flatMap(([f, t]) => [f, ...t]))
// ll([...all], "all")

const pairs = input.flatMap(([f, ta]) => ta.map(t => [f, t]))
// ll(pairs, "pairs")

const links: Map<string, Set<string>> = new Map([...all].map(n => [n, new Set<string>()]))
pairs.forEach(([f, t]) => {
    links.get(f)!.add(t)
    links.get(t)!.add(f)
})

function snip(f: string, t: string) {
    links.get(f)!.delete(t)
    links.get(t)!.delete(f)
}

// If the two most common nodes are also directly connected then snip
// and run search again, (after 3 snips 'no path' is thrown when searching).
// Only works if the two worlds are roughly the same size.
snip("hvm", "grd")
snip("pmn", "kdc")
snip("zfk", "jmn")

const doSearch = false
if (doSearch) {
    var trials=1000
    const trialNodes = [...all]
    const frequency: Map<string, number> = new Map([...all].map(n => [n, 0]))
    while (trials-- > 0) {
        const f = _.sample(trialNodes)!
        const t = _.sample(trialNodes)!
        const path = search(f, t)
        if (_.isEmpty(path)) throw "no path"
        // log(path)
        path.forEach(p => frequency.set(p, frequency.get(p)!+1))
    }
    ll(_.sortBy([...frequency], b => b[1]).filter(b => b[1]>0), "frequency")
}

function search(f: string, t: string): string[] {
    const visited = new Set([f])
    var found: string[] = []
    function expand(path: string[]): string[][] {
        const last: string = _.last(path)!
        const nCandidates = links.get(last)!
        if (nCandidates.has(t)) {
            found = [...path,t]
            return []
        }
        const next = [...nCandidates].filter(n => !visited.has(n))
        next.forEach(x => visited.add(x))
        return next.map(n => [...path, n])
    }

    var candidates = [[f]]
    while (!_.isEmpty(candidates) && _.isEmpty(found)) {
        candidates = candidates.flatMap(expand)
    }
    return found
}

function count(f: string): number {
    const visited = new Set([f])
    var current = [f]
    while (!_.isEmpty(current)) {
        const next = new Set(current.flatMap(c => [...links.get(c)!].filter(n => !visited.has(n))))
        next.forEach(x => visited.add(x))
        current = [...next]
    }
    return visited.size
}

// Pick any snipped pair
const hvmC = count("hvm")
const grdC = count("grd")

// log("A1", all.size, hvmC, grdC, hvmC+grdC, hvmC*grdC, 612945)

check("A1", hvmC*grdC, 612945)
