
import _ from 'lodash'
import {Input, P3, data} from './parser'
import { ll, log, check } from 'aoc-util'
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
const groups =  new Map<number, P3[]>(groupsInput)

const locationsInput: [P3, number][] = groupsInput.flatMap(([g, p]) => p.map(p3 => [p3, g]))
const locations = new Map<P3, number>(locationsInput, key)

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

function useGravity(): number {
    const falling = findFalling()
    falling.forEach(moveDown)
    return falling.length
}

while(useGravity() > 0) {}

// ll([...groups], "groups")

const groupsAbove = (g: number) => [...new Set(groups.get(g)!.map(p3Up).filter(p => locations.has(p)).map(p => locations.get(p)!).filter(ng => ng !== g))]
const groupsBelow = (g: number) => [...new Set(groups.get(g)!.map(p3Down).filter(p => locations.has(p)).map(p => locations.get(p)!).filter(ng => ng !== g))]

function canBeDisintegrated(g: number): boolean {
    return groupsAbove(g).every(ga => groupsBelow(ga).length >= 2)
}

// ll([...groups.keys()].map(g => [g, groupsAbove(g), groupsBelow(g)]))

const results = [...groups.keys()].filter(canBeDisintegrated)

check("A1", results.length, 428)

