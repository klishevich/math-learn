import { describe, it, expect } from 'vitest';
import { groupTerms } from './group-sum.ts';
import { createNumericTerm, createVariableTerm, createZeroTerm } from '../term.ts';
import { fromInteger } from '../fraction.ts';
import type { Equation } from '../../types/equation.ts';

describe('groupTerms', () => {
  it('sums two numeric terms: 3 + 5 = 8', () => {
    const n1 = createNumericTerm(fromInteger(3), { kind: 'integer' }, '+', 'left');
    const n2 = createNumericTerm(fromInteger(5), { kind: 'integer' }, '+', 'left');
    const eq: Equation = {
      left: { terms: [n1, n2] },
      right: { terms: [createZeroTerm('right')] },
    };

    const result = groupTerms(eq, [n1.id, n2.id]);
    expect(result.left.terms).toHaveLength(1);
    if (result.left.terms[0].kind === 'numeric') {
      expect(result.left.terms[0].value).toEqual({ numerator: 8, denominator: 1 });
      expect(result.left.terms[0].sign).toBe('+');
    }
  });

  it('sums with negative: 3 - 5 = -2', () => {
    const n1 = createNumericTerm(fromInteger(3), { kind: 'integer' }, '+', 'left');
    const n2 = createNumericTerm(fromInteger(5), { kind: 'integer' }, '-', 'left');
    const eq: Equation = {
      left: { terms: [n1, n2] },
      right: { terms: [createZeroTerm('right')] },
    };

    const result = groupTerms(eq, [n1.id, n2.id]);
    expect(result.left.terms).toHaveLength(1);
    if (result.left.terms[0].kind === 'numeric') {
      expect(result.left.terms[0].value).toEqual({ numerator: 2, denominator: 1 });
      expect(result.left.terms[0].sign).toBe('-');
    }
  });

  it('sums variable terms: 3x + 5x = 8x', () => {
    const v1 = createVariableTerm(fromInteger(3), { kind: 'integer' }, 'x', '+', 'left');
    const v2 = createVariableTerm(fromInteger(5), { kind: 'integer' }, 'x', '+', 'left');
    const eq: Equation = {
      left: { terms: [v1, v2] },
      right: { terms: [createZeroTerm('right')] },
    };

    const result = groupTerms(eq, [v1.id, v2.id]);
    expect(result.left.terms).toHaveLength(1);
    if (result.left.terms[0].kind === 'variable') {
      expect(result.left.terms[0].coefficient).toEqual({ numerator: 8, denominator: 1 });
      expect(result.left.terms[0].sign).toBe('+');
    }
  });

  it('sums fractions: 1/2 + 1/3 = 5/6', () => {
    const n1 = createNumericTerm({ numerator: 1, denominator: 2 }, { kind: 'commonFraction' }, '+', 'left');
    const n2 = createNumericTerm({ numerator: 1, denominator: 3 }, { kind: 'commonFraction' }, '+', 'left');
    const eq: Equation = {
      left: { terms: [n1, n2] },
      right: { terms: [createZeroTerm('right')] },
    };

    const result = groupTerms(eq, [n1.id, n2.id]);
    if (result.left.terms[0].kind === 'numeric') {
      expect(result.left.terms[0].value).toEqual({ numerator: 5, denominator: 6 });
    }
  });

  it('sums to zero: 3 - 3 = 0 (only terms on side)', () => {
    const n1 = createNumericTerm(fromInteger(3), { kind: 'integer' }, '+', 'left');
    const n2 = createNumericTerm(fromInteger(3), { kind: 'integer' }, '-', 'left');
    const eq: Equation = {
      left: { terms: [n1, n2] },
      right: { terms: [createZeroTerm('right')] },
    };

    const result = groupTerms(eq, [n1.id, n2.id]);
    expect(result.left.terms).toHaveLength(1);
    if (result.left.terms[0].kind === 'numeric') {
      expect(result.left.terms[0].value).toEqual({ numerator: 0, denominator: 1 });
    }
  });

  it('sums to zero: removes term when other terms remain', () => {
    const n1 = createNumericTerm(fromInteger(3), { kind: 'integer' }, '+', 'left');
    const n2 = createNumericTerm(fromInteger(3), { kind: 'integer' }, '-', 'left');
    const v1 = createVariableTerm(fromInteger(2), { kind: 'integer' }, 'x', '+', 'left');
    const eq: Equation = {
      left: { terms: [n1, n2, v1] },
      right: { terms: [createZeroTerm('right')] },
    };

    const result = groupTerms(eq, [n1.id, n2.id]);
    expect(result.left.terms).toHaveLength(1);
    expect(result.left.terms[0].id).toBe(v1.id);
  });

  it('preserves non-selected terms', () => {
    const n1 = createNumericTerm(fromInteger(1), { kind: 'integer' }, '+', 'left');
    const n2 = createNumericTerm(fromInteger(2), { kind: 'integer' }, '+', 'left');
    const v1 = createVariableTerm(fromInteger(3), { kind: 'integer' }, 'x', '+', 'left');
    const eq: Equation = {
      left: { terms: [n1, n2, v1] },
      right: { terms: [createZeroTerm('right')] },
    };

    const result = groupTerms(eq, [n1.id, n2.id]);
    expect(result.left.terms).toHaveLength(2);
    // First term should be the sum (3), second should be v1
    if (result.left.terms[0].kind === 'numeric') {
      expect(result.left.terms[0].value).toEqual({ numerator: 3, denominator: 1 });
    }
    expect(result.left.terms[1].id).toBe(v1.id);
  });
});
