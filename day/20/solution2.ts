
import _, { slice } from 'lodash'
import {Input, Prefix, data} from './parser'
import { check, ll, log } from 'aoc-util'

const iModules: Input = (await data.input())
// ll(iModules)

const L = "L"
const H = "H"
type HL = "H"|"L"

type Module = {  name: string, prefix: Prefix, value: HL, input: Map<string, HL>, output: string[] }
var state = new Map<string, Module>
function init() {
    state = new Map<string, Module>(iModules.map(([p, m, d]) => [m, ({
        name: m, 
        prefix: p, 
        value: (p === "&") ? H : L, 
        input: new Map(_.filter(iModules, ([_p, _m, _d]) => (_.findIndex(_d, n => n === m) !== -1)).map(([_p, _m, _d]) => [_m, L])), 
        output: d,
    } as Module)]))
}

type Event = {from: string, to: string, hl: HL}
const events: Event[] = []

function send(m: Module) {
    m.output.forEach(to => {
        const e = {from: m.name, to: to, hl: m.value}
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

function proc(watch: Module): boolean {
    var seen = false
    while (!_.isEmpty(events)) {
        const e = events.shift()!
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
        if (watch.value === H) seen = true
    }
    return seen
}

const val = (t: string) => state.get(t)?.value

const pdTvn = [ "pd", "jp", "mx", "cl", "hm", "qb", "bf", "vx", "ns", "pn", "cb", "tk", "pr", "vn"]
const rgTdr = [ "rg", "vq", "bs", "sc", "mv", "gl", "kf", "dx", "ts", "ng", "lh", "dl", "qs", "dr" ]
const ktTln = [ "kt", "mt", "zp", "rc", "hj", "vc", "hf", "nm", "dh", "mc", "lv", "tg", "jv", "ln"]
const xvTzx = [ "xv", "nd", "dg", "tm", "mh", "mk", "pb", "mf", "gv", "km", "tp", "pf", "jm", "zx"]

const genKey = (m: string[]) => m.map(t => `${t}:${val(t)}`).join("-")

function analyse(path: string[]): number {
    const seen = new Set<String>()
    init()
    var i = 0
    const h = state.get(_.head(path)!)!
    const t = state.get(_.last(path)!)!
    var key = genKey(path)
    while (!seen.has(key)) {
        events.push({from: "broadcaster", to: h.name, hl: L})
        const seenHigh = proc(t)    
        // if (i>0 && seenHigh) log(i, key, seenHigh)
        seen.add(key)
        key = genKey(path)
        i++
    }
    // log("cycle size", i-1)  // Don't include first one
    return i-1
} 

const result = analyse(pdTvn) * analyse(rgTdr) * analyse(ktTln) * analyse(xvTzx)

check("A2", result, 243221023462303)
