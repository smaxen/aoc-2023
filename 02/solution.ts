
import { check } from 'aoc-util';
import _ from 'lodash';
import { data, Input } from './parser'

const input: Input = await data.input()

type Handful = {
    red?: number,
    green?: number,
    blue?: number
}

type GameHandfuls = {
    game: number, 
    handfuls: Handful[]
}

const gameHandfuls: GameHandfuls[] = input.map(([i, h]) => {
    return {
        game: i, 
        handfuls: h.map(m => {return {red: m.get("red"), green: m.get("green"), blue: m.get("blue")} as Handful})
    }
})

type GameEvidence = {
    game: number, 
    evidence: Evidence
}

type Evidence = {
    red: number,
    green: number,
    blue: number
}

function combine(e1: Evidence, e2: Handful): Evidence {
    return {red: Math.max(e1.red,e2.red??0), green: Math.max(e1.green,e2.green??0), blue: Math.max(e1.blue,e2.blue??0)}
}

const emptyEvidence: Evidence = {red: 0, green: 0, blue: 0}

function convert(h: GameHandfuls): GameEvidence {

    return {
        game: h.game,
        evidence: _.reduce(h.handfuls, combine, emptyEvidence),
    }
}

const games = _.map(gameHandfuls, convert)

const allowed = _.filter(games, g => g.evidence.red <= 12 && g.evidence.green <= 13 && g.evidence.blue <= 14)

const power = _.map(games, g => g.evidence.red * g.evidence.green * g.evidence.blue)

check("A1", _.sum(allowed.map(a => a.game)), 2447)
check("A2", _.sum(power), 56322)

