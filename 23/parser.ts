
import _ from 'lodash';
import {alt, apply, buildLexer, kleft, kmid, kright, Lexer, list_sc, Parser, rep, seq} from 'typescript-parsec';
import { TK, lNL, Data, lInt, pComma, pInt, lComma, pNL, lWord, pWord, lEq, lColon, lOC, lCC, lGT, lLT, pOC, pGT, pLT, pCC, pColon, pEq, kOdd3, lTilde, kOdd5, pTilde, ll, kOdd4, lHash, lLetter, lDot, pLetter, pHash, pDot } from 'aoc-util'

export type P3 = [number, number, number]

export type Plot = "."|"#"|">"|"v"

export type Input = Plot[][]

const lexer: Lexer<TK> = buildLexer([ lDot, lHash, lGT, lLetter, lNL ])

const parser: Parser<TK, Input> = rep(kleft(rep(apply(alt(pHash, pDot, pGT, pLetter), t => t.text as Plot)), pNL))

export const data: Data<Input> = new Data(lexer, parser, import.meta.dir)


