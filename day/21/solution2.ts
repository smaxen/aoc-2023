import _, { slice } from 'lodash'
import {Input, data} from './parser'
import { check, Point, ll, log } from 'aoc-util'
import * as mx from 'aoc-mx'

const input: Input = (await data.input())
const side = input.length
const S = mx.mxFind(input, c => c === "S")!
input[S[0]][S[1]]="."

const half = (side-1)/2

const centerPoint: Point = [S[0],S[1]]

const topStart: Point = [side-1, half]
const bottomStart: Point = [0, half]
const rightStart: Point = [half,0]
const leftStart: Point = [half,side-1]

const trStart: Point = [side-1, 0]
const tlStart: Point = [side-1, side-1]
const brStart: Point = [0,0]
const blStart: Point = [0,side-1]

const fEven = 7388
const fOdd = 7424

function next([l,c]: Point) {
    return ([[l+1,c],[l-1,c],[l,c+1],[l,c-1]] as Point[])
        .filter(p => mx.mxInBounds(input, p))
        .filter(([l,c]) => input[l][c] === ".")
}

const pk = ([l,c]: Point) => `${l},${c}`

// Note that with zero steps only the start point is populated
function countPlots(firstPoint: Point, total: number): number {

    if (total <= 0) return 0

    const mod = (total+1)%2
    if (total > 2 * side) return mod===0 ? fOdd : fEven

    const seen = new Set<string>()
    const nsp: Point[][] = []
    var step = 0
    nsp [step] = [firstPoint]
    while(step < total) {    
        const newPoints =  new Map(nsp[step].flatMap(next).filter(p => !seen.has(pk(p))).map(p => [pk(p), p]))
        nsp[step].forEach(p => seen.add(pk(p)))
        step++
        nsp[step] = [...newPoints.values()]
    }

    const points = _.range(0, total).filter(i => (i%2)===mod).flatMap(i => nsp[i])

    return points.length

}

function layerPlots(layer: number, total: number): number {
    if (layer === 0) return countPlots(centerPoint, total)
    const orthogonal = _.chain([topStart, bottomStart, rightStart, leftStart]).map(s => countPlots(s, total-((layer-1)*side)-half-1)).sum().value()
    const diagonal = _.chain([trStart, tlStart, brStart, blStart]).map(s => countPlots(s, total-(layer*side)-1)).sum().value()
    return orthogonal+layer*diagonal
}

function count(_total: number): number {
    const total = _total+1  // Adjust as was assume the first step is the start
    var totalCount = 0
    var layerCount = -1
    var layer=0
    while(layerCount !== 0) {
        layerCount = layerPlots(layer, total)
        totalCount += layerCount
        layer++
    }
    return totalCount
}

function test(steps: number, ex: number) {
    const act = count(steps)
    log("test", act, ex, act===ex ? "ok" : "fail")    
}

// Get expected test results from steps.ts

// test(0, 1)
// test(1, 4)
// test(2, 6)
// test(64, 3646)
// test(65, 3759)
// test(66, 3910)
// test(67, 4027)
// test(100, 8867)
// test(131, 15012)
// test(132, 15263)
// test(190, 31230)
// test(197, 33945)
// test(263, 60146)
// test(1000, 865405)
// test(1001, 867386)
check("A2", count(26501365), 606188414811259)
