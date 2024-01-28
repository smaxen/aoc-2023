
import _ from 'lodash';
import {apply, buildLexer, kright, Lexer, list_sc, Parser, rep, seq} from 'typescript-parsec';
import { TK, lBar, lColon, lInt, lNL, lWS, multiLine, pBar, pColon, pInt, Data, lWord, pWord, kOdd5, lComma, lSemicolon, pComma, pSemicolon, kOdd3, pNL, kOdd4, ll} from 'aoc-util'

export type Color = "red"|"green"|"blue"
export type Handful =  Map<Color, number>
export type Input = [ number, Handful[] ][]

const lexer: Lexer<TK> = buildLexer([ lInt, lWord, lColon, lSemicolon, lComma, lWS, lNL ])

const pMap: Parser<TK, Map<Color, number>> = apply(list_sc(seq(pInt, pWord), pComma), a => new Map(a.map(([n,s]) => [s as Color, n])))

const pLine: Parser<TK, [ number, Map<Color, number>[] ]> = kOdd4(kright(pWord, pInt), pColon, list_sc(pMap, pSemicolon), pNL)

const pInput: Parser<TK, Input> = rep(pLine)

export const data: Data<Input> = new Data(lexer, pInput, import.meta.dir)
