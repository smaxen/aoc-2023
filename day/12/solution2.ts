
import _ from 'lodash'
import {Input, data} from './parser'
import { check, log } from 'aoc-util'

const input = await data.input()

// operational, damaged, unknown

function combos(springs: string[], damaged: number[]): number {

    const cache = new Map<string, number>([])

    function go(damagedBuffer: number, sPos: number, dPos: number) {
        if (damagedBuffer !== 0) {
            return ncGo(damagedBuffer, sPos, dPos)
        } else {
            const key=`${sPos}:${dPos}`
            if (cache.has(key)) {
                return cache.get(key)!
            } else {
                const r = ncGo(0, sPos, dPos)
                cache.set(key, r)
                return r
            }
        }
    }

    function ncGo(damagedBuffer: number, sPos: number, dPos: number): number {
        if (springs.length === sPos) {
            switch (damaged.length-dPos) {
                case 0: return (damagedBuffer === 0) ? 1 : 0
                case 1: return (damagedBuffer === damaged[dPos]) ? 1 : 0
                default: return 0
            }
        }
        const tail = sPos+1
        if (damagedBuffer > 0) {
            if (damaged.length === dPos) return 0
            if (damaged[dPos] == damagedBuffer) {
                if (springs[sPos] === "#") return 0
                return go(0, tail, dPos+1)
            }
            if (springs[sPos] === '.') return 0
            return go(damagedBuffer+1, tail, dPos)    
        }
        switch(springs[sPos]) {
            case '#': return go(1, tail, dPos)
            case '.': return go(0, tail, dPos)
            case '?': return go(0, tail, dPos) + go(1, tail, dPos)
            default: throw "Unexpected"
        }
    }
    return go(0,0,0)    
}

// log('A1', _.sum(input.map(([s, d]) => combos([...s], d))), 7361)

const r2 = input.map(([s, d]) => {
    const s2 = [s,s,s,s,s].join("?")
    const d2 = _.concat(d,d,d,d,d)
    return combos([... s2], d2)
})

check('A2', _.sum(r2), 83317216247365)
