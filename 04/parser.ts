
import _ from 'lodash';
import {buildLexer, kright, Lexer, Parser, rep} from 'typescript-parsec';
import { TK, lBar, lColon, lInt, lNL, lWS, multiLine, pBar, pColon, pInt, Data, lWord, pWord, kOdd5} from 'aoc-util'

export type Input = [number, number[], number[]]

const lexer: Lexer<TK> = buildLexer([ lInt, lWord, lColon, lBar, lWS, lNL ])

const lineParser: Parser<TK, Input> = kOdd5(kright(pWord, pInt), pColon, rep(pInt), pBar, rep(pInt))

export const data: Data<Input[]> = new Data(lexer, multiLine(lineParser), import.meta.dir)

