
import _ from 'lodash';
import {alt, apply, buildLexer, kleft, Lexer, Parser, rep} from 'typescript-parsec';
import { TK, lNL, Data, pNL, ll, lHash, lDot, lLetter, pDot, pHash, pLetter } from 'aoc-util'

export type Plot = "."|"#"|"S"
export type Input = Plot[][]

const lexer: Lexer<TK> = buildLexer([ lDot, lHash, lLetter, lNL ])

const plot: Parser<TK, Plot> = apply(alt(pDot, pHash, pLetter), p => p.text as Plot)

const parser: Parser<TK, Input> = rep(kleft(rep(plot), pNL))

export const data: Data<Input> = new Data(lexer, parser, import.meta.dir)

