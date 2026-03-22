import { describe, it, expect } from 'vitest';
import {
  gcd, lcm, reduce, fromInteger, fromDecimal,
  add, subtract, multiply, divide, negate, abs,
  isZero, isInteger, equals, compareTo,
  toMixedNumber, toDecimalString, toDisplayString,
  findGCD, parseFraction,
} from './fraction.ts';

describe('gcd', () => {
  it('computes gcd of two positive numbers', () => {
    expect(gcd(12, 8)).toBe(4);
    expect(gcd(7, 13)).toBe(1);
    expect(gcd(100, 25)).toBe(25);
  });

  it('handles zero', () => {
    expect(gcd(0, 5)).toBe(5);
    expect(gcd(5, 0)).toBe(5);
  });

  it('handles negative numbers', () => {
    expect(gcd(-12, 8)).toBe(4);
    expect(gcd(12, -8)).toBe(4);
  });
});

describe('lcm', () => {
  it('computes lcm', () => {
    expect(lcm(3, 4)).toBe(12);
    expect(lcm(6, 4)).toBe(12);
  });

  it('returns 0 when either is 0', () => {
    expect(lcm(0, 5)).toBe(0);
  });
});

describe('reduce', () => {
  it('reduces fractions', () => {
    expect(reduce({ numerator: 6, denominator: 4 })).toEqual({ numerator: 3, denominator: 2 });
    expect(reduce({ numerator: 10, denominator: 5 })).toEqual({ numerator: 2, denominator: 1 });
  });

  it('handles zero numerator', () => {
    expect(reduce({ numerator: 0, denominator: 7 })).toEqual({ numerator: 0, denominator: 1 });
  });

  it('handles negative numerator', () => {
    expect(reduce({ numerator: -6, denominator: 4 })).toEqual({ numerator: -3, denominator: 2 });
  });

  it('already reduced fraction stays the same', () => {
    expect(reduce({ numerator: 3, denominator: 7 })).toEqual({ numerator: 3, denominator: 7 });
  });
});

describe('fromInteger', () => {
  it('creates fraction from integer', () => {
    expect(fromInteger(5)).toEqual({ numerator: 5, denominator: 1 });
    expect(fromInteger(-3)).toEqual({ numerator: -3, denominator: 1 });
    expect(fromInteger(0)).toEqual({ numerator: 0, denominator: 1 });
  });
});

describe('fromDecimal', () => {
  it('converts decimal to fraction', () => {
    expect(fromDecimal(0.5, 1)).toEqual({ numerator: 1, denominator: 2 });
    expect(fromDecimal(0.25, 2)).toEqual({ numerator: 1, denominator: 4 });
    expect(fromDecimal(0.333, 3)).toEqual({ numerator: 333, denominator: 1000 });
  });

  it('handles negative decimals', () => {
    expect(fromDecimal(-0.5, 1)).toEqual({ numerator: -1, denominator: 2 });
  });
});

describe('add', () => {
  it('adds fractions with same denominator', () => {
    expect(add({ numerator: 1, denominator: 4 }, { numerator: 2, denominator: 4 }))
      .toEqual({ numerator: 3, denominator: 4 });
  });

  it('adds fractions with different denominators', () => {
    expect(add({ numerator: 1, denominator: 3 }, { numerator: 1, denominator: 6 }))
      .toEqual({ numerator: 1, denominator: 2 });
  });

  it('adds to zero', () => {
    expect(add({ numerator: 1, denominator: 2 }, { numerator: -1, denominator: 2 }))
      .toEqual({ numerator: 0, denominator: 1 });
  });

  it('adds integers', () => {
    expect(add(fromInteger(3), fromInteger(4))).toEqual({ numerator: 7, denominator: 1 });
  });
});

describe('subtract', () => {
  it('subtracts fractions', () => {
    expect(subtract({ numerator: 1, denominator: 2 }, { numerator: 3, denominator: 4 }))
      .toEqual({ numerator: -1, denominator: 4 });
  });

  it('subtracts equal fractions to zero', () => {
    expect(subtract({ numerator: 2, denominator: 3 }, { numerator: 2, denominator: 3 }))
      .toEqual({ numerator: 0, denominator: 1 });
  });
});

describe('multiply', () => {
  it('multiplies fractions', () => {
    expect(multiply({ numerator: 2, denominator: 3 }, { numerator: 3, denominator: 5 }))
      .toEqual({ numerator: 2, denominator: 5 });
  });

  it('multiplies by zero', () => {
    expect(multiply({ numerator: 5, denominator: 3 }, { numerator: 0, denominator: 1 }))
      .toEqual({ numerator: 0, denominator: 1 });
  });

  it('multiplies negative fractions', () => {
    expect(multiply({ numerator: -2, denominator: 3 }, { numerator: 3, denominator: 4 }))
      .toEqual({ numerator: -1, denominator: 2 });
  });
});

describe('divide', () => {
  it('divides fractions', () => {
    expect(divide({ numerator: 1, denominator: 2 }, { numerator: 3, denominator: 4 }))
      .toEqual({ numerator: 2, denominator: 3 });
  });

  it('throws on division by zero', () => {
    expect(() => divide({ numerator: 1, denominator: 2 }, { numerator: 0, denominator: 1 }))
      .toThrow('Division by zero');
  });

  it('divides by negative fraction', () => {
    expect(divide({ numerator: 1, denominator: 2 }, { numerator: -1, denominator: 3 }))
      .toEqual({ numerator: -3, denominator: 2 });
  });

  it('divides integer by integer', () => {
    expect(divide(fromInteger(6), fromInteger(3))).toEqual({ numerator: 2, denominator: 1 });
  });
});

describe('negate', () => {
  it('negates positive', () => {
    expect(negate({ numerator: 3, denominator: 4 })).toEqual({ numerator: -3, denominator: 4 });
  });

  it('negates negative', () => {
    expect(negate({ numerator: -3, denominator: 4 })).toEqual({ numerator: 3, denominator: 4 });
  });

  it('negates zero', () => {
    expect(negate({ numerator: 0, denominator: 1 })).toEqual({ numerator: 0, denominator: 1 });
  });
});

describe('abs', () => {
  it('returns absolute value', () => {
    expect(abs({ numerator: -3, denominator: 4 })).toEqual({ numerator: 3, denominator: 4 });
    expect(abs({ numerator: 3, denominator: 4 })).toEqual({ numerator: 3, denominator: 4 });
  });
});

describe('isZero', () => {
  it('detects zero', () => {
    expect(isZero({ numerator: 0, denominator: 5 })).toBe(true);
    expect(isZero({ numerator: 1, denominator: 5 })).toBe(false);
  });
});

describe('isInteger', () => {
  it('detects integers', () => {
    expect(isInteger({ numerator: 6, denominator: 3 })).toBe(true);
    expect(isInteger({ numerator: 5, denominator: 1 })).toBe(true);
    expect(isInteger({ numerator: 5, denominator: 3 })).toBe(false);
  });
});

describe('equals', () => {
  it('compares equal fractions', () => {
    expect(equals({ numerator: 1, denominator: 2 }, { numerator: 2, denominator: 4 })).toBe(true);
    expect(equals({ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 3 })).toBe(false);
  });
});

describe('compareTo', () => {
  it('compares fractions', () => {
    expect(compareTo({ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 3 })).toBe(1);
    expect(compareTo({ numerator: 1, denominator: 3 }, { numerator: 1, denominator: 2 })).toBe(-1);
    expect(compareTo({ numerator: 1, denominator: 2 }, { numerator: 2, denominator: 4 })).toBe(0);
  });
});

describe('toMixedNumber', () => {
  it('converts improper fraction', () => {
    expect(toMixedNumber({ numerator: 7, denominator: 4 })).toEqual({
      whole: 1,
      fractionalPart: { numerator: 3, denominator: 4 },
    });
  });

  it('converts proper fraction', () => {
    expect(toMixedNumber({ numerator: 3, denominator: 4 })).toEqual({
      whole: 0,
      fractionalPart: { numerator: 3, denominator: 4 },
    });
  });

  it('converts negative improper fraction', () => {
    expect(toMixedNumber({ numerator: -7, denominator: 4 })).toEqual({
      whole: -1,
      fractionalPart: { numerator: 3, denominator: 4 },
    });
  });

  it('converts integer', () => {
    expect(toMixedNumber({ numerator: 8, denominator: 4 })).toEqual({
      whole: 2,
      fractionalPart: { numerator: 0, denominator: 1 },
    });
  });
});

describe('toDecimalString', () => {
  it('converts to decimal string', () => {
    expect(toDecimalString({ numerator: 1, denominator: 4 }, 2)).toBe('0.25');
    expect(toDecimalString({ numerator: 1, denominator: 3 }, 3)).toBe('0.333');
    expect(toDecimalString({ numerator: 5, denominator: 1 }, 0)).toBe('5');
  });
});

describe('toDisplayString', () => {
  it('formats as integer', () => {
    expect(toDisplayString({ numerator: 5, denominator: 1 }, { kind: 'integer' })).toBe('5');
    expect(toDisplayString({ numerator: -3, denominator: 1 }, { kind: 'integer' })).toBe('-3');
  });

  it('formats as common fraction', () => {
    expect(toDisplayString({ numerator: 3, denominator: 4 }, { kind: 'commonFraction' })).toBe('3/4');
    expect(toDisplayString({ numerator: 6, denominator: 3 }, { kind: 'commonFraction' })).toBe('2');
  });

  it('formats as improper fraction', () => {
    expect(toDisplayString({ numerator: 7, denominator: 4 }, { kind: 'improperFraction' })).toBe('7/4');
  });

  it('formats as mixed number', () => {
    expect(toDisplayString({ numerator: 7, denominator: 4 }, { kind: 'mixedNumber' })).toBe('1 3/4');
    expect(toDisplayString({ numerator: 3, denominator: 4 }, { kind: 'mixedNumber' })).toBe('3/4');
    expect(toDisplayString({ numerator: 4, denominator: 1 }, { kind: 'mixedNumber' })).toBe('4');
  });

  it('formats negative mixed number', () => {
    expect(toDisplayString({ numerator: -7, denominator: 4 }, { kind: 'mixedNumber' })).toBe('-1 3/4');
  });

  it('formats as decimal', () => {
    expect(toDisplayString({ numerator: 1, denominator: 4 }, { kind: 'decimal', precision: 2 })).toBe('0.25');
  });
});

describe('findGCD', () => {
  it('finds GCD of integer fractions', () => {
    const result = findGCD([fromInteger(6), fromInteger(4), fromInteger(10)]);
    expect(result).toEqual({ numerator: 2, denominator: 1 });
  });

  it('finds GCD of fractions with different denominators', () => {
    const result = findGCD([
      { numerator: 1, denominator: 2 },
      { numerator: 1, denominator: 3 },
    ]);
    // gcd(1,1)/lcm(2,3) = 1/6
    expect(result).toEqual({ numerator: 1, denominator: 6 });
  });

  it('returns 1 for empty array', () => {
    expect(findGCD([])).toEqual({ numerator: 1, denominator: 1 });
  });

  it('handles single element', () => {
    expect(findGCD([{ numerator: 3, denominator: 4 }])).toEqual({ numerator: 3, denominator: 4 });
  });
});

describe('parseFraction', () => {
  it('parses integers', () => {
    expect(parseFraction('5')).toEqual({ numerator: 5, denominator: 1 });
    expect(parseFraction('-3')).toEqual({ numerator: -3, denominator: 1 });
  });

  it('parses fractions', () => {
    expect(parseFraction('3/4')).toEqual({ numerator: 3, denominator: 4 });
    expect(parseFraction('-1/2')).toEqual({ numerator: -1, denominator: 2 });
  });

  it('parses mixed numbers', () => {
    expect(parseFraction('1 3/4')).toEqual({ numerator: 7, denominator: 4 });
    expect(parseFraction('-2 1/3')).toEqual({ numerator: -7, denominator: 3 });
  });

  it('parses decimals', () => {
    expect(parseFraction('0.5')).toEqual({ numerator: 1, denominator: 2 });
    expect(parseFraction('0.25')).toEqual({ numerator: 1, denominator: 4 });
  });

  it('returns null for invalid input', () => {
    expect(parseFraction('')).toBeNull();
    expect(parseFraction('abc')).toBeNull();
    expect(parseFraction('1/0')).toBeNull();
  });

  it('reduces parsed fractions', () => {
    expect(parseFraction('6/4')).toEqual({ numerator: 3, denominator: 2 });
  });
});
