
import _ from 'lodash';
import {buildLexer, kleft, Lexer, Parser, rep} from 'typescript-parsec';
import { TK, lNL, Data, pNL, lWord, pWord, lColon, pColon, kOdd3, ll, lWS } from 'aoc-util'

export type Input = [string, string[]][]

const lexer: Lexer<TK> = buildLexer([ lWord, lWS, lColon, lNL ])

const parser: Parser<TK, Input> = rep(kleft(kOdd3(pWord, pColon, rep(pWord)), pNL))

export const data: Data<Input> = new Data(lexer, parser, import.meta.dir)

