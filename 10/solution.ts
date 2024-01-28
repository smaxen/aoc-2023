
import _ from 'lodash'
import {data} from './parser'
import { check, log } from 'aoc-util'

const input = await data.input()

type Lx = [number, number]

const sl = input.findIndex(l => l.indexOf("S") >= 0)
const sx = input[sl].indexOf("S")
const S: Lx = [sl, sx]

const maxL = input.length-1
const maxX = input[0].length-1

type Pipe = ("|"| "-"| "L"| "J"| "7"| "F")

enum Direction {
    Up = "U",
    Down = "D",
    Left = "L",
    Right = "R",
}

type Directive = {
    move: Lx,
    next: Map<Pipe, Direction>,
}

const directives: Map<Direction, Directive> = new Map([
    [ Direction.Up,     { move: [-1,0], next: new Map([["|", Direction.Up   ], ["7", Direction.Left ], ["F", Direction.Right]])}],
    [ Direction.Down,   { move: [1,0],  next: new Map([["|", Direction.Down ], ["J", Direction.Left ], ["L", Direction.Right ]])}],
    [ Direction.Left,   { move: [0,-1], next: new Map([["-", Direction.Left ], ["L", Direction.Up ],   ["F", Direction.Down ]])}],
    [ Direction.Right,  { move: [0,1],  next: new Map([["-", Direction.Right], ["J", Direction.Up],    ["7", Direction.Down]])} ],
])

const pipe = ([l, x]: Lx) => input[l][x]

const add = ([al, ax]: Lx, [bl, bx]: Lx) => [al+bl, ax+bx] as Lx

const offBoard = ([l, x]: Lx) => (l < 0 || l > maxL || x < 0 || x > maxX)

function go(pos: Lx, direction: Direction, steps: number) {
    const directive = directives.get(direction)!
    const nextPos: Lx = add(pos, directive.move)
    if (offBoard(nextPos)) return undefined
    const tile = pipe(nextPos)
    if (tile === "S") return steps
    const nextDirection = directive.next.get(tile as Pipe)
    if (!nextDirection) return undefined
    return go(nextPos, nextDirection, steps+1)
}

const [s1, s2] = [ Direction.Up, Direction.Down, Direction.Left, Direction.Right ].map(d => go(S, d, 1)).filter(t => !!t)
if (!_.isEqual(s1, s2)) throw "Unequal answers"

check("A1", s1!/2, 6842)

function path(pos: Lx, direction: Direction, steps: Lx[]) {
    const directive = directives.get(direction)!
    const nextPos: Lx = add(pos, directive.move)
    if (offBoard(nextPos)) return undefined
    const tile = pipe(nextPos)
    const nextSteps = _.concat(steps, [nextPos])
    if (tile === "S") return nextSteps
    const nextDirection = directive.next.get(tile as Pipe)
    if (!nextDirection) return undefined
    return path(nextPos, nextDirection, nextSteps)
}

const [_c, _ac] = [ Direction.Up, Direction.Down, Direction.Left, Direction.Right ].map(d => path(S, d, [])).filter(t => !!t)
const [ c, ac ] = [ _c as Lx[], _ac as Lx[]]
if (!_.isEqual(_.dropRight(c, 1), _.chain(ac).dropRight().reverse().value())) throw "Unequal answers"

const sPrePost = [c[0], c[c.length-2]].map(([l, x]) => [l-sl, x-sx])

const fillPipe: [Lx[], string][] = [
    [[[ 0, -1 ], [0, 1]],  "-"],
    [[[ 0, -1 ], [-1, 0]],  "J"],
    [[[ 0, -1 ], [1, 0]],  "7"],
    [[[ -1, 0 ], [1, 0]],  "|"],
    [[[ -1, 0 ], [0, 1]],  "L"],
    [[[ 1, 0 ], [0, 1]],  "F"],
]

const sTile = fillPipe.find(([set, tile]) => sPrePost.every(p => _.find(set, s => _.isEqual(p, s))))![1]

type SpaceState = { open?: {tile: Pipe, x: number},  count: number, closing?: Pipe}

function applyTile(acc: SpaceState, [l,x]: Lx): SpaceState {
    const _tile = input[l][x]
    const tile = (_tile === "S" ? sTile : _tile) as Pipe
    if (tile === "-") return acc
    if (!acc.open  && !acc.closing) return { count: acc.count, open: {tile, x}} 
    if (acc.open) {
        // Open
        switch (`${acc.open.tile}${tile}`) {
            case "||": 
                return {count: acc.count + x - acc.open.x - 1}
            case "|L":
            case "|F": 
                return {count: acc.count + x - acc.open.x - 1, closing: tile}
            case "LJ":
            case "F7": 
                return {count: acc.count}
            case "L7":
            case "FJ": 
                return {open: {tile: "|", x}, count: acc.count}
            default:
                throw `Unexpected open: ${acc.open.tile}${tile}`
            }    
    } else {
        // Closing
        switch (`${acc.closing}${tile}`) {
            case "LJ":
            case "F7": 
                return {open: {tile: "|", x}, count: acc.count}
            case "L7":
            case "FJ": 
                return {count: acc.count}
            default: 
            throw `Unexpected closing: ${acc.closing}${tile}`
        } 
    }    
}

const space = (n: Lx[]) => _.reduce(n, applyTile, {count: 0 }).count

const result = _.chain(c)
    .groupBy(([l, r]) => l)
    .values()
    .map(fl => _.chain(fl).sortBy(([l, r]) => r).value())
    .map(a => space(a))
    .sum()
    .value()

check("A2", result, 393)

