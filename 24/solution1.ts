
import _ from 'lodash'
import {Input, P3, data} from './parser'
import { Point, check, ll, log } from 'aoc-util'
import { Set, Map } from 'hash-set-map'
import * as mx from './matrix'

const useSample = false
const [input, minV, maxV] = useSample ? [await data.sample1(), 7, 27] : [await data.input(), 200000000000000, 400000000000000]

// mx.mxLog(input)

const pairs: [number, number][] = _.range(input.length).flatMap(h1 => {
    return _.range(input.length).filter(h2 => h2 > h1).map(h2 => [h1, h2] as [number, number])
})

function intersect(h1: number, h2: number): [P3, boolean] {

    const [[px1, py1, pz1], [vx1, vy1, vz1]] = input[h1]
    const [[px2, py2, pz2], [vx2, vy2, vz2]] = input[h2]

    const g1 = vy1/vx1
    const g2 = vy2/vx2

    const x = (py2 - py1 + px1*g1 - px2*g2) / (g1 - g2)
    const y = py1 + (x - px1) * g1

    const future = Math.sign(x - px1) === Math.sign(vx1) && Math.sign(x - px2) === Math.sign(vx2)

    // log("int", h1, [px1, py1], h2, [px2, py2], [x,y], future)

    return [[x,y,0], future]
}

function converging(h1: number, h2: number): boolean {
    const [p1, [x1, y1, z1]] = input[h1]
    const [p2, [x2, y2, z2]] = input[h2]
    return (new Set([x1/x2, y1/y2]).size) > 1
}

const result = pairs
    .filter(([h1,h2]) => converging(h1, h2))
    .map(([h1,h2]) => intersect(h1, h2))
    .filter(([[x, y, z], f]) => f && x >= minV && x <= maxV && y >= minV && y <= maxV )
    .map(([i, f]) => i)
    
    
// ll(result, "result")    

check("A1", result.length, 11995)

