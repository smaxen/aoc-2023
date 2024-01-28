
import _ from 'lodash'
import {Input, data} from './parser'
import { check, log, tr } from 'aoc-util'

function hash(s: string): number {
    return _.reduce([...s], (h, c) => (17*(h+c.charCodeAt(0)))%256 , 0)
}

const input = await data.input()

const boxes: Map<number, [string, number][]> = new Map()

function update(i: Input) {
    const boxNo = hash(i.name)    
    var box: [string, number][] = boxes.has(boxNo) ? boxes.get(boxNo)! : []
    if (i.op === "add") {
        const idx = box.findIndex(([l, n]) => l === i.name)
        if (idx >= 0) {
            box[idx][1] = i.value!    
        } else {
            box = _.concat(box, [[i.name, i.value!]])
        }
    } else {
        box = box.filter(([l, n]) => l !== i.name)
    }
    boxes.set(boxNo, box)
}

input.forEach(update)

const a2 = _.flatMap([...boxes], ([boxNo, box]) => _.map(box, ([s, n], i) => (boxNo+1)*(1+i)*n))

check("A2", _.sum(a2), 244981)
