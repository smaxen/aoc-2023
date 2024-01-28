
import _, { slice } from 'lodash'
import {Input, data} from './parser'
import { check, Point, ll, log } from 'aoc-util'
import * as mx from 'aoc-mx'

const input: Input = (await data.input())
// mx.mxLog(input)

const S = mx.mxFind(input, c => c === "S")!
const start: Point = [S[0], S[1]]

const pk = ([l,c]: Point) => `${l},${c}`

const seen = new Set<string>()

function next([l,c]: Point) {
    return ([[l+1,c],[l-1,c],[l,c+1],[l,c-1]] as Point[])
        .filter(p => mx.mxInBounds(input, p))
        .filter(([l,c]) => input[l][c] === ".")
}

const nsp: Point[][] = []

var step = 0
nsp [step] = [start]

const total=64

while(step < total) {    
    const newPoints =  new Map(nsp[step].flatMap(next).filter(p => !seen.has(pk(p))).map(p => [pk(p), p]))
    nsp[step].forEach(p => seen.add(pk(p)))
    step++
    nsp[step] = [...newPoints.values()]
}

// ll(nsp, "nsp")

const mod = total%2
const result = _.range(0, total+1).filter(i => (i%2)===mod).map(i => nsp[i].length)

check("A1", _.sum(result), 3646)
