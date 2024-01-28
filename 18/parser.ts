
import _ from 'lodash';
import {apply, buildLexer, Lexer, Parser, seq} from 'typescript-parsec';
import { TK, lNL, Data, multiLine, lHash, pHash, lWS, lWord, Direction, pWord, lOB, lCB, pCB, pOB } from 'aoc-util'

export type Edge = [Direction, number, string]

export type Input = Edge[]

const lexer: Lexer<TK> = buildLexer([ lWord, lHash, lOB, lCB, lWS, lNL ])

const edge: Parser<TK, Edge> = apply(seq(pWord, pWord, pOB, pHash, pWord, pCB), ([f1, f2, f3, f4, f5, f6]) => [f1, +f2, f5] as Edge)

const parser: Parser<TK, Input> = multiLine(edge)

export const data: Data<Input> = new Data(lexer, parser, import.meta.dir)


