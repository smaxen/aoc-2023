
import _, { Dictionary, identity } from 'lodash'
import {data, Input} from './parser'
import { check, log } from 'aoc-util'

const [[...path], places] = await data.input()

const map = new Map<string, [string, string]>(places.map(([s, l, r]) => [s, [l, r]]))

function nav1(place: string, step: number): number {
    if (place === "ZZZ") return step
    const [l, r] = map.get(place)!
    return nav1(path[step % path.length] === "L" ? l : r, step+1)
}

check("A1", nav1("AAA", 0), 22411)

// This would take a long time to reach 11188774513823
function nav(places: string[], step: number): number {
    if (_.every(places, p => p[2] === "Z")) return step
    const isL = (path[step % path.length] === "L") 
    const next = places.map(p => {
        const [l, r] = map.get(p)!       
        return isL ? l : r
    })
    return nav(next, step+1)
}


function navL(ex: string) {
    function go(place: string, step: number) {
        if (place[2] === "Z" && step > 0) return [ place, step % path.length, step, step / path.length ]
        const [l, r] = map.get(place)!
        return go(path[step % path.length] === "L" ? l : r, step+1)
    }
    return go(ex, 0)
}

/*

  _.chain([...map.keys()]).filter(k => k[2] === "A").map(k => [k, navL(k)]).value()
  [ "XVA", [ "QXZ", 0, 16271, 53 ] ], 
  [ "BJA", [ "FCZ", 0, 18113, 59 ] ], 
  [ "GGA", [ "GSZ", 0, 24253, 79 ] ], 
  [ "DXA", [ "GHZ", 0, 13201, 43 ] ], 
  [ "LTA", [ "RPZ", 0, 14429, 47 ] ], 
  [ "AAA", [ "ZZZ", 0, 22411, 73 ] ],

  _.chain([...map.keys()]).filter(k => k[2] === "Z").map(k => [k, navL(k)]).value()
  [ "QXZ", [ "QXZ", 0, 16271, 53 ] ],
  [ "FCZ", [ "FCZ", 0, 18113, 59 ] ], 
  [ "GSZ", [ "GSZ", 0, 24253, 79 ] ], 
  [ "GHZ", [ "GHZ", 0, 13201, 43 ] ], 
  [ "RPZ", [ "RPZ", 0, 14429, 47 ] ], 
  [ "ZZZ", [ "ZZZ", 0, 22411, 73 ] ], 

  All number map to their first Z and then all subsequent Zs in the same number of steps. Dividing by path.length gives
  a set of prime numbers. The first collision will then be the product of the primes multiplied by path.length
  
*/

check("A2", 43*47*53*59*73*79*path.length, 11188774513823)


