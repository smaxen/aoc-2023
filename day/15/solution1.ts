
import _ from 'lodash'
import {Input, data} from './parser'
import { check, ll, log } from 'aoc-util'

const input = await data.input()

function hashInput(s: Input): number {
    const hn = hash(s.name)
    const ho = hash(s.op === "add" ? "=" : "-", hn)
    const hv = (s.value === undefined) ? ho : hash(`${s.value}`, ho)
    return hv
}

function hash(s: string, base: number=0): number {
    return _.reduce([...s], (h, c) => (17*(h+c.charCodeAt(0)))%256 , base)
}

// ll(input2.map(s => hash2(s), "h1"))

check("A1", _.sum(input.map(s => hashInput(s))), 516070)
