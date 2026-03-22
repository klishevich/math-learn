import { describe, it, expect } from 'vitest';
import { factorOut } from './factor-out.ts';
import { createNumericTerm, createVariableTerm, createZeroTerm } from '../term.ts';
import { fromInteger } from '../fraction.ts';
import type { Equation } from '../../types/equation.ts';

describe('factorOut', () => {
  it('factors out numeric: 6 + 4 with factor 2 -> 2(3 + 2)', () => {
    const n1 = createNumericTerm(fromInteger(6), { kind: 'integer' }, '+', 'left');
    const n2 = createNumericTerm(fromInteger(4), { kind: 'integer' }, '+', 'left');
    const eq: Equation = {
      left: { terms: [n1, n2] },
      right: { terms: [createZeroTerm('right')] },
    };

    const result = factorOut(eq, [n1.id, n2.id], fromInteger(2), false);
    expect(result.left.terms).toHaveLength(1);
    const bracket = result.left.terms[0];
    expect(bracket.kind).toBe('bracket');
    if (bracket.kind === 'bracket') {
      expect(bracket.multiplier).toEqual({ numerator: 2, denominator: 1 });
      expect(bracket.innerTerms).toHaveLength(2);
      if (bracket.innerTerms[0].kind === 'numeric') {
        expect(bracket.innerTerms[0].value).toEqual({ numerator: 3, denominator: 1 });
        expect(bracket.innerTerms[0].sign).toBe('+');
      }
      if (bracket.innerTerms[1].kind === 'numeric') {
        expect(bracket.innerTerms[1].value).toEqual({ numerator: 2, denominator: 1 });
        expect(bracket.innerTerms[1].sign).toBe('+');
      }
    }
  });

  it('factors out with variable: 6x + 4x with factor 2 -> 2(3x + 2x)', () => {
    const v1 = createVariableTerm(fromInteger(6), { kind: 'integer' }, 'x', '+', 'left');
    const v2 = createVariableTerm(fromInteger(4), { kind: 'integer' }, 'x', '+', 'left');
    const eq: Equation = {
      left: { terms: [v1, v2] },
      right: { terms: [createZeroTerm('right')] },
    };

    const result = factorOut(eq, [v1.id, v2.id], fromInteger(2), false);
    const bracket = result.left.terms[0];
    if (bracket.kind === 'bracket') {
      expect(bracket.innerTerms[0].kind).toBe('variable');
      expect(bracket.innerTerms[1].kind).toBe('variable');
    }
  });

  it('factors out variable: 6x + 4x with factor 2x -> 2x(3 + 2)', () => {
    const v1 = createVariableTerm(fromInteger(6), { kind: 'integer' }, 'x', '+', 'left');
    const v2 = createVariableTerm(fromInteger(4), { kind: 'integer' }, 'x', '+', 'left');
    const eq: Equation = {
      left: { terms: [v1, v2] },
      right: { terms: [createZeroTerm('right')] },
    };

    const result = factorOut(eq, [v1.id, v2.id], fromInteger(2), true, 'x');
    const bracket = result.left.terms[0];
    if (bracket.kind === 'bracket') {
      expect(bracket.multiplierIsVariable).toBe(true);
      expect(bracket.innerTerms[0].kind).toBe('numeric');
      expect(bracket.innerTerms[1].kind).toBe('numeric');
    }
  });

  it('handles negative signs in factored terms', () => {
    const n1 = createNumericTerm(fromInteger(6), { kind: 'integer' }, '+', 'left');
    const n2 = createNumericTerm(fromInteger(4), { kind: 'integer' }, '-', 'left');
    const eq: Equation = {
      left: { terms: [n1, n2] },
      right: { terms: [createZeroTerm('right')] },
    };

    const result = factorOut(eq, [n1.id, n2.id], fromInteger(2), false);
    const bracket = result.left.terms[0];
    if (bracket.kind === 'bracket') {
      expect(bracket.innerTerms[0].sign).toBe('+');
      expect(bracket.innerTerms[1].sign).toBe('-');
    }
  });

  it('preserves other terms', () => {
    const n1 = createNumericTerm(fromInteger(6), { kind: 'integer' }, '+', 'left');
    const n2 = createNumericTerm(fromInteger(4), { kind: 'integer' }, '+', 'left');
    const v1 = createVariableTerm(fromInteger(3), { kind: 'integer' }, 'x', '+', 'left');
    const eq: Equation = {
      left: { terms: [n1, n2, v1] },
      right: { terms: [createZeroTerm('right')] },
    };

    const result = factorOut(eq, [n1.id, n2.id], fromInteger(2), false);
    expect(result.left.terms).toHaveLength(2);
    expect(result.left.terms[0].kind).toBe('bracket');
    expect(result.left.terms[1].id).toBe(v1.id);
  });
});
