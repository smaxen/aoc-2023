
import _ from 'lodash'
import {Input, data} from './parser'
import { check, log } from 'aoc-util'

const input = await data.input()

function tr(s: Input): Input {
    const rows = s.length
    const cols = s[0].length
    const t: Input = _.fill(Array(cols), 0).map(z => Array(rows))
    _.range(rows).forEach(r => {
        _.range(cols).forEach(c => {
            t[c][r]=s[r][c]
        })
    })
    return t
}

function expandIdx(s: Input): number[] {
    return s.flatMap((r, i) => r.every(c => c === ".") ? [i] : [])
}

const expL = expandIdx(input)
const expX = expandIdx(tr(input))

type Lx = [number, number]

const galaxies: Lx[] =  input.flatMap((r, l) => {
    return r.flatMap((c, x) => c === "#" ? [[l, x] as Lx] : [])
})

const M = 1000000-1
const distL = (i: number) => M * expL.filter(j => j < i).length + i
const distX = (i: number) => M * expX.filter(j => j < i).length + i

const dist = ([l1, x1]: Lx, [l2, x2]: Lx) => Math.abs(distL(l1)-distL(l2)) + Math.abs(distX(x1)-distX(x2))

const distances = galaxies.flatMap((g1) => {
    return galaxies.map(g2 => {
        return dist(g1, g2)
    })
})

check("A2", _.sum(distances)/2, 842645913794)

