
import _ from 'lodash'
import * as P from './parser'
import { check } from 'aoc-util'

const input = await P.data.input()

const parts: P.PartNumber[][] = _.map(input, e => _.filter(e, P.isPartNumber) as P.PartNumber[])
const symbols: P.Symbol[][] = _.map(input, e => _.filter(e, P.isSymbol) as P.Symbol[])

function partOverlapsSymbol(p: P.PartNumber, s: P.Symbol): Boolean {
    return s.position >= p.begin-1 && s.position <= p.end+1
}

function hasSymbol(p: P.PartNumber, row: number): Boolean {
    for (let r = Math.max(row-1, 0); r <= Math.min(row+1, symbols.length-1); r++) {
        if (_.some(symbols[r], (s: P.Symbol) => partOverlapsSymbol(p, s))) return true
    }
    return false
}

const symbolParts = _.map(parts, (rowParts, row) => _.filter(rowParts, p => hasSymbol(p, row)))

check("A1", _.chain(symbolParts).flatten().map((p: P.PartNumber) => p.part).sum().value(), 525119)

const gears: P.Symbol[][] = _.map(symbols, e => _.filter(e, s => s.symbol == '*') as P.Symbol[])

function gearRatio(s: P.Symbol, row: number): Number {
    const gearParts: P.PartNumber[][] = parts.slice(Math.max(row-1, 0), Math.min(row+2, symbols.length))
    const symbolGearParts: P.PartNumber[][] = gearParts.map(rowParts => _.filter(rowParts, p => partOverlapsSymbol(p, s))) as P.PartNumber[][]
    const flatParts: P.PartNumber[] = _.flatten(symbolGearParts)
    if (flatParts.length != 2) return 0
    return flatParts[0].part * flatParts[1].part
}

const gearRatios = _.map(gears, (rowGears, row) => _.map(rowGears, g => gearRatio(g, row)))

check("A2", _.chain(gearRatios).flatten().sum().value(),76504829)
