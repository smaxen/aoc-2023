
import _ from 'lodash'
import {Input, data} from './parser'
import { check } from 'aoc-util'
import * as mx from 'aoc-mx'

type Line = string[]

const input = await data.input()

function rollLine(l: Line): Line {
    const z: [Line, Line] = [[],[]]
    function go([n, r]: [Line, Line], c: string): [Line, Line] {
        switch(c) {
            case ".": return [n ,_.concat(r, [c])]
            case "#": return [_.concat(n, r, [c]) ,[]]
            case "O": return [_.concat(n, [c]), r]
        }
        throw "ux"
    }
    const [h, t] = _.reduce(l, go, z)
    return _.concat(h, t)
}

const roll = (i: Input) => i.map(l => rollLine(l))

const load = (i: Input) => _.sum(i.map(loadLine))

function loadLine(l: Line): number {
    return _.chain(l).clone().reverse().map((c, i) => ((c === "O") ? (i+1) : 0)).sum().value()
}

function cycle(i: Input): Input {
    const tR = (j: Input) => mx.mxR90(roll(j))
    return tR(tR(tR(tR(i))))
}

const start = mx.mxR270(input)

var found = -1
var i = 0
const seen=new Map<string, number>()
const boards=new Map<number, Input>()
var board = start
while (found < 0) {
    const key: string = board.flatMap(l => l.filter(s => s !== "#")).join("")
    load(board)
    if (!seen.has(key)) {
        seen.set(key, i)
        boards.set(i, board)
        board = cycle(board)
        i=i+1
    } else {
        found = seen.get(key)!
    }
}

const loops = 1000000000
const idx = found + (loops - found) % (i - found)
const finalBoard = boards.get(idx)!

check("A2", load(finalBoard), 99118)

