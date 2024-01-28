
import _ from 'lodash'
import {data, Input} from './parser'
import { check } from 'aoc-util'

const input: Input[] = await data.input()

const a1 = _.sum(input.map(([card, winning, guessed]) => {
    const winningGuesses =_.intersection(winning, guessed).length
    return (winningGuesses === 0) ? 0 : Math.pow(2, winningGuesses-1) 
}))

check("A1", a1, 17803)

const cardCopiesMap = new Map(input.map(([card, winning, guessed], idx) => {
    const winningGuesses =_.intersection(winning, guessed).length
    return [idx, _.range(idx+1, idx+winningGuesses+1)]
}))

function count(n: number, toVisit: number[]) {
    if (_.isEmpty(toVisit)) return n
    return count(n+toVisit.length, toVisit.flatMap(i => cardCopiesMap.get(i)!))
}

check("A2", count(0, _.range(0, input.length)), 5554894)
