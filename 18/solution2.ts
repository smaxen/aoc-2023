
import _, { forEach } from 'lodash'
import {Edge, Input, data} from './parser'
import { check, Direction, Point, a90, advanceN, c90, endN, ll, log, opposite, window } from 'aoc-util'

const input: Edge[] = (await data.input())
// ll(input, "input")

type UDI = "U" | "D" | "I"

type Trench = {
    dir: Direction,
    from: Point,    // Exclusive
    len: number, 
    to: Point,
}

const fp: Trench[] = _.reduce(input, (acc, [_d, _n, color]) => {
    const dNum: string = _.last([... color])!
    var d: Direction
    switch(dNum) {
        case '0': d=Direction.Right;break;
        case '1': d=Direction.Down;break;
        case '2': d=Direction.Left;break;
        case '3': d=Direction.Up;break;
        default: throw "ex"
    }
    // d = _d 
    const n = parseInt(_.dropRight(color, 1).join(""), 16) // _n
    const p: Point = _.isEmpty(acc) ? [0,0] : _.last(acc)!.to
    const t: Trench = {from: p, to: endN(p, d, n), len: n, dir: d} 
    return [...acc, t]
}, [] as Trench[])

// ll(fp)

const yVal = fp.map(t => t.from[0])
const yMin = _.min(yVal)!
const yMax = _.max(yVal)!
// log("yRng", yMin, yMax)

function between(s: number, m: number, t: number): boolean {
    if (m === s || m === t) return true
    if (m > s) {
        return t > m
    } else {
        return t < m
    }
}

type CalcAcc = [[number, Direction, boolean], number]
function calc(st: Trench[]): number {
    const h = _.head(st)!
    if (h.dir !== Direction.Up && h.dir !== Direction.Down) {
        // ll(st, "st")
        throw "ux1"
    }
    const [wip, total] = _.reduce(_.tail(st), ([[oc, od, closing], area], t) => {
        const c = Math.min(t.from[1], t.to[1])
        if (t.dir === od) {
            return [[c, od, closing], area + 1 ] as CalcAcc
        } else if (t.dir === Direction.Right || t.dir === Direction.Left) {
            const cx = Math.max(t.from[1], t.to[1])
            return [[cx-1, od, closing], area + t.len-1 ] as CalcAcc
        } else if (!closing) {
            return [[c, t.dir, true], area + c - oc ] as CalcAcc
        } else {
            return [[c, t.dir, false], area + 1 ] as CalcAcc
        }
    }, [[h.from[1], h.dir, false], 1] as CalcAcc)
    // log("tr", total, st)
    return total
}

const yArea = _.range(yMin, yMax+1).map(y => {
    // if (y%100000 === 0) log("y", y, yMax)
    const yInc = _.filter(fp, t => between(t.from[0], y, t.to[0]))
    const ySortX = yInc.sort((a, b) => {
        const aMin = Math.min(a.from[1], a.to[1])
        const bMin = Math.min(b.from[1], b.to[1])
        if (aMin !== bMin) return aMin-bMin
        const aMax = Math.max(a.from[1], a.to[1])
        const bMax = Math.max(b.from[1], b.to[1])
        return aMax-bMax
    })

    return calc(ySortX)
})

// ll(yArea, "yArea")

// yRng -4262950 10820058
check("A2", _.sum(yArea), 57196493937398) // takes around 30s

