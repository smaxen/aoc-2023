
import _, { slice } from 'lodash'
import {Input, data} from './parser'
import { check, Point, ll, log } from 'aoc-util'
import * as mx from 'aoc-mx'

const input: Input = (await data.input())
const side = input.length

// mx.mxLog(input)
const S = mx.mxFind(input, c => c === "S")!
input[S[0]][S[1]]="."

const start: Point = [S[0], S[1]]
const pk = ([l,c]: Point) => `${l},${c}`
const mSide = (i: number) => (side + i % side) % side

function next([l,c]: Point) {
    return ([[l+1,c],[l-1,c],[l,c+1],[l,c-1]] as Point[])
        .filter(([l,c]) => input[mSide(l)][mSide(c)] === ".")
}

const fEven = 7388
const fOdd = 7424

function run(total: number, firstPoint: Point) {

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

    const mod = total%2
    // log("nsp", nsp.length, mod)
    // log(_.range(0, total+1).filter(i => (i%2)===mod))

    const mPoints = _.range(0, total+1).filter(i => (i%2)===mod).flatMap(i => nsp[i])
    // log("mp", mPoints)

    log("2a", side, "steps:", total, "points:", mPoints.length)

    const gSide = Math.ceil(total/side)+1

    // log("side", side, fEven, fOdd)

    const sPop = (i: number) => {switch(i) {
        case fEven: return "Even"
        case fOdd: return "Odd"
        default: return `Pop=${i}`
    }}

    // log(mPoints)

    _.range(-gSide, gSide+1).forEach(l => {
        _.range(-gSide, gSide+1).forEach(c => {
            const [lf, cf] = [l*side, c*side]
            const [lt, ct] = [lf+side, cf+side]
            const g = mPoints.filter(([l,c]) => l >= lf && l <lt && c >= cf && c <ct)
            if (!_.isEmpty(g)) {
                log(l,c, "g",lf,"l",lt,",",cf,"c",ct, sPop(g.length), (g.length<10) ? g.join(" ") : "")
            }
        })
    })

}

// Solution 2 answer for small step numbers
run(100, start)

