import { describe, it, expect } from 'vitest';
import { multiplyEquation, divideEquation } from './multiply-divide.ts';
import { createNumericTerm, createVariableTerm, createBracketTerm } from '../term.ts';
import { fromInteger } from '../fraction.ts';
import type { Equation } from '../../types/equation.ts';

describe('multiplyEquation', () => {
  it('multiplies x + 2 = 3 by 2 -> 2x + 4 = 6', () => {
    const v1 = createVariableTerm(fromInteger(1), { kind: 'integer' }, 'x', '+', 'left');
    const n1 = createNumericTerm(fromInteger(2), { kind: 'integer' }, '+', 'left');
    const n2 = createNumericTerm(fromInteger(3), { kind: 'integer' }, '+', 'right');
    const eq: Equation = {
      left: { terms: [v1, n1] },
      right: { terms: [n2] },
    };

    const result = multiplyEquation(eq, fromInteger(2));

    if (result.left.terms[0].kind === 'variable') {
      expect(result.left.terms[0].coefficient).toEqual({ numerator: 2, denominator: 1 });
    }
    if (result.left.terms[1].kind === 'numeric') {
      expect(result.left.terms[1].value).toEqual({ numerator: 4, denominator: 1 });
    }
    if (result.right.terms[0].kind === 'numeric') {
      expect(result.right.terms[0].value).toEqual({ numerator: 6, denominator: 1 });
    }
  });

  it('multiplies by negative flips signs', () => {
    const n1 = createNumericTerm(fromInteger(3), { kind: 'integer' }, '+', 'left');
    const n2 = createNumericTerm(fromInteger(5), { kind: 'integer' }, '+', 'right');
    const eq: Equation = {
      left: { terms: [n1] },
      right: { terms: [n2] },
    };

    const result = multiplyEquation(eq, fromInteger(-2));
    expect(result.left.terms[0].sign).toBe('-');
    expect(result.right.terms[0].sign).toBe('-');
    if (result.left.terms[0].kind === 'numeric') {
      expect(result.left.terms[0].value).toEqual({ numerator: 6, denominator: 1 });
    }
  });

  it('multiplies bracket term by updating multiplier', () => {
    const inner = createNumericTerm(fromInteger(2), { kind: 'integer' }, '+', 'left');
    const bracket = createBracketTerm(
      fromInteger(3), { kind: 'integer' }, false, undefined,
      [inner], '+', 'left',
    );
    const eq: Equation = {
      left: { terms: [bracket] },
      right: { terms: [createNumericTerm(fromInteger(6), { kind: 'integer' }, '+', 'right')] },
    };

    const result = multiplyEquation(eq, fromInteger(2));
    if (result.left.terms[0].kind === 'bracket') {
      expect(result.left.terms[0].multiplier).toEqual({ numerator: 6, denominator: 1 });
    }
  });

  it('multiplies by fraction', () => {
    const n1 = createNumericTerm(fromInteger(6), { kind: 'integer' }, '+', 'left');
    const eq: Equation = {
      left: { terms: [n1] },
      right: { terms: [createNumericTerm(fromInteger(3), { kind: 'integer' }, '+', 'right')] },
    };

    const result = multiplyEquation(eq, { numerator: 1, denominator: 2 });
    if (result.left.terms[0].kind === 'numeric') {
      expect(result.left.terms[0].value).toEqual({ numerator: 3, denominator: 1 });
    }
  });

  it('throws on multiply by zero', () => {
    const eq: Equation = {
      left: { terms: [createNumericTerm(fromInteger(1), { kind: 'integer' }, '+', 'left')] },
      right: { terms: [createNumericTerm(fromInteger(1), { kind: 'integer' }, '+', 'right')] },
    };
    expect(() => multiplyEquation(eq, fromInteger(0))).toThrow();
  });
});

describe('divideEquation', () => {
  it('divides 6x + 4 = 2 by 2 -> 3x + 2 = 1', () => {
    const v1 = createVariableTerm(fromInteger(6), { kind: 'integer' }, 'x', '+', 'left');
    const n1 = createNumericTerm(fromInteger(4), { kind: 'integer' }, '+', 'left');
    const n2 = createNumericTerm(fromInteger(2), { kind: 'integer' }, '+', 'right');
    const eq: Equation = {
      left: { terms: [v1, n1] },
      right: { terms: [n2] },
    };

    const result = divideEquation(eq, fromInteger(2));
    if (result.left.terms[0].kind === 'variable') {
      expect(result.left.terms[0].coefficient).toEqual({ numerator: 3, denominator: 1 });
    }
    if (result.left.terms[1].kind === 'numeric') {
      expect(result.left.terms[1].value).toEqual({ numerator: 2, denominator: 1 });
    }
    if (result.right.terms[0].kind === 'numeric') {
      expect(result.right.terms[0].value).toEqual({ numerator: 1, denominator: 1 });
    }
  });

  it('throws on divide by zero', () => {
    const eq: Equation = {
      left: { terms: [createNumericTerm(fromInteger(1), { kind: 'integer' }, '+', 'left')] },
      right: { terms: [createNumericTerm(fromInteger(1), { kind: 'integer' }, '+', 'right')] },
    };
    expect(() => divideEquation(eq, fromInteger(0))).toThrow();
  });
});
