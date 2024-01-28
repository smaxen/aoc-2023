
import _ from 'lodash'
import {Input, P3, data} from './parser'
import { Point, ll, log, check } from 'aoc-util'
import { Set, Map } from 'hash-set-map'
import * as mx from 'aoc-mx'

const input: Input = (await data.input())
// mx.mxLog(input)

const side = input.length

const nwn = ([l,c]: Point) =>  ([[l-1,c],[l+1,c],[l,c-1],[l,c+1]] as Point[])
    .filter(p => mx.mxInBounds(input, p))
    .filter(([l,c]) => input[l][c] !== "#")        


const trueNexus: Point[] = mx.mxExpand(input).filter(([l,c,t]) => {
    if (t === "#") return false
    const io = nwn([l,c])      
    return io.length > 2
}).map(([l,c,t]) => [l,c] as Point)

const start: Point = [0, input[0].findIndex(p => p === ".")]!
const finish: Point = [side-1, input[side-1].findIndex(p => p === ".")]!

const pKey = ([l,c]: Point) => `${l},${c}`

const nexus = new Set(_.concat([start], trueNexus, [finish]) as Point[], pKey)

// ll(nexus)

function destinations(p: Point): [Point, number][] {
    return nwn(p).flatMap(n => destination(p, n, 1))
}

function destination(p0: Point, p1: Point, steps: number): [Point, number][] {
    if (nexus.has(p1)) return [[p1, steps]]
    switch (input[p1[0]][p1[1]]) {
        case "#": throw "ux"
        case ".": break
        case ">": if (p1[1] < p0[1]) return []; break
        case "v": if (p1[0] < p0[0]) return []; break
    }
    const p2 = nwn(p1).filter(n => !_.isEqual(n, p0))[0]
    return destination(p1, p2, steps+1)
}

const network: Map<Point, [Point, number][]> = new Map([...nexus].map(p => [p, destinations(p)]), pKey)

// ll([...network], "network")

function routes(from: Point, to: Point, visited: Set<Point>, steps: number): number[] {
    if (_.isEqual(from, to)) return [steps]
    const nowVisited = new Set(visited, pKey).add(from)
    return network.get(from)!
        .filter(([np, ns]) => !nowVisited.has(np))
        .flatMap(([np, ns]) => routes(np, to, nowVisited, steps+ns))
}

const result = routes(start, finish, new Set([], pKey), 0)

check("A1", _.max(result)!, 2386)

