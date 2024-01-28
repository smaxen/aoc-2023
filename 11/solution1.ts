
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

function expand(s: Input): Input {
    return s.flatMap(r => r.every(c => c === ".") ? [r, r] : [r])
}

const expanded = tr(expand(tr(expand(input))))

type Lx = [number, number]

const galaxies: Lx[] =  expanded.flatMap((r, l) => {
    return r.flatMap((c, x) => c === "#" ? [[l, x] as Lx] : [])
})

const dist = ([l1, x1]: Lx, [l2, x2]: Lx) => Math.abs(l1-l2) + Math.abs(x1-x2)

const distances = galaxies.flatMap((g1) => {
    return galaxies.map(g2 => {
        return dist(g1, g2)
    })
})

check("A1", _.sum(distances)/2, 9599070)

