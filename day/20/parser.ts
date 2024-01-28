
import _ from 'lodash';
import {alt, apply, buildLexer, kleft, Lexer, list_sc, opt, Parser, rep, seq} from 'typescript-parsec';
import { TK, lNL, Data, pComma, lComma, pNL, lWord, pWord, lGT, pGT, lAmp, lDash, lPC, lWS, pDash, pAmp, pPC, ll } from 'aoc-util'

export type Prefix = "%"|"&"|""
export type InputModule = [ Prefix, string, string[] ]
export type Input = InputModule[]

const lexer: Lexer<TK> = buildLexer([ lWord, lPC, lAmp, lDash, lGT, lWS, lComma, lNL ])

const pPrefix: Parser<TK, Prefix> = apply(opt(alt(pAmp, pPC)), x => x?.text??"") as Parser<TK, Prefix>

const pModule: Parser<TK, InputModule> = seq( pPrefix, kleft(pWord, seq(pDash, pGT)), kleft(list_sc(pWord, pComma), pNL))

const parser: Parser<TK, Input> = rep(pModule)

export const data: Data<Input> = new Data(lexer, parser, import.meta.dir)

