
import _ from 'lodash'
import {Input, data} from './parser'
import { mxEmpty, mxExpand, mxInBounds, mxLog } from 'aoc-mx'
import { check, Direction, Point, a90, c90, ll, log, opposite, window, advance1 } from 'aoc-util'

const input = await data.input()
// mxLog(input, "input")

type LastSteps = [ Direction, Direction, Direction ]
type SearchPath = [ LastSteps, Point[], number ]
type BestPath = [ Point[], number ]

const lines=input.length
const cols=input[0].length

const distance = mxEmpty(lines, cols, -1)
distance[lines-1][cols-1]=input[lines-1][cols-1]

const paths = mxEmpty(lines, cols, [] as Point[])
paths[lines-1][cols-1]=[[lines-1, cols-1]]

const visited = mxEmpty(lines, cols, 0)

function validMove(f: Point[], t: Point[]): boolean {

    const exDir = (pFT: Point[]) => {
        const [[fl, fc], [tl, tc]] = pFT
        if (fl === tl) {
            return (tc > fc) ? Direction.Right : Direction.Left
        } else {
            return (tl > fl) ? Direction.Down : Direction.Up
        }
    }

    const from: Point[] = _.drop(f, f.length-4)
    const to: Point[] = _.take(t, 4)

    const directions = window([...from, ...to], 2).map(exDir)

    const v1 = window(directions, 2).every(([p0, p1]) => {
        return p0 !== opposite(p1)
    })

    const v2 =  window(directions, 4).every(([p0, p1, p2, p3]) => {
        return !((p0 === p1) && (p0 === p2) && (p0 === p3))
    })

    return v1 && v2

}

function nextStep(path: SearchPath): SearchPath[] {
        
    const [ [s0, s1, s2], entries, cost ] = path
    const entry = _.last(entries)!
    const max = s0 === s1 && s0 === s2
    
    function ns(d: Direction): SearchPath[] { 
        const [r, c] = advance1(entry, d)

        if (!mxInBounds(input, [r,c])) {
            return []
        } else if (distance[r][c] !== -1 && validMove(entries, paths[r][c])) {
            return [[ [ s1, s2, d ], [...entries, ...paths[r][c]], cost+distance[r][c] ]]
        } else {
            const trans = [entry,[r,c]]
            const beenThere = window(entries, 2).findIndex(t => _.isEqual(t, trans))
            if (beenThere !== -1) return []
            return [[ [ s1, s2, d ], [...entries, [r, c]], cost+input[r][c] ]]
        }
    }
    
    const spc90 = ns(c90(s2))
    const spa90 = ns(a90(s2))
    const sp0 = max ? [] : ns(s2)

    return _.concat(spc90, spa90, sp0)
}

const targetPt: Point = [ input.length-1, input[0].length-1 ]

function search(startPt: Point, tMin: number): BestPath {

    const startCost = input[startPt[0]][startPt[1]]
    var bestCost = Number.MAX_SAFE_INTEGER
    var bestSearch: Point[] = []
    var candidates: SearchPath[] = [
        [ [ Direction.Down, Direction.Down, Direction.Down ], [startPt], startCost ],
        [ [ Direction.Right, Direction.Right, Direction.Right ], [startPt], startCost ],
    ]


    while (!_.isEmpty(candidates)) {
        
        const c0 = _.flatMap(candidates, nextStep)
        const [t0, c1] = _.partition(c0, ([ls, ps, c]) => _.isEqual(_.last(ps)!, targetPt))
        if (!_.isEmpty(t0)) {
            const t1 = _.sortBy(t0, ([ls, ps, c]) => c)
            const [ls, ps, c] = t1[0]
            if (c < bestCost) {
                bestCost = c
                bestSearch = ps
            }
        }
        const c2 = c1.filter(([ls, ps, c]) => (c+tMin-20) < bestCost)
        candidates = c2
    }

    return [ bestSearch, bestCost ]
}

while (distance[0][0] === -1) {
    const candidates = _.sortBy(mxExpand(distance).filter(([l, c, t]) => t !== -1 && visited[l][c] === 0), ([l, c, t]) => t)
    const [lMin, cMin, tMin] = candidates[0]!
    const lBa = [lMin-1, lMin+1].filter(l => l >= 0 && l < lines).map(l => [l, cMin])
    const cBa = [cMin-1, cMin+1].filter(c => c >= 0 && c < cols).map(c => [lMin, c])
    _.concat(lBa, cBa).forEach(([l, c]) => {
        if (distance[l][c] === -1) {
            // log("search", l, c)
            const [ bSearch, bCost ] = search([l, c], tMin)
            distance[l][c] = bCost
            paths[l][c] = bSearch
        }
    })
    visited[lMin][cMin] = 1
}

// mxLog(distance, "distance")

check("A1", distance[0][0]-input[0][0], 859) // Takes around 45 s

