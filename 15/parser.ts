
import {alt, apply, buildLexer, kleft, Lexer, list_sc, opt, Parser, seq} from 'typescript-parsec';
import { TK, lNL, Data, lInt, pComma, pInt, lComma, pNL, lWord, lDash, lEq, pWord, pEq, pDash } from 'aoc-util'

export type Input = {op: "add"|"remove", name: string, value?: number}

const lexer: Lexer<TK> = buildLexer([ lNL, lInt, lWord, lEq, lDash, lComma])

const addP: Parser<TK, Input> = apply(seq(pWord, pEq, pInt), ([w, e, i]) => ({op: "add", name: w, value: i}) as Input)
const removeP: Parser<TK, Input> = apply(seq(pWord, pDash), ([w, d]) => ({op: "remove", name: w}) as Input)

const parser: Parser<TK, Input[]> = kleft(list_sc(alt(addP, removeP), pComma), opt(pNL))

export const data: Data<Input[]> = new Data(lexer, parser, import.meta.dir)

