
import _ from 'lodash';
import {buildLexer, Lexer, Parser, rep} from 'typescript-parsec';
import { TK, lNL, Data, lInt, pComma, pInt, lComma, pNL, lTilde, kOdd5, pTilde, kOdd4 } from 'aoc-util'

export type P3 = [number, number, number]

export type Input = [P3, P3][]

const lexer: Lexer<TK> = buildLexer([ lInt, lComma, lTilde, lNL ])

const pP3: Parser<TK, P3> = kOdd5(pInt, pComma, pInt, pComma, pInt)

const parser: Parser<TK, Input> = rep(kOdd4(pP3, pTilde, pP3, pNL))

export const data: Data<Input> = new Data(lexer, parser, import.meta.dir)

