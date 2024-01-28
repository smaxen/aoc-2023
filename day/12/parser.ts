
import _ from 'lodash';
import {alt, apply, buildLexer, Lexer, list_sc, Parser, rep, seq} from 'typescript-parsec';
import { TK, lNL, Data, multiLine, lNWS, pNWS, lInt, lDot, lHash, lQM, pHash, pDot, pComma, pQM, pInt, lWS, lComma } from 'aoc-util'

export type Input = [string, number[]]

const lexer: Lexer<TK> = buildLexer([ lNL, lWS, lInt, lDot, lQM, lHash, lComma])

const line: Parser<TK, Input> = seq(apply(rep(alt(pHash, pQM, pDot)), t => t.map(c => c.text).join("")), list_sc(pInt, pComma))

const parser: Parser<TK, Input[]> = multiLine(line)

export const data: Data<Input[]> = new Data(lexer, parser, import.meta.dir)
