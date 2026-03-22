import { v4 as uuidv4 } from 'uuid';
import type { Fraction, DisplayFormat } from '../types/fraction.ts';
import type { Sign, Side, NumericTerm, VariableTerm, BracketTerm, Term, FlatTerm } from '../types/term.ts';
import * as frac from './fraction.ts';

export function createNumericTerm(
  value: Fraction,
  displayFormat: DisplayFormat,
  sign: Sign,
  side: Side,
): NumericTerm {
  return { id: uuidv4(), kind: 'numeric', value, displayFormat, sign, side };
}

export function createVariableTerm(
  coefficient: Fraction,
  coefficientDisplayFormat: DisplayFormat,
  symbol: string,
  sign: Sign,
  side: Side,
): VariableTerm {
  return { id: uuidv4(), kind: 'variable', coefficient, coefficientDisplayFormat, symbol, sign, side };
}

export function createBracketTerm(
  multiplier: Fraction,
  multiplierDisplayFormat: DisplayFormat,
  multiplierIsVariable: boolean,
  multiplierSymbol: string | undefined,
  innerTerms: FlatTerm[],
  sign: Sign,
  side: Side,
): BracketTerm {
  return {
    id: uuidv4(),
    kind: 'bracket',
    multiplier,
    multiplierDisplayFormat,
    multiplierIsVariable,
    multiplierSymbol,
    innerTerms,
    sign,
    side,
  };
}

export function createZeroTerm(side: Side): NumericTerm {
  return createNumericTerm(frac.fromInteger(0), { kind: 'integer' }, '+', side);
}

export function negateTerm<T extends Term>(term: T): T {
  return { ...term, sign: term.sign === '+' ? '-' : '+' } as T;
}

export function getEffectiveValue(term: FlatTerm): Fraction {
  const value = term.kind === 'numeric' ? term.value : term.coefficient;
  return term.sign === '-' ? frac.negate(value) : value;
}

export function areTermsSameKind(terms: Term[]): boolean {
  if (terms.length === 0) return true;
  const firstKind = terms[0].kind === 'bracket' ? null : terms[0].kind;
  if (firstKind === null) return false; // brackets can't be grouped
  return terms.every(t => t.kind === firstKind);
}

export function getTermDisplayValue(term: FlatTerm): Fraction {
  return term.kind === 'numeric' ? term.value : term.coefficient;
}

export function getTermDisplayFormat(term: FlatTerm): DisplayFormat {
  return term.kind === 'numeric' ? term.displayFormat : term.coefficientDisplayFormat;
}
