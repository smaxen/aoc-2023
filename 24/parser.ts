
import _ from 'lodash';
import {alt, apply, buildLexer, kleft, kmid, kright, Lexer, list_sc, Parser, rep, seq} from 'typescript-parsec';
import { TK, lNL, Data, lInt, pComma, pInt, lComma, pNL, lWord, pWord, lEq, lColon, lOC, lCC, lGT, lLT, pOC, pGT, pLT, pCC, pColon, pEq, kOdd3, lTilde, kOdd5, pTilde, ll, kOdd4, lHash, lLetter, lDot, pLetter, pHash, pDot, lWS, lAt, pAt } from 'aoc-util'

export type P3 = [number, number, number]

export type Input = [P3, P3][]

const lexer: Lexer<TK> = buildLexer([ lInt, lWS, lComma, lAt, lNL ])

const pP3: Parser<TK, P3> = kOdd5(pInt, pComma, pInt, pComma, pInt)

const parser: Parser<TK, Input> = rep(kleft(kOdd3(pP3, pAt, pP3), pNL))

export const data: Data<Input> = new Data(lexer, parser, import.meta.dir)
