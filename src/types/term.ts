import type { Fraction, DisplayFormat } from './fraction.ts';

export type Sign = '+' | '-';
export type Side = 'left' | 'right';

interface TermBase {
  id: string;
  sign: Sign;
  side: Side;
}

export interface NumericTerm extends TermBase {
  kind: 'numeric';
  value: Fraction;
  displayFormat: DisplayFormat;
}

export interface VariableTerm extends TermBase {
  kind: 'variable';
  coefficient: Fraction;
  coefficientDisplayFormat: DisplayFormat;
  symbol: string;
}

export interface BracketTerm extends TermBase {
  kind: 'bracket';
  multiplier: Fraction;
  multiplierDisplayFormat: DisplayFormat;
  multiplierIsVariable: boolean;
  multiplierSymbol?: string;
  innerTerms: (NumericTerm | VariableTerm)[];
}

export type Term = NumericTerm | VariableTerm | BracketTerm;
export type FlatTerm = NumericTerm | VariableTerm;
