
import _ from 'lodash'
import {data, Input} from './parser'
import { check } from 'aoc-util'

const input: Input = await data.input()
const [seeds, nameMaps] = input

type DSL = [number, number, number]
type Rng = [number, number]
const mapsArray: DSL[][] = nameMaps.map(([name, map]) => map)

function mapOut(maps: DSL[], n: number): number {
    function go(m: DSL[], a: number): number {
        if (_.isEmpty(m)) return a
        const [dest, src, len] = m[0]
        const x = (n >= src && n < src+len) ? dest + (n-src) : a
        return go(_.tail(m), x)    
    }
    return go(maps, n)
}

function seedLocation(seed: number): number {
    return _.reduce(mapsArray, (acc, m) => {return mapOut(m, acc)}, seed)
}

check("A1", _.chain(seeds).map(seedLocation).min().value(), 196167384)

function rngMapOut(iMaps: DSL[], iUnmapped: Rng[]): Rng[] {

    function go(maps: DSL[], unmapped: Rng[], mapped: Rng[]): Rng[] {
        if (_.isEmpty(maps)) return _.concat(mapped, unmapped)        
        const [dest, src, len] = maps[0]
        function overlap(s: number, f: number): Rng | undefined { 
            const os = Math.max(s, src)
            const of = Math.min(f, src+len)
            return (of > os) ? [os, of] : undefined
        }
        function mappedRegion([s, f]: Rng): Rng[] {
            const o = overlap(s, f)    
            if (!o) return []
            const [os, of] = o
            const shift = dest - src
            return [[os + shift, of + shift]]
        }
        function unMappedRegions([s, f]: Rng): Rng[] {
            const o = overlap(s, f)    
            if (!o) return [[s, f]]
            const [os, of] = o
            return _.filter([[s, os], [of, f]], ([s, f]) => f > s)
        }

        return go(_.tail(maps), unmapped.flatMap(unMappedRegions), _.concat(mapped, unmapped.flatMap(mappedRegion))) 
        
    }
    return go(iMaps, iUnmapped, [])
}

function rngMinSeedLocation(seed: Rng): number {
    const locations = _.reduce(mapsArray, (acc, m) => {return rngMapOut(m, acc)}, [seed])
    return _.chain(locations).map(([s, f]) => s).min().value()
}

check("A2", _.chain(seeds).chunk(2).map(([s, l]) => rngMinSeedLocation([s, s+l])).min().value(), 125742456)
