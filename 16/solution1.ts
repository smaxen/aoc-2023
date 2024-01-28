
import _ from 'lodash'
import {Input, data} from './parser'
import { check, ll, log } from 'aoc-util'

const input = await data.input()

// lm(input)

const energised = _.fill(Array(input.length), 0).map(z => _.fill(Array(input[0].length), "."))

const visited: Set<string> = new Set()

enum Direction {
    Up = "U",
    Down = "D",
    Left = "L",
    Right = "R",
}

type Beam = [number, number, Direction]

function energiseC(next: Beam[]) {
    if(!_.isEmpty(next)) energise(next[0], _.tail(next)!)
}

function horizontal(d: Direction): boolean {
    switch(d) {
        case Direction.Up:    return false
        case Direction.Down:  return false
        case Direction.Left:  return true
        case Direction.Right: return true
    }
}

const oob = (r: number, c: number) => (r < 0 || c < 0 || r >= input.length || c >= input[0].length)

function energise(head: Beam, next: Beam[]): void {
    const [r, c, d] = head
    const key = `${r}-${c}-${d}`
    if (visited.has(key) || oob(r, c)) {
        energiseC(next)
    } else {
        visited.add(key)
        energised[r][c] = "#"
        const hv = horizontal(d) ? "H" : "V"
        switch(`${input[r][c]}${hv}`) {
            case "|H": 
                return energiseC(_.concat([[r, c, Direction.Up], [r, c, Direction.Down]], next)) 
            case "-V": 
                return energiseC(_.concat([[r, c, Direction.Left], [r, c, Direction.Right]], next))
            default:
                return energise(move(head, input[r][c]), next)
        }
    } 
}

function move([r, c, _d]: Beam, tile: string): Beam {
    const d = newDir(_d, tile)
    switch (d) {
        case Direction.Up:    return [r-1, c, d]
        case Direction.Down:  return [r+1, c, d]
        case Direction.Left:  return [r, c-1, d]
        case Direction.Right: return [r, c+1, d]
    }
}

function newDir(d: Direction, tile: string): Direction {
     switch(d) {
        case Direction.Up:    
            switch(tile) {
                case "\\": return Direction.Left
                case "/":  return Direction.Right
                default: return d
            }
        case Direction.Down:  
            switch(tile) {
                case "\\": return Direction.Right
                case "/":  return Direction.Left
                default: return d
            }
        case Direction.Left:  
            switch(tile) {
                case "\\": return Direction.Up
                case "/":  return Direction.Down
                default: return d
            }
        case Direction.Right: 
            switch(tile) {
                case "\\": return Direction.Down
                case "/":  return Direction.Up
                default: return d
            }
    }
}

energise([0, 0, Direction.Right], [])

check("A1", _.sum(energised.map(l => l.filter(c => c === "#").length)), 8098)


