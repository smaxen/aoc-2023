
import _, { slice } from 'lodash'
import {Input, Prefix, data} from './parser'
import { check, ll, log } from 'aoc-util'

const iModules: Input = (await data.input())
// ll(iModules)

const L = "L"
const H = "H"
type HL = "H"|"L"

type Module = {  name: string, prefix: Prefix, value: HL, input: Map<string, HL>, output: string[] }
const state = new Map<string, Module>(iModules.map(([p, m, d]) => [m, ({
    name: m, 
    prefix: p, 
    value: L, 
    input: new Map(_.filter(iModules, ([_p, _m, _d]) => (_.findIndex(_d, n => n === m) !== -1)).map(([_p, _m, _d]) => [_m, L])), 
    output: d,
} as Module)]))


type Event = {from: string, to: string, hl: HL}
const events: Event[] = []

var hCount = 0
var lCount = 0 
function send(m: Module) {
    (m.value === H) ? hCount+=m.output.length : lCount+=m.output.length
    m.output.forEach(to => {
        const e = {from: m.name, to: to, hl: m.value}
        // log(`push: ${e.from} ${e.hl} ${e.to}`)
        events.push(e)
    })
}

function flip(m: Module, e: Event) {
    if (e.hl === L) {
        m.value = (m.value === H) ? L : H
        send(m)
    }
}

function con(m: Module, e: Event) {
    m.input.set(e.from, e.hl)
    m.value = (_.every([...m.input.values()], v => v === H) ? L : H)
    send(m)
}

function proc() {
    while (!_.isEmpty(events)) {
        const e = events.shift()!
        // log("proc", e)
        if (state.has(e.to)) {
            const m = state.get(e.to)!
            switch (m.prefix) {
                case "%":
                    flip(m, e)
                    break;
                case "&":
                    con(m, e)
                    break;
                case "": 
                    throw "ux"
            }
        }
    }
}

function push() {
    lCount++
    const broadcast = state.get("broadcaster")!
    send(broadcast)
}

var press=0
while(press < 1000) {
    push()
    proc()
    press++    
}

// log("h", hCount, "l", lCount, "2750/4250")
check("A1", hCount * lCount, 949764474) 
