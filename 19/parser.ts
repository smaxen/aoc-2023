
import _ from 'lodash';
import {alt, apply, buildLexer, kleft, kmid, kright, Lexer, list_sc, Parser, rep, seq} from 'typescript-parsec';
import { TK, lNL, Data, lInt, pComma, pInt, lComma, pNL, lWord, pWord, lEq, lColon, lOC, lCC, lGT, lLT, pOC, pGT, pLT, pCC, pColon, pEq, kOdd3 } from 'aoc-util'

export type Category = "x"|"m"|"a"|"s"
export type Op = ">"|"<"
export type Rule = [ Category, Op, number, string ]
export type Workflow = [string, Rule[], string]
export type Part = Map<Category, number>
export type Input = [Workflow[], Part[]]

const lexer: Lexer<TK> = buildLexer([ lInt, lWord, lColon, lOC, lCC, lComma, lGT, lLT, lEq, lNL ])

const pRule: Parser<TK, Rule> = seq(pWord, apply(alt(pGT, pLT), t => t.text), pInt, kright(pColon, pWord)) as Parser<TK, Rule>

const pWorkflow: Parser<TK, Workflow> = seq(kleft(pWord, pOC), list_sc(pRule, pComma), kmid(pComma, pWord, pCC))

const pPart: Parser<TK, Part> = apply(kmid(pOC, list_sc(kOdd3(pWord, pEq, pInt), pComma), pCC), x => new Map(x) as Part)

const parser: Parser<TK, Input> = kOdd3(rep(kleft(pWorkflow, pNL)), pNL, rep(kleft(pPart, pNL)))

export const data: Data<Input> = new Data(lexer, parser, import.meta.dir)

