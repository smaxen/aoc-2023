
import _ from 'lodash';
import {buildLexer, Lexer, Parser, rep} from 'typescript-parsec';
import { TK, lNL, lWS, Data, multiLine, lInt, pInt } from 'aoc-util'

export type Input = number[]

const lexer: Lexer<TK> = buildLexer([ lInt, lWS, lNL ])

const parser: Parser<TK, Input[]> = multiLine(rep(pInt))

export const data: Data<Input[]> = new Data(lexer, parser, import.meta.dir)
