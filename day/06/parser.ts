
import _ from 'lodash';
import {buildLexer, kmid, Lexer, Parser, rep, seq, str} from 'typescript-parsec';
import { TK, lColon, lInt, lNL, lWS, pColon, pInt, Data, lWord, lDash, pNL } from 'aoc-util'

export type Input = [number[], number[]] 

const lexer: Lexer<TK> = buildLexer([ lInt, lWord, lDash, lColon, lWS, lNL ])

const pTimes: Parser<TK, number[]> = kmid(seq(str("Time"), pColon), rep(pInt), rep(pNL))
const pDistance: Parser<TK, number[]> = kmid(seq(str("Distance"), pColon), rep(pInt), rep(pNL))
const parser: Parser<TK, Input> = seq(pTimes, pDistance)

export const data: Data<Input> = new Data(lexer, parser, import.meta.dir)

