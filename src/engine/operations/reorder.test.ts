import { describe, it, expect } from 'vitest';
import { reorderTerm } from './reorder.ts';
import { createNumericTerm, createVariableTerm } from '../term.ts';
import { fromInteger } from '../fraction.ts';
import type { Equation } from '../../types/equation.ts';

describe('reorderTerm', () => {
  it('reorders within same side (no sign change)', () => {
    const n1 = createNumericTerm(fromInteger(1), { kind: 'integer' }, '+', 'left');
    const n2 = createNumericTerm(fromInteger(2), { kind: 'integer' }, '-', 'left');
    const n3 = createNumericTerm(fromInteger(3), { kind: 'integer' }, '+', 'left');
    const eq: Equation = {
      left: { terms: [n1, n2, n3] },
      right: { terms: [createNumericTerm(fromInteger(0), { kind: 'integer' }, '+', 'right')] },
    };

    // Move n3 to position 0
    const result = reorderTerm(eq, n3.id, 'left', 0);
    expect(result.left.terms[0].id).toBe(n3.id);
    expect(result.left.terms[0].sign).toBe('+'); // unchanged
    expect(result.left.terms).toHaveLength(3);
  });

  it('moves term across equals sign (negates sign)', () => {
    const n1 = createNumericTerm(fromInteger(5), { kind: 'integer' }, '+', 'left');
    const n2 = createNumericTerm(fromInteger(3), { kind: 'integer' }, '+', 'right');
    const eq: Equation = {
      left: { terms: [n1] },
      right: { terms: [n2] },
    };

    // Move n1 from left to right
    const result = reorderTerm(eq, n1.id, 'right', 0);
    expect(result.left.terms).toHaveLength(0);
    expect(result.right.terms).toHaveLength(2);
    expect(result.right.terms[0].sign).toBe('-'); // negated
    expect(result.right.terms[0].side).toBe('right');
  });

  it('negates minus sign to plus when crossing', () => {
    const n1 = createNumericTerm(fromInteger(5), { kind: 'integer' }, '-', 'left');
    const n2 = createNumericTerm(fromInteger(3), { kind: 'integer' }, '+', 'right');
    const eq: Equation = {
      left: { terms: [n1] },
      right: { terms: [n2] },
    };

    const result = reorderTerm(eq, n1.id, 'right', 1);
    expect(result.right.terms[1].sign).toBe('+'); // - becomes +
  });

  it('preserves term data when reordering', () => {
    const v1 = createVariableTerm(fromInteger(3), { kind: 'integer' }, 'x', '+', 'left');
    const n1 = createNumericTerm(fromInteger(2), { kind: 'integer' }, '+', 'left');
    const eq: Equation = {
      left: { terms: [v1, n1] },
      right: { terms: [createNumericTerm(fromInteger(0), { kind: 'integer' }, '+', 'right')] },
    };

    const result = reorderTerm(eq, v1.id, 'left', 1);
    expect(result.left.terms[0].id).toBe(n1.id);
    expect(result.left.terms[1].id).toBe(v1.id);
    if (result.left.terms[1].kind === 'variable') {
      expect(result.left.terms[1].coefficient).toEqual({ numerator: 3, denominator: 1 });
    }
  });

  it('returns equation unchanged if term not found', () => {
    const n1 = createNumericTerm(fromInteger(1), { kind: 'integer' }, '+', 'left');
    const eq: Equation = {
      left: { terms: [n1] },
      right: { terms: [createNumericTerm(fromInteger(0), { kind: 'integer' }, '+', 'right')] },
    };

    const result = reorderTerm(eq, 'nonexistent', 'right', 0);
    expect(result.left.terms).toHaveLength(1);
    expect(result.right.terms).toHaveLength(1);
  });
});
