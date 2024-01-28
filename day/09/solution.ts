
import _, { Dictionary, identity, reduce } from 'lodash'
import {data, Input} from './parser'
import { check, log } from 'aoc-util'

const input = await data.input()

function zero1(l: number[], depth: number[]): [number, number[]] {
    const next = _.zip(_.dropRight(l, 1), _.tail(l)).map(([a, b]) => (b??0) - (a??0))
    if (_.every(next, n => n === 0)) return [l[0], depth]
    return zero1(next, _.concat([_.last(l)!], depth))
}

function predict1(l: number[]) {
    const [c, d] = zero1(l, [])
    const p = _.reduce(d, (a, b) => a+b, c)
    return p
}

check("A1", _.sum(input.map(predict1)),1882395907)

function zero(l: number[], depth: number[]): [number, number[]] {
    const next = _.zip(_.dropRight(l, 1), _.tail(l)).map(([a, b]) => (b??0) - (a??0))
    if (_.every(next, n => n === 0)) return [l[0], depth]
    return zero(next, _.concat([l[0]], depth))
}

function predict(l: number[]) {
    const [c, d] = zero(l, [])
    const p = _.reduce(d, (acc, x) => x-acc, c)
    return p
}

check("A2", _.sum(input.map(predict)),1005)
