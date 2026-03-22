import { describe, it, expect } from 'vitest';
import { expandBracket } from './expand-bracket.ts';
import { createNumericTerm, createVariableTerm, createBracketTerm } from '../term.ts';
import { fromInteger } from '../fraction.ts';
import type { Equation } from '../../types/equation.ts';

describe('expandBracket', () => {
  it('expands 2(3x - 4) into 6x - 8', () => {
    const inner1 = createVariableTerm(fromInteger(3), { kind: 'integer' }, 'x', '+', 'left');
    const inner2 = createNumericTerm(fromInteger(4), { kind: 'integer' }, '-', 'left');
    const bracket = createBracketTerm(
      fromInteger(2), { kind: 'integer' }, false, undefined,
      [inner1, inner2], '+', 'left',
    );
    const eq: Equation = {
      left: { terms: [bracket] },
      right: { terms: [createNumericTerm(fromInteger(0), { kind: 'integer' }, '+', 'right')] },
    };

    const result = expandBracket(eq, bracket.id);
    expect(result.left.terms).toHaveLength(2);
    expect(result.left.terms[0].kind).toBe('variable');
    if (result.left.terms[0].kind === 'variable') {
      expect(result.left.terms[0].coefficient).toEqual({ numerator: 6, denominator: 1 });
      expect(result.left.terms[0].sign).toBe('+');
    }
    expect(result.left.terms[1].kind).toBe('numeric');
    if (result.left.terms[1].kind === 'numeric') {
      expect(result.left.terms[1].value).toEqual({ numerator: 8, denominator: 1 });
      expect(result.left.terms[1].sign).toBe('-');
    }
  });

  it('expands -(2x + 3) into -2x - 3', () => {
    const inner1 = createVariableTerm(fromInteger(2), { kind: 'integer' }, 'x', '+', 'left');
    const inner2 = createNumericTerm(fromInteger(3), { kind: 'integer' }, '+', 'left');
    const bracket = createBracketTerm(
      fromInteger(1), { kind: 'integer' }, false, undefined,
      [inner1, inner2], '-', 'left',
    );
    const eq: Equation = {
      left: { terms: [bracket] },
      right: { terms: [createNumericTerm(fromInteger(0), { kind: 'integer' }, '+', 'right')] },
    };

    const result = expandBracket(eq, bracket.id);
    expect(result.left.terms).toHaveLength(2);
    expect(result.left.terms[0].sign).toBe('-');
    expect(result.left.terms[1].sign).toBe('-');
  });

  it('expands -3(-x - 2) into 3x + 6', () => {
    const inner1 = createVariableTerm(fromInteger(1), { kind: 'integer' }, 'x', '-', 'left');
    const inner2 = createNumericTerm(fromInteger(2), { kind: 'integer' }, '-', 'left');
    const bracket = createBracketTerm(
      fromInteger(3), { kind: 'integer' }, false, undefined,
      [inner1, inner2], '-', 'left',
    );
    const eq: Equation = {
      left: { terms: [bracket] },
      right: { terms: [createNumericTerm(fromInteger(0), { kind: 'integer' }, '+', 'right')] },
    };

    const result = expandBracket(eq, bracket.id);
    // -bracket * -inner1 = +, -bracket * -inner2 = +
    // -(3)(-x) = 3x -> sign +, coeff 3
    // -(3)(-2) = 6 -> sign +, value 6
    expect(result.left.terms[0].sign).toBe('+');
    expect(result.left.terms[1].sign).toBe('+');
    if (result.left.terms[0].kind === 'variable') {
      expect(result.left.terms[0].coefficient).toEqual({ numerator: 3, denominator: 1 });
    }
    if (result.left.terms[1].kind === 'numeric') {
      expect(result.left.terms[1].value).toEqual({ numerator: 6, denominator: 1 });
    }
  });

  it('preserves other terms alongside the bracket', () => {
    const standalone = createNumericTerm(fromInteger(5), { kind: 'integer' }, '+', 'left');
    const inner1 = createNumericTerm(fromInteger(2), { kind: 'integer' }, '+', 'left');
    const bracket = createBracketTerm(
      fromInteger(3), { kind: 'integer' }, false, undefined,
      [inner1], '+', 'left',
    );
    const eq: Equation = {
      left: { terms: [standalone, bracket] },
      right: { terms: [createNumericTerm(fromInteger(0), { kind: 'integer' }, '+', 'right')] },
    };

    const result = expandBracket(eq, bracket.id);
    expect(result.left.terms).toHaveLength(2);
    expect(result.left.terms[0].id).toBe(standalone.id);
    if (result.left.terms[1].kind === 'numeric') {
      expect(result.left.terms[1].value).toEqual({ numerator: 6, denominator: 1 });
    }
  });

  it('handles variable multiplier: x(2 + 3) -> 2x + 3x', () => {
    const inner1 = createNumericTerm(fromInteger(2), { kind: 'integer' }, '+', 'left');
    const inner2 = createNumericTerm(fromInteger(3), { kind: 'integer' }, '+', 'left');
    const bracket = createBracketTerm(
      fromInteger(1), { kind: 'integer' }, true, 'x',
      [inner1, inner2], '+', 'left',
    );
    const eq: Equation = {
      left: { terms: [bracket] },
      right: { terms: [createNumericTerm(fromInteger(0), { kind: 'integer' }, '+', 'right')] },
    };

    const result = expandBracket(eq, bracket.id);
    expect(result.left.terms).toHaveLength(2);
    expect(result.left.terms[0].kind).toBe('variable');
    expect(result.left.terms[1].kind).toBe('variable');
  });

  it('handles fraction multiplier', () => {
    const inner1 = createNumericTerm(fromInteger(6), { kind: 'integer' }, '+', 'left');
    const bracket = createBracketTerm(
      { numerator: 1, denominator: 2 }, { kind: 'commonFraction' }, false, undefined,
      [inner1], '+', 'left',
    );
    const eq: Equation = {
      left: { terms: [bracket] },
      right: { terms: [createNumericTerm(fromInteger(0), { kind: 'integer' }, '+', 'right')] },
    };

    const result = expandBracket(eq, bracket.id);
    if (result.left.terms[0].kind === 'numeric') {
      expect(result.left.terms[0].value).toEqual({ numerator: 3, denominator: 1 });
    }
  });
});
