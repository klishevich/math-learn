import { describe, it, expect } from 'vitest';
import { expandBracket } from './expand-bracket.ts';
import { createNumericTerm, createVariableTerm, createBracketTerm } from '../term.ts';
import { fromInteger, fromDecimal } from '../fraction.ts';
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

  it('decimal multiplier produces decimal results: 5.3(12x + 17 - 3x)', () => {
    const decFmt = { kind: 'decimal' as const, precision: 1 };
    const intFmt = { kind: 'integer' as const };
    const inner1 = createVariableTerm(fromInteger(12), intFmt, 'x', '+', 'left');
    const inner2 = createNumericTerm(fromInteger(17), intFmt, '+', 'left');
    const inner3 = createVariableTerm(fromInteger(3), intFmt, 'x', '-', 'left');
    const bracket = createBracketTerm(
      fromDecimal(5.3, 1), decFmt, false, undefined,
      [inner1, inner2, inner3], '+', 'left',
    );
    const eq: Equation = {
      left: { terms: [bracket] },
      right: { terms: [createNumericTerm(fromInteger(0), { kind: 'integer' }, '+', 'right')] },
    };

    const result = expandBracket(eq, bracket.id);
    expect(result.left.terms).toHaveLength(3);

    // 5.3 * 12x = 63.6x (decimal)
    const t0 = result.left.terms[0];
    expect(t0.kind).toBe('variable');
    if (t0.kind === 'variable') {
      expect(t0.coefficient).toEqual({ numerator: 318, denominator: 5 });
      expect(t0.coefficientDisplayFormat).toEqual({ kind: 'decimal', precision: 1 });
    }

    // 5.3 * 17 = 90.1 (decimal)
    const t1 = result.left.terms[1];
    expect(t1.kind).toBe('numeric');
    if (t1.kind === 'numeric') {
      expect(t1.value).toEqual({ numerator: 901, denominator: 10 });
      expect(t1.displayFormat).toEqual({ kind: 'decimal', precision: 1 });
    }

    // 5.3 * 3x = 15.9x (decimal)
    const t2 = result.left.terms[2];
    expect(t2.kind).toBe('variable');
    if (t2.kind === 'variable') {
      expect(t2.coefficient).toEqual({ numerator: 159, denominator: 10 });
      expect(t2.coefficientDisplayFormat).toEqual({ kind: 'decimal', precision: 1 });
    }
  });

  it('decimal * decimal produces decimal with summed precision: 0.5(0.3)', () => {
    const dec1 = { kind: 'decimal' as const, precision: 1 };
    const inner1 = createNumericTerm(fromDecimal(0.3, 1), dec1, '+', 'left');
    const bracket = createBracketTerm(
      fromDecimal(0.5, 1), dec1, false, undefined,
      [inner1], '+', 'left',
    );
    const eq: Equation = {
      left: { terms: [bracket] },
      right: { terms: [createNumericTerm(fromInteger(0), { kind: 'integer' }, '+', 'right')] },
    };

    const result = expandBracket(eq, bracket.id);
    const t0 = result.left.terms[0];
    expect(t0.kind).toBe('numeric');
    if (t0.kind === 'numeric') {
      // 0.5 * 0.3 = 0.15
      expect(t0.value).toEqual({ numerator: 3, denominator: 20 });
      expect(t0.displayFormat).toEqual({ kind: 'decimal', precision: 2 });
    }
  });

  it('fraction multiplier with integer inner stays non-decimal', () => {
    const inner1 = createNumericTerm(fromInteger(4), { kind: 'integer' }, '+', 'left');
    const bracket = createBracketTerm(
      { numerator: 1, denominator: 3 }, { kind: 'commonFraction' }, false, undefined,
      [inner1], '+', 'left',
    );
    const eq: Equation = {
      left: { terms: [bracket] },
      right: { terms: [createNumericTerm(fromInteger(0), { kind: 'integer' }, '+', 'right')] },
    };

    const result = expandBracket(eq, bracket.id);
    if (result.left.terms[0].kind === 'numeric') {
      expect(result.left.terms[0].displayFormat).toEqual({ kind: 'commonFraction' });
    }
  });
});
