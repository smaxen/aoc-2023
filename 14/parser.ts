
import _ from 'lodash';
import {alt, apply, buildLexer, kleft, Lexer, list_sc, opt, Parser, rep, seq} from 'typescript-parsec';
import { TK, lNL, Data, multiLine, lNWS, pNWS, lInt, lDot, lHash, lQM, pHash, pDot, pComma, pQM, pInt, lWS, lComma, pNL, log, rep1, lLetter, pLetter } from 'aoc-util'

export type Input = string[][]

const lexer: Lexer<TK> = buildLexer([ lNL, lDot, lHash, lLetter, lComma])

const line: Parser<TK,string[]> = kleft(apply(rep1(alt(pHash, pDot, pLetter)), t => t.map(c => c.text)), pNL)

const parser: Parser<TK, Input> = rep(line)

export const data: Data<Input> = new Data(lexer, parser, import.meta.dir)

