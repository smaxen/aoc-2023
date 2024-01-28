
import _, { isEmpty } from 'lodash'
import {Input, data} from './parser'
import { ll, log, window } from 'aoc-util'
import { Set } from 'hash-set-map'

const input: Input = await data.input()

function atT(t: number, x: HPV[]): HPV[] {
    return _.chain(x).map(([h,p,v]) => [h,p+t*v,v] as HPV).sortBy(([h,p,v]) => p).value()
}

function collide(x: HPV[], hits: Set<string>): HPV[] {
    return x.filter(([h,p,v]) => !hits.has(h))
}

// mx.mxLog(input)
type HPV = [string, number, number]
const xi: HPV[] = atT(0, input.map(([[px, py, pz], [vx, vy, vz]], h) => [`${h}`.padStart(3, '0'), px, vx]))
const yi: HPV[] = atT(0, input.map(([[px, py, pz], [vx, vy, vz]], h) => [`${h}`.padStart(3, '0'), py, vy]))
const zi: HPV[] = atT(0, input.map(([[px, py, pz], [vx, vy, vz]], h) => [`${h}`.padStart(3, '0'), pz, vz]))

function hpvCandidates(xis: HPV[]) {

    const xic = xis.filter(([h,p,v], i) => {
        const b: number[] = _.slice(xis, 0, i).map(([h,p,v]) => v)
        const a: number[] = _.slice(xis, i+1, xis.length).map(([h,p,v]) => v)
        if (_.isEmpty(b) || _.isEmpty(a)) return true
        const bMin = _.min(b)!
        const aMax = _.max(a)!
        const notPossible = 
            (bMin < 0 && aMax > 0) ||   // Keep, but not needed with other two
            (bMin < aMax) ||            // Will not be able to catch and be caught
            (aMax > bMin)               // Will not be able to catch and be caught
        // log("possible", h, !notPossible, bMin, bMax, aMin, aMax, (bMin < 0 && aMax > 0), (bMin < aMax), (aMax > bMin))    
        return !notPossible
    })
    // ll(xic, "candidates")

    return xic
    
}

function hpvEventAfter(hpv: HPV[]): number[] {
    const m = _.chain(window(hpv, 2)).map(([[h1,p1,v1], [h2,p2,v2]]) => (p2-p1)/(v1-v2)).filter(t => isFinite(t) && t > 0).min().value()
    return (_.isUndefined(m)) ? [] : [m]
}

function eventAfter(xHpv: HPV[], yHpv: HPV[], zHpv: HPV[]): number {
    const m = _.min(_.concat(hpvEventAfter(xHpv), hpvEventAfter(yHpv), hpvEventAfter(zHpv)))
    return (_.isUndefined(m)) ? 0 : Math.ceil(m+1)
}

function candidates(xHpv: HPV[], yHpv: HPV[], zHpv: HPV[]): Set<string> {

    const xc = new Set(hpvCandidates(xHpv).map(c => c[0]))
    const yc = new Set(hpvCandidates(yHpv).map(c => c[0]))
    const zc = new Set(hpvCandidates(zHpv).map(c => c[0]))
    
    const ss = new Set([...xc,...yc,...zc])
    return new Set([...ss].filter(h => xc.has(h) && yc.has(h) && zc.has(h)))
    
}

const max = 3 * xi.length * xi.length / 2 
var stop = false
var time = 0
var step = 0
const collisions: [string, number][] = []
var xit: HPV[] = xi
var yit: HPV[] = yi
var zit: HPV[] = zi
while (!stop) {

    const hits = candidates(xit, yit, zit)
    // const hits=new Set([])

    // log(step, xit.length, hits.size)
    if (hits.size > 0) {
        log("hits", [...hits])
        hits.forEach(h => collisions.push([h, time]))
        xit = collide(xit, hits)
        yit = collide(yit, hits)
        zit = collide(zit, hits)  
    } else {
        const nextEvt = eventAfter(xit, yit, zit)
        log("time", step, max, time, nextEvt, collisions.length)
        time = time+nextEvt    
        xit = atT(nextEvt, xit)
        yit = atT(nextEvt, yit)
        zit = atT(nextEvt, zit)    
        if (nextEvt === 0) stop = true
    }

    step++
}

ll(collisions, "collisions")

