
import { TK, Data, lAny, lDigits, lNL, pNL, pColon, lDots, pDots, ll, pAny, pDigits } from 'aoc-util';
import _ from 'lodash';
import {alt, apply, buildLexer, kleft, Lexer, Parser, rep, tok} from 'typescript-parsec';

export enum EType {part, dots, sym}

export type PartNumber = {
    tk: EType
    part: number
    begin: number
    end: number
}

export type Dots = {
    tk: EType,
    count: number
}

export type Symbol = {
    tk: EType
    symbol: string
    position: number
}

export type Entry = PartNumber | Symbol | Dots

export type Input = Entry[][]

export const isPartNumber = (e: Entry) => e.tk === EType.part
export const isSymbol = (e: Entry) => e.tk === EType.sym

const lexer: Lexer<TK> = buildLexer([ lDots, lDigits, lNL, lAny ])

const pPart: Parser<TK, PartNumber> = apply(pDigits, t => {
    return {tk: EType.part, part: +t.text, begin: t.pos.columnBegin, end: t.pos.columnEnd-1}
})

const pEntryDots: Parser<TK, Dots> = apply(pDots, t => {
    return {tk: EType.dots, count: t.text.length}
})

const pSym: Parser<TK, Symbol> = apply(pAny, t => {
    return {tk: EType.sym, symbol: t.text, position: t.pos.columnBegin }
})

const pEntry: Parser<TK, Entry> = alt(pPart, pSym, pEntryDots)

const pLine: Parser<TK, Entry[]> = kleft(rep(pEntry), pNL)

const pInput: Parser<TK, Input> = rep(pLine)

export const data = new Data(lexer, pInput, import.meta.dir)
