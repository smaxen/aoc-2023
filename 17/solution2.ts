
import _, { max } from 'lodash'
import {Input, data} from './parser'
import { mxEmpty, mxExpand, mxInBounds, mxLog } from 'aoc-mx'
import { check, Direction, Point, a90, advance1, advanceN, c90, ll, log, opposite, window } from 'aoc-util'

const input = await data.input()
// mxLog(input, "input")

const targetPt: Point = [ input.length-1, input[0].length-1 ]
const searchFactor = 100 // Larger value means search deeper
const batchSize = 100

type FLSteps = [ Direction, number ]
type SearchPath = [ FLSteps, Point[], number ]
type BestPath = [ Point[], number ]

const maxSize = 10
const lines=input.length
const cols=input[0].length

const distance = mxEmpty(lines, cols, -1)
distance[lines-1][cols-1]=input[lines-1][cols-1]

const paths = mxEmpty(lines, cols, [] as Point[])
paths[lines-1][cols-1]=[[lines-1, cols-1]]

const pathSteps = mxEmpty(lines, cols, [Direction.Up, 0] as FLSteps)

const visited = mxEmpty(lines, cols, 0)

const exDir = (pFT: Point[]) => {
    const [[fl, fc], [tl, tc]] = pFT
    if (fl === tl) {
        return (tc > fc) ? Direction.Right : Direction.Left
    } else {
        return (tl > fl) ? Direction.Down : Direction.Up
    }
}

function firstSteps(p: Point[]): FLSteps {
    const directions = window(p, 2).map(exDir)
    const d0 = directions[0]!
    const count = _.takeWhile(directions, d => d === d0).length
    return [d0, count]
}

var debug = false

function _validMove([eDir, eCount]: FLSteps, [lDir, lCount]: FLSteps, [sDir, sCount]: FLSteps): boolean {

    if (sCount === 0) return false

    const elCount = (eDir === lDir) ? (eCount + lCount) : lCount
    const elDir = lDir

    if (elDir === sDir) {
        const elsCount = elCount + sCount
        if (elsCount < 4 || elsCount > maxSize) return false
    } else if (lDir === opposite(sDir)) {
        return false
    } else {
        if (elCount < 4 || sCount < 4) return false
    }

    return true
    
}


function validMove(e: FLSteps, l: FLSteps, s: FLSteps): boolean {
    return _validMove(e, l, s)
}

function nextStep(path: SearchPath): SearchPath[] {
        
    const [ [dir, dCount], entries, cost ] = path
    const entry = _.last(entries)!
    const max = dCount >= maxSize
    
    function ns(d: Direction): SearchPath[] { 
        const steps = d === dir ? 1 : 4
        const newEntries = advanceN(entry, d, steps)
        const [r, c] = _.last(newEntries)!

        if (!mxInBounds(input, [r,c])) return []

        const newCount = (d === dir) ? (dCount+1) : 4

        const validPath = (distance[r][c] !== -1) && validMove([dir, dCount], [d, steps], pathSteps[r][c])
        
        if (validPath) {
            const newPath = _.dropRight(newEntries)
            const newCost = _.sum(newPath.map(([er, ec]) => input[er][ec]))
            return [[ [ d, 0 ], [...entries, ...newPath, ...paths[r][c]], cost+newCost+distance[r][c] ]]
        } else {
            const newCost = _.sum(newEntries.map(([er, ec]) => input[er][ec]))
            const newPath = [...entries, ...newEntries]
            return [[ [ d, newCount ], newPath, cost+newCost ]]
        }
    }
    
    const spc90 = ns(c90(dir))
    const spa90 = ns(a90(dir))
    const sp0 = max ? [] : ns(dir)

    return _.concat(spc90, spa90, sp0)
}

function searchR(): BestPath {

    const sl: Point[] = [[0,0],[0,1],[0,2],[0,3],[0,4]]
    const cl = _.chain(sl).drop(1).map(([l,c]) => input[l][c]).sum().value()
    const ml = distance[0][4]
    const candidateL: SearchPath = [ [ Direction.Right, 4 ], sl , cl ]
    const resL = searchC(ml, [candidateL])
    // console.log("resL", resL)

    const sd: Point[] = [[0,0],[1,0],[2,0],[3,0],[4,0]]
    const cd = _.chain(sd).drop(1).map(([l,c]) => input[l][c]).sum().value()
    const md = distance[4][0]
    const candidateD: SearchPath = [ [ Direction.Down, 4 ], sd , cd ]
    const resD = searchC(md, [candidateD])
    // console.log("resD", resD)
    
    return (resD[1] < resL[1] ? resD : resL)

}


function search(startPt: Point, tMin: number): BestPath {

    const startCost = input[startPt[0]][startPt[1]]
    var candidates: SearchPath[] = [
        [ [ Direction.Down, 0 ], [startPt], startCost ],
        [ [ Direction.Right, 0 ], [startPt], startCost ],
        [ [ Direction.Up, 0 ], [startPt], startCost ],
        [ [ Direction.Left, 0 ], [startPt], startCost ],
    ]

    return searchC(tMin, candidates)

}


function searchC(tMin: number, initCandidates: SearchPath[]): BestPath {

    var candidates: SearchPath[] = initCandidates
    var bestCost = -1
    var bestSearch: Point[] = []
    const beenThere = new Map<string, number>([])

    while (!_.isEmpty(candidates)) {

        const pc0 = candidates.filter(([ls, ps, c]) => {
            const key=`${ls},${_.last(ps)}`
            if (beenThere.has(key)) {                
                const oc = beenThere.get(key)!
                if (c < oc) {
                    beenThere.set(key, c)
                    return true
                } else {
                    return false
                }
            } else {
                beenThere.set(key, c)
                return true
            }
        })
        const pc1 = _.sortBy(pc0, ([ls, ps, c]) => c)
        const pc2 = _.take(pc1, batchSize)
        const other = _.drop(pc1, batchSize)

        const c0 = _.flatMap(pc2, nextStep)

        const [t0, c1] = _.partition(c0, ([ls, ps, c]) => _.isEqual(_.last(ps)!, targetPt))
        if (!_.isEmpty(t0)) {
            const t1 = _.sortBy(t0, ([ls, ps, c]) => c)
            const [ls, ps, c] = t1[0]
            if (bestCost === -1 || c < bestCost) {
                bestCost = c
                bestSearch = ps
            }
        }
        // Has search factor below
        const c2 = (bestCost !== -1) ? c1.filter(([ls, ps, c]) => (c+Math.max(tMin-searchFactor,0)) < bestCost) : c1
        // const c2 = (bestCost !== -1) ? c1.filter(([ls, ps, c]) => c < bestCost) : c1
        candidates = [ ...c2, ...other ]
    
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
            pathSteps[l][c] = firstSteps(bSearch)
        }
    })
    visited[lMin][cMin] = 1
}

// mxLog(distance, "distance")

debug = true
const [aPath, aCost] = searchR()

// aPath.forEach(e => {
//     log("actual", e, input[e[0]][e[1]])
// })

check("A2", aCost, 1027)    // Takes around 90s

