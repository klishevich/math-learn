import { describe, it, expect } from 'vitest';
import {
  createNumericTerm, createVariableTerm, createBracketTerm, createZeroTerm,
  negateTerm, getEffectiveValue, areTermsSameKind,
} from './term.ts';
import { fromInteger } from './fraction.ts';

describe('createNumericTerm', () => {
  it('creates a numeric term with all properties', () => {
    const term = createNumericTerm({ numerator: 3, denominator: 4 }, { kind: 'commonFraction' }, '+', 'left');
    expect(term.kind).toBe('numeric');
    expect(term.value).toEqual({ numerator: 3, denominator: 4 });
    expect(term.displayFormat).toEqual({ kind: 'commonFraction' });
    expect(term.sign).toBe('+');
    expect(term.side).toBe('left');
    expect(term.id).toBeTruthy();
  });
});

describe('createVariableTerm', () => {
  it('creates a variable term', () => {
    const term = createVariableTerm(fromInteger(3), { kind: 'integer' }, 'x', '-', 'right');
    expect(term.kind).toBe('variable');
    expect(term.coefficient).toEqual({ numerator: 3, denominator: 1 });
    expect(term.symbol).toBe('x');
    expect(term.sign).toBe('-');
    expect(term.side).toBe('right');
  });
});

describe('createBracketTerm', () => {
  it('creates a bracket term with inner terms', () => {
    const inner1 = createNumericTerm(fromInteger(2), { kind: 'integer' }, '+', 'left');
    const inner2 = createVariableTerm(fromInteger(3), { kind: 'integer' }, 'x', '-', 'left');
    const bracket = createBracketTerm(
      fromInteger(2), { kind: 'integer' }, false, undefined,
      [inner1, inner2], '+', 'left',
    );
    expect(bracket.kind).toBe('bracket');
    expect(bracket.multiplier).toEqual({ numerator: 2, denominator: 1 });
    expect(bracket.innerTerms).toHaveLength(2);
  });
});

describe('createZeroTerm', () => {
  it('creates a zero term', () => {
    const term = createZeroTerm('right');
    expect(term.kind).toBe('numeric');
    expect(term.value).toEqual({ numerator: 0, denominator: 1 });
    expect(term.sign).toBe('+');
    expect(term.side).toBe('right');
  });
});

describe('negateTerm', () => {
  it('flips + to -', () => {
    const term = createNumericTerm(fromInteger(5), { kind: 'integer' }, '+', 'left');
    const negated = negateTerm(term);
    expect(negated.sign).toBe('-');
    expect(negated.value).toEqual(term.value); // value unchanged
  });

  it('flips - to +', () => {
    const term = createNumericTerm(fromInteger(5), { kind: 'integer' }, '-', 'left');
    const negated = negateTerm(term);
    expect(negated.sign).toBe('+');
  });
});

describe('getEffectiveValue', () => {
  it('returns positive value for + sign', () => {
    const term = createNumericTerm(fromInteger(5), { kind: 'integer' }, '+', 'left');
    expect(getEffectiveValue(term)).toEqual({ numerator: 5, denominator: 1 });
  });

  it('returns negated value for - sign', () => {
    const term = createNumericTerm(fromInteger(5), { kind: 'integer' }, '-', 'left');
    expect(getEffectiveValue(term)).toEqual({ numerator: -5, denominator: 1 });
  });

  it('works with variable terms', () => {
    const term = createVariableTerm({ numerator: 3, denominator: 4 }, { kind: 'commonFraction' }, 'x', '-', 'left');
    expect(getEffectiveValue(term)).toEqual({ numerator: -3, denominator: 4 });
  });
});

describe('areTermsSameKind', () => {
  it('returns true for all numeric terms', () => {
    const terms = [
      createNumericTerm(fromInteger(1), { kind: 'integer' }, '+', 'left'),
      createNumericTerm(fromInteger(2), { kind: 'integer' }, '+', 'left'),
    ];
    expect(areTermsSameKind(terms)).toBe(true);
  });

  it('returns true for all variable terms', () => {
    const terms = [
      createVariableTerm(fromInteger(1), { kind: 'integer' }, 'x', '+', 'left'),
      createVariableTerm(fromInteger(2), { kind: 'integer' }, 'x', '+', 'left'),
    ];
    expect(areTermsSameKind(terms)).toBe(true);
  });

  it('returns false for mixed kinds', () => {
    const terms = [
      createNumericTerm(fromInteger(1), { kind: 'integer' }, '+', 'left'),
      createVariableTerm(fromInteger(2), { kind: 'integer' }, 'x', '+', 'left'),
    ];
    expect(areTermsSameKind(terms)).toBe(false);
  });

  it('returns false when bracket term is included', () => {
    const bracket = createBracketTerm(
      fromInteger(2), { kind: 'integer' }, false, undefined,
      [createNumericTerm(fromInteger(1), { kind: 'integer' }, '+', 'left')],
      '+', 'left',
    );
    expect(areTermsSameKind([bracket])).toBe(false);
  });

  it('returns true for empty array', () => {
    expect(areTermsSameKind([])).toBe(true);
  });
});
