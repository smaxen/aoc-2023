
import _ from 'lodash'
import {Input, P3, data} from './parser'
import { check, ll, log } from 'aoc-util'
import { Set, Map } from 'hash-set-map'

const input: Input = (await data.input())
// ll(input)

function expand([[x1,y1,z1], [x2,y2,z2]]: [P3, P3]): P3[] {
    const r = (a1: number, a2: number) => _.range(Math.min(a1, a2), Math.max(a1, a2)+1)
    return r(x1,x2).flatMap(x => 
        r(y1,y2).flatMap(y => 
            r(z1,z2).map(z => 
                [x, y, z] as P3
            )
        )        
    )
}

const key = ([x,y,z]: P3) => `${x},${y},${z}`

const groupsInput: [number, P3[]][] = input.map((p, i) => [i, expand(p)])
var groups =  new Map<number, P3[]>(groupsInput)

const locationsInput: [P3, number][] = groupsInput.flatMap(([g, p]) => p.map(p3 => [p3, g]))
var locations = new Map<P3, number>(locationsInput, key)

// ll([...groups], "groups")
// ll([...locations], "locations")

function spaceBelow([g, pts]: [number, P3[]]): boolean {
    return pts.every(([x, y, z]) => (z !== 1) && (!locations.has([x, y, z-1]) || (locations.get([x, y, z-1]) === g)))
}

const p3Up = ([x, y, z]: P3) => [x, y, z+1] as P3
const p3Down = ([x, y, z]: P3) => [x, y, z-1] as P3

function moveDown([g, pts]: [number, P3[]]) {
    const newPts: P3[] = pts.map(p3Down)
    pts.forEach((p: P3) => locations.delete(p))
    newPts.forEach((p: P3) => locations.set(p, g))
    groups.set(g, newPts)
}

const findFalling = () => _.filter([...groups], spaceBelow)

function useGravity(): number[] {
    const falling: [number, P3[]][] = findFalling()
    falling.forEach(moveDown)
    // return falling.map(f => f[0])
    return falling.map(gp => gp[0])
}

while(useGravity().length > 0) {}

const groupsSnap =  [...groups]
const locationsSnap = [...locations]

function chainReaction(g: number): number {
    groups =  new Map<number, P3[]>(groupsSnap)
    locations = new Map<P3, number>(locationsSnap, key)
    groups.get(g)!.forEach(p => locations.delete(p))
    groups.delete(g)
    var fell = new Set<number>()
    var falling = true
    while(falling) {
        const fg = useGravity()
        fg.forEach(g => fell.add(g))
        falling = fg.length > 0
    }
    return fell.size
}

const results = [...groups.keys()].map(chainReaction)

check("A2", _.sum(results), 35654)  // Takes around 10s

