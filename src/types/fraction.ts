export interface Fraction {
  numerator: number;
  denominator: number; // always positive, >= 1
}

export type DisplayFormat =
  | { kind: 'integer' }
  | { kind: 'commonFraction' }
  | { kind: 'improperFraction' }
  | { kind: 'mixedNumber' }
  | { kind: 'decimal'; precision: number };
