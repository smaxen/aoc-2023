
import _ from 'lodash';
import {buildLexer, Lexer, Parser} from 'typescript-parsec';
import { TK, lNL, Data, multiLine, lNWS, pNWS } from 'aoc-util'

export type Input = string[]

const lexer: Lexer<TK> = buildLexer([ lNWS, lNL ])

const parser: Parser<TK, Input> = multiLine(pNWS)

export const data: Data<Input> = new Data(lexer, parser, import.meta.dir)
