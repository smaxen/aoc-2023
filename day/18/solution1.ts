
import _, { forEach } from 'lodash'
import {Edge, Input, data} from './parser'
import { mxEmpty, mxExpand, mxInBounds, mxLog } from 'aoc-mx'
import { check, Direction, Point, a90, advanceN, c90, ll, log, opposite, window } from 'aoc-util'

const input: Edge[] = (await data.input())
// ll(input, "input")

type UDI = "U" | "D" | "I"

const fp: [Point, Direction][] = _.reduce(input, (acc, [d, n, color]) => {
    const p: Point = _.isEmpty(acc) ? [0,0] : _.last(acc)![0]
    const np: [Point, Direction][] = advanceN(p, d, n).map(ap => [ap, d])
    return [...acc, ...np]
}, [] as [Point, Direction][])

const ep: [Point, UDI][] = _.map(fp, ([p, d], idx) => {
    const nd = fp[(idx+1) % fp.length][1]
    if ((d === Direction.Up) || (d === Direction.Down)) {
        return [p, d]
    } else if ((nd === Direction.Up) || (nd === Direction.Down)) {
        return [p, nd]
    } else {
        return [p, "I"]
    }
})

const pov = _.groupBy(ep, ([[l,c],d]) => l)
const ov: [Point, UDI][][] = _.values(pov)

const lp: [number, UDI][][] = ov.map(a => _.chain(a).map(([[l,c],d]) => [c, d]).sortBy(([c, d]) => c).value()) as [number, UDI][][]


type CalcAcc = [[number, UDI, boolean], number]
function calc(e: [number, UDI][]): number {
    const [hc, hd] = _.head(e)!
    const [wip, total] = _.reduce(_.tail(e), ([open, area], [c, d]) => {
        const [oc, od, closing] = open
        if (d === od) {
            return [[c, d, closing], area + c - oc] as CalcAcc
        } else if (d === "I") {
            return [[c, od, closing], area + 1] as CalcAcc
        } else if (!closing) {
            return [[c, d, true], area + c - oc] as CalcAcc
        } else {
            return [[c, d, false], area + 1] as CalcAcc
        }
    }, [[hc, hd, false], 1] as CalcAcc)
    // log("calc", total, e)
    return total
}

const ap = lp.map(a => calc(a))

check("A1", _.sum(ap), 52231)

