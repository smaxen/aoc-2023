
import _ from 'lodash';
import {apply, buildLexer, Lexer, Parser, seq} from 'typescript-parsec';
import { TK, lNL, lWS, Data, lWord, pWord, multiLine, log } from 'aoc-util'

export type Input = [string, number][] 

const lexer: Lexer<TK> = buildLexer([ lWord, lWS, lNL ])

const parser: Parser<TK, Input> = multiLine(apply(seq(pWord, pWord), ([h, s]) => [h, +s]))

export const data: Data<Input> = new Data(lexer, parser, import.meta.dir)

