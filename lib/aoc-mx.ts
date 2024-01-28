
import _ from 'lodash';
import { Point, log } from 'aoc-util';

export function mxLog<T>(m: T[][], name: string = "") {
    log(`===${name}===`)
    m.forEach(l => log(l.join(" ")))
}

export function mxEmpty<T>(lines: number, cols: number, t: T): T[][] {
    return _.fill(Array(lines), 0).map(z => _.fill(Array(cols), t))
}

export function mxExpand<T>(m: T[][]): [number, number, T][] {
    return _.range(0, m.length).flatMap(l => (m[l].map((t, c) => [l, c, t] as [number, number, T])))
}

export function mxLC(lines: number, cols: number, predicate: (l: number, c: number) => boolean): [number, number] {
    var found = false
    var l = 0
    var c = 0
    while (!found && l < lines) {
        c=0
        while (!found && c < cols) {
            found = predicate(l, c)
            c = c+1
        }
        l = l+1
    }
    return found ? [l-1, c-1] : [-1, -1]
}


export function mxFind<T>(m: T[][], predicate: (t: T) => boolean): [number, number, T]|undefined {
    
    var t = undefined
    var cols = m[0].length
    var found = false
    var l = 0
    var c = 0
    while (!found && l < m.length) {
        c=0
        while (!found && c < cols) {
            t = m[l][c]
            found = predicate(t)
            c = c+1
        }
        l = l+1
    }

    return found ? [l-1, c-1, t!] : undefined
}

export function mxTR<T>(s: T[][]): T[][] {
    const rows = s.length
    const cols = s[0].length
    const t = _.fill(Array(cols), 0).map(z => Array(rows))
    _.range(rows).forEach(r => {
        _.range(cols).forEach(c => {
            t[c][r]=s[r][c]
        })
    })
    return t
}

export function mxR90<T>(s: T[][]): T[][] {
    const rows = s.length
    const cols = s[0].length
    const t = _.fill(Array(cols), 0).map(z => Array(rows))
    _.range(rows).forEach(r => {
        _.range(cols).forEach(c => {
            t[c][rows-r-1]=s[r][c]
        })
    })
    return t
}


export function mxR270<T>(i: T[][]): T[][] {
    return mxR90(mxR90(mxR90(i)))
}

export function mxInBounds<T>(i: T[][], p: Point): boolean {
    const [r,c] = p
    return !(r < 0 || c <0 || r >= i.length || c >= i[0].length)
}