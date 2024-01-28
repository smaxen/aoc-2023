
import _ from 'lodash';
import {buildLexer, kleft, Lexer, Parser, rep, seq} from 'typescript-parsec';
import { TK, lNL, lWS, Data, lWord, pWord, log, lColon, pEq, pCB, pComma, pNL, pOB, kOdd6, lCB, lEq, lOB, lComma } from 'aoc-util'

export type Input = [string, [string, string, string][]] 

const lexer: Lexer<TK> = buildLexer([ lWord, lColon, lWS, lEq, lOB, lCB, lNL, lComma ])

const parser: Parser<TK, Input> = seq(
    kleft(pWord, rep(pNL)),
    rep(kOdd6(pWord, seq(pEq, pOB), pWord, pComma, pWord, seq(pCB, rep(pNL))))
)

export const data: Data<Input> = new Data(lexer, parser, import.meta.dir)
