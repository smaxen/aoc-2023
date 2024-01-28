
import _ from 'lodash';
import {buildLexer, kleft, kmid, Lexer, opt, Parser, rep, seq, str} from 'typescript-parsec';
import { TK, lColon, lInt, lNL, lWS, pColon, pInt, Data, lWord, lDash, pNL, pDash, pWord, kOdd4 } from 'aoc-util'

export type Input = [number[], [[string, string], [number, number, number][]][]] 

const lexer: Lexer<TK> = buildLexer([ lInt, lWord, lDash, lColon, lWS, lNL ])

const pName: Parser<TK, [string, string]> = kOdd4(pWord, seq(pDash, str("to"), pDash), pWord, seq(str("map"), pColon, pNL))

const pMap: Parser<TK, [number, number, number]> = kleft(seq(pInt, pInt, pInt), rep(pNL))

const pNameMap: Parser<TK, [[string, string], [number, number, number][]]> = seq(pName, rep(pMap))

const pSeeds: Parser<TK, number[]> = kmid(seq(str("seeds"), pColon), rep(pInt), rep(pNL))

const parser: Parser<TK, Input> = seq(pSeeds, rep(pNameMap))

export const data: Data<Input> = new Data(lexer, parser, import.meta.dir)
