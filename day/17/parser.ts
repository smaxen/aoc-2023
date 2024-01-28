
import _ from 'lodash';
import {buildLexer, kleft, Lexer, Parser, rep} from 'typescript-parsec';
import { TK, lNL, Data, pNL, lDigit, pDigit } from 'aoc-util'

export type Input = number[][]

const lexer: Lexer<TK> = buildLexer([ lDigit, lNL])

const line: Parser<TK, number[]> = kleft(rep(pDigit), pNL)

const parser: Parser<TK, Input> = rep(line)

export const data: Data<Input> = new Data(lexer, parser, import.meta.dir)


