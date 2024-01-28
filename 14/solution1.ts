
import _ from 'lodash'
import {Input, data} from './parser'
import { check, log, } from 'aoc-util'
import * as mx from 'aoc-mx'

type Line = string[]

const input = await data.input()

function north(l: Line): Line {
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

function load(l: Line): number {
    return _.chain(l).reverse().map((c, i) => ((c === "O") ? (i+1) : 0)).sum().value()
}

const ni: number[] = mx.mxTR(input).map(north).map(load)

check("A1", _.sum(ni), 108792)

