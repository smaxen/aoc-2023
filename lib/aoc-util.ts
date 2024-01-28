
import _ from 'lodash';
import {alt, apply, buildLexer, expectEOF, expectSingleResult, fail, Lexer, list_sc, opt, Parser, rep, seq, str, tok, Token} from 'typescript-parsec';
import chalk from 'chalk'

type Rule = [boolean, RegExp, TK]

export enum TK {
    Int,
    Bar,
    Colon,
    WS,
    NL,
    Word,
    Dash,
    Comma,
    Eq,
    OB,
    CB,
    OC,
    CC,
    GT,
    LT,
    At,
    NWS,
    QM,
    Dot,
    Hash,
    Letter,
    Slash,
    Backslash,
    Digit,
    Digits,
    Tilde,
    PC,
    Amp,
    Semicolon,
    Any,
    Dots,
}

export const pInt = apply(tok(TK.Int), t => +t.text)
export const pColon = tok(TK.Colon)
export const pDigit = apply(tok(TK.Digit), t => +t.text)
export const pDigits = tok(TK.Digits)
export const pBar = tok(TK.Bar)
export const pDash = tok(TK.Dash)
export const pNL = tok(TK.NL)
export const pWord = apply(tok(TK.Word), t => t.text)
export const pComma = tok(TK.Comma)
export const pEq = tok(TK.Eq)
export const pOB = tok(TK.OB)
export const pCB = tok(TK.CB)
export const pNWS = apply(tok(TK.NWS), t => t.text)
export const pDot = tok(TK.Dot)
export const pQM = tok(TK.QM)
export const pAt = tok(TK.At)
export const pHash = tok(TK.Hash)
export const pLetter = tok(TK.Letter)
export const pSlash = tok(TK.Slash)
export const pBackslash = tok(TK.Backslash)
export const pOC = tok(TK.OC)
export const pCC = tok(TK.CC)
export const pGT = tok(TK.GT)
export const pLT = tok(TK.LT)
export const pTilde = tok(TK.Tilde)
export const pPC = tok(TK.PC)
export const pAmp = tok(TK.Amp)
export const pSemicolon = tok(TK.Semicolon)
export const pAny = tok(TK.Any)
export const pDots = tok(TK.Dots)

export const lAny: Rule = [true, /^./g, TK.Any]
export const lInt: Rule = [true, /^-?\d+/g, TK.Int]
export const lDigit: Rule = [true, /^\d/g, TK.Digit]
export const lDigits: Rule = [true, /^\d+/g, TK.Digits]
export const lBar: Rule = [true, /^\|/g, TK.Bar]
export const lDash: Rule = [true, /^-/g, TK.Dash]
export const lColon: Rule = [true, /^:/g, TK.Colon]
export const lWS: Rule = [false, /^ +/g, TK.WS]
export const lNL: Rule = [true, /^\n/g, TK.NL]
export const lWord: Rule = [true, /^\w+/g, TK.Word]
export const lLetter: Rule = [true, /^[A-Za-z]/g, TK.Letter]
export const lComma: Rule = [true, /^,/g, TK.Comma,]
export const lEq: Rule = [true, /^\=/g, TK.Eq,]
export const lOB: Rule = [true, /^\(/g, TK.OB,]
export const lCB: Rule = [true, /^\)/g, TK.CB,]
export const lOC: Rule = [true, /^{/g, TK.OC,]
export const lCC: Rule = [true, /^}/g, TK.CC,]
export const lGT: Rule = [true, /^>/g, TK.GT,]
export const lAt: Rule = [true, /^@/g, TK.At,]
export const lTilde: Rule = [true, /^\~/g, TK.Tilde,]
export const lLT: Rule = [true, /^</g, TK.LT,]
export const lNWS: Rule = [true, /^\S+/g, TK.NWS,]
export const lDot: Rule = [true, /^\./g, TK.Dot,]
export const lDots: Rule = [true, /^\.+/g, TK.Dots,]
export const lQM: Rule = [true, /^\?/g, TK.QM,]
export const lHash: Rule = [true, /^#/g, TK.Hash,]
export const lSlash: Rule = [true, /^\//g, TK.Slash,]
export const lBackslash: Rule = [true, /^\\/g, TK.Backslash,]
export const lAmp: Rule = [true, /^&/g, TK.Amp,]
export const lPC: Rule = [true, /^%/g, TK.PC,]
export const lSemicolon: Rule  = [true, /^;/g, TK.Semicolon,]


export function dumpToken(token: Token<TK> | undefined) {
    var t = token
    while (t) {
        console.log("token", TK[t.kind], t.text, t.pos.rowBegin, t.pos.columnBegin)
        t = t.next
    }
}

export function multiLine<R>(lineParser: Parser<TK, R>): Parser<TK, R[]> {
    return apply(
        seq(list_sc(lineParser, pNL), opt(pNL)),
        ([ t, nl ]) => t,
    )
}

export class Data<R> {
    private l: Lexer<TK>
    private p: Parser<TK, R>
    private dir: string
    
    constructor(l: Lexer<TK>, p: Parser<TK, R>, dir: string) {
      this.l = l
      this.p = p
      this.dir = dir
    }

    async parseFile<R>(f: string, l: Lexer<TK>, p: Parser<TK, R>): Promise<R> {
        const data = await Bun.file(`${this.dir}/${f}`).text()
        return expectSingleResult(expectEOF(p.parse(l.parse(data))))
    }

    async dump(s: string) {
        dumpToken(this.l.parse(s))
    }

    async dumpSample() {
        const data = await Bun.file(`${this.dir}/sample.txt`).text()
        this.dump(data)
    }


    async dumpSample1() {
        const data = await Bun.file(`${this.dir}/sample1.txt`).text()
        this.dump(data)
    }

    async sample(): Promise<R> {
      return this.parseFile("sample.txt", this.l, this.p)
    }

    async sample1(): Promise<R> {
        return this.parseFile("sample1.txt", this.l, this.p)
    }

    async sample2(): Promise<R> {
    return this.parseFile("sample2.txt", this.l, this.p)
    }
      
    async input(): Promise<R> {
        return this.parseFile("input.txt", this.l, this.p)
    }
}

export function kOdd3<T1, T2, T3>(
    p1: Parser<TK, T1>, 
    p2: Parser<TK, T2>, 
    p3: Parser<TK, T3>, 
): Parser<TK, [T1, T3]> {
    return apply(seq(p1, p2, p3), ([t1, t2, t3]) => [t1, t3])
}


export function kOdd4<T1, T2, T3, T4>(
    p1: Parser<TK, T1>, 
    p2: Parser<TK, T2>, 
    p3: Parser<TK, T3>, 
    p4: Parser<TK, T4>, 
): Parser<TK, [T1, T3]> {
    return apply(seq(p1, p2, p3, p4), ([t1, t2, t3, t4]) => [t1, t3])
}

export function kOdd5<T1, T2, T3, T4, T5>(
    p1: Parser<TK, T1>, 
    p2: Parser<TK, T2>, 
    p3: Parser<TK, T3>, 
    p4: Parser<TK, T4>, 
    p5: Parser<TK, T5>, 
): Parser<TK, [T1, T3, T5]> {
    return apply(seq(p1, p2, p3, p4, p5), ([t1, t2, t3, t4, t5]) => [t1, t3, t5])
}


export function kOdd6<T1, T2, T3, T4, T5, T6>(
    p1: Parser<TK, T1>, 
    p2: Parser<TK, T2>, 
    p3: Parser<TK, T3>, 
    p4: Parser<TK, T4>, 
    p5: Parser<TK, T5>, 
    p6: Parser<TK, T6>, 
): Parser<TK, [T1, T3, T5]> {
    return apply(seq(p1, p2, p3, p4, p5, p6), ([t1, t2, t3, t4, t5, t6]) => [t1, t3, t5])
}

export function rep1<T1>(p1: Parser<TK, T1>): Parser<TK, T1[]> {
    return apply(seq(p1, rep(p1)), ([h, t]) => _.concat([h], t))
}

export function log(...data: any[]): void {
    console.log(...data)
}


export function ll<T>(s: T[], name: string = "") {
    log(`===${name}===`)
    s.forEach((l, i) => log(l))
}

export enum Direction {
    Up = "U",
    Down = "D",
    Left = "L",
    Right = "R",
}

export type Point = [number, number]

export function advance1(p: Point, d: Direction): Point {
    return endN(p, d, 1)
}

export function advanceN(p: Point, d: Direction, n: number): Point[] {
    const ad: Point[] = [advance1(p, d)]
    while (ad.length < n) {
        ad.push(advance1(_.last(ad)!, d))
    }
    return ad
}

export function endN(p: Point, d: Direction, n: number): Point {
    const [r, c] = p
    switch(d) {
        case Direction.Up:    return [r-n, c  ]
        case Direction.Right: return [r  , c+n]
        case Direction.Down:  return [r+n, c  ]
        case Direction.Left:  return [r  , c-n]
    }
}

export function c90(d: Direction): Direction {
    switch(d) {
        case Direction.Up: return Direction.Right
        case Direction.Right: return Direction.Down
        case Direction.Down: return Direction.Left
        case Direction.Left: return Direction.Up
    }
}

export function a90(d: Direction): Direction {
    switch(d) {
        case Direction.Up: return Direction.Left
        case Direction.Left: return Direction.Down
        case Direction.Down: return Direction.Right
        case Direction.Right: return Direction.Up
    }
}

export function opposite(d: Direction): Direction {
    return c90(c90(d))
}

export function window<T>(t: T[], size: number): T[][] {
    if (t.length < size) return []    
    return [_.take(t, size), ...window(_.tail(t), size)]
}

export function sample<T>(t: T[], size: number): [T, T][] {
    return _.range(0, t.length-size).map(i => [t[i], t[i+size]])
}

var indent = false
export function check(_q: string, actual: number, expected: number) {
    const q = indent ? `    ${_q}` : _q
    if (actual === expected) {
        log(q, actual, chalk.bold.green("OK"))
    } else {
        log(q, actual, expected, chalk.bold.green("FAIL"))
    }
    indent = (process.env.CI==="1") 
}
