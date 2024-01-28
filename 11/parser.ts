
import _ from 'lodash';
import {apply, buildLexer, Lexer, Parser} from 'typescript-parsec';
import { TK, lNL, Data, multiLine, lNWS, pNWS } from 'aoc-util'

export type Input = string[][]

const lexer: Lexer<TK> = buildLexer([ lNWS, lNL ])

const parser: Parser<TK, Input> = multiLine(apply(pNWS, s => [...s]))

export const data: Data<Input> = new Data(lexer, parser, import.meta.dir)
