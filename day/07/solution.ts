
import _, { Dictionary, identity } from 'lodash'
import {data, Input} from './parser'
import { check, log } from 'aoc-util'

const input: Input = await data.input()

const cards = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"]
const cardScore = new Map(_.map(cards, (c, i) => [c, cards.length-i]))

const jCards = ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J"]
const jCardScore = new Map(_.map(jCards, (c, i) => [c, cards.length-i]))

function combineJ(hand: string[]) {
    const handCounts = new Map(_.chain([...hand]).groupBy().mapValues(v => v.length).entries().value())
    const j: number = handCounts.get("J")??0
    handCounts.delete("J")
    const groups: number[] = _.chain([...handCounts.values()]).sort().reverse().value()
    groups[0] = (groups[0]??0)+j
    return groups
}

type Hand = [string, number[], any, number[], number[], number]
const hands: Hand[] = _.map(input, ([h, s]) => [
    h, 
    _.chain([...h]).groupBy().values().map(g => g.length).sort().reverse().value(),
    combineJ([...h]),
    [...h].map(c => cardScore.get(c)!),
    [...h].map(c => jCardScore.get(c)!),
    s, 
])

function compareA(a: number[], b: number[]): number {
    if (_.isEmpty(a) || _.isEmpty(b)) {
        if (a.length === b.length) return 0
        return (a.length > b.length) ? 1 : -1
    } else {
        if (a[0] === b[0]) return compareA(_.tail(a), _.tail(b))
        return (a[0] > b[0]) ? 1 : -1
    }
}

const compareFn = ([h1,g1,jg1,c1,jc1,d1]: Hand, [h2,g2,jg2,c2,jc2,d2]: Hand): number => {
    const groupResult = compareA(g1, g2)
    if (groupResult !== 0) return groupResult
    return (compareA(c1, c2))
}

hands.sort(compareFn)
check("A1", _.sum(hands.map(([h,g,jg,c,jc,d], i) => (i+1) * d)), 246912307)

const jCompareFn = ([h1,g1,jg1,c1,jc1,d1]: Hand, [h2,g2,jg2,c2,jc2,d2]: Hand): number => {
    const groupResult = compareA(jg1, jg2)
    if (groupResult !== 0) return groupResult
    return (compareA(jc1, jc2))
}

hands.sort(jCompareFn)

check("A2", _.sum(hands.map(([h,g,jg,c,jc,d], i) => (i+1) * d)), 246894760)
