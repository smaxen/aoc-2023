
import _ from 'lodash'
import {Input, data} from './parser'
import { check, log } from 'aoc-util'

const input: Input = await data.input()

// Based on collisions produced in (collisions.ts) the expected speeds are predicted to be around -336, 29, 38
// On the assumption that the speeds will be a whole number pick hail that is travelling at the 
// same speed. Assume the distance between the hail will be a whole number of nanos.

const sx = -336
const dx1 = 337714586487335 - 199123322155967   // 6
const dx2 = 444805588706877 - 379757693919014   // -167
const dx3 = 357795871607095 - 151253379361137   // 50
// log("dx", dx1 / (sx-6), dx2 / (sx+167), dx3 / (sx-50))

const sy = 29
// 354727035189891		-160
// 374925993989022		-160
const dy = 374925993989022 - 354727035189891
// log("dy", dy / (sy+160))

const sz = 38
// 270778304563304	9
// 272073444795304	9
const dz = 272073444795304 - 270778304563304
// log("dz", dz / (sz-9))

// Pick two points with the same X speed, point 1 is hit first
// log("input", input[260], input[85])
const [[px1, py1, pz1], [vx1, vy1, vz1]] = input[260]
const [[px2, py2, pz2], [vx2, vy2, vz2]] = input[85]

function interpolate(_l: number, _h: number, f: (i:number) => number, tgt: number) {

    function go(x0: number, x1: number): number {
        const f0 = f(x0)
        const f1 = f(x1)
        // log("int", f0, tgt, f1)
        if (f1 === tgt) return x1
        const r = (tgt-f0)/(f1-f0)
        const xn = Math.round(x0 + r * (x1-x0))
        return go(x1, xn)
    }
    return go(_l, _h)
}

// Calculate formulas for the time delta between once point 1 has been hit
const xDelta = (t: number) => Math.round(((px2+t*vx2)-(px1+t*vx1))/(sx-vx2))
const yDelta = (t: number) => Math.round(((py2+t*vy2)-(py1+t*vy1))/(sy-vy2))
const zDelta = (t: number) => Math.round(((pz2+t*vz2)-(pz1+t*vz1))/(sz-vz2))

// log("delta0", xDelta(0), yDelta(0), zDelta(0))

// Interpolate to find a time where the time Y axis collisions is the same as the X axis (constant)
const t1est = interpolate(0, 1000000000000, yDelta, 535084176803)
const t1 = 268721261069
// log(t1est, "actual t1 is 1 nano higher", t1)

{
    const x = xDelta(t1)
    const y = yDelta(t1)
    const z = zDelta(t1)
    // log(x, y, z, "@t", t1)        
}

const t12 = xDelta(t1) // Could have chosen any
const t2 = t1 + t12

// Hail positions
// log("t1-p1", t1, px1 + vx1 * t1)
// log("t2-p2", t2, px2 + vx2 * t2)

// Calculate stone starting position
const px = (px1 + vx1 * t1) - (sx * t1)
const py = (py1 + vy1 * t1) - (sy * t1)
const pz = (pz1 + vz1 * t1) - (sz * t1)

// Stone positions
// log("t1-s", t1, px + sx * t1)
// log("t2-s", t2, px + sx * t2)

check("A2", px+py+pz, 983620716335751)
