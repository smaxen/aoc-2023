
import _ from 'lodash';
import {alt, apply, buildLexer, kleft, Lexer, Parser, rep} from 'typescript-parsec';
import { TK, lNL, Data, lDot, pDot, pNL, lBar, lDash, lSlash, lBackslash, pBar, pDash, pSlash, pBackslash } from 'aoc-util'

export type Input = string[][]

const lexer: Lexer<TK> = buildLexer([ lNL, lDot, lBar, lDash, lSlash, lBackslash])

const line: Parser<TK, string[]> = kleft(rep(apply(alt(pDot, pBar, pDash, pSlash, pBackslash), a => a.text)), pNL)

const parser: Parser<TK, Input> = rep(line)

export const data: Data<Input> = new Data(lexer, parser, import.meta.dir, import.meta.dir)

