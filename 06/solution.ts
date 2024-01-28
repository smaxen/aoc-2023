
import _ from 'lodash'
import {data, Input} from './parser'
import { check } from 'aoc-util'

const [times, distance]: Input = await data.input()

type TD = [number, number]
const races: TD[] = _.zip(times, distance) as TD[]

function winners([time, distance]: TD): number {
    return _.chain(_.range(1, time)).map(t => t * (time-t)).filter(d => d > distance).size().value()
}

check("A1", _.reduce(races.map(winners), (a, b) => a * b, 1), 211904)

const q2Time = +_.join(times, "")
const q2Distance = +_.join(distance, "")

check("A2", winners([q2Time, q2Distance]), 43364472)
