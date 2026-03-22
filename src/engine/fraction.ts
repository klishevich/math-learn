import type { Fraction, DisplayFormat } from '../types/fraction.ts';

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

export function reduce(f: Fraction): Fraction {
  if (f.numerator === 0) return { numerator: 0, denominator: 1 };
  const g = gcd(Math.abs(f.numerator), f.denominator);
  return {
    numerator: f.numerator / g,
    denominator: f.denominator / g,
  };
}

export function fromInteger(n: number): Fraction {
  return { numerator: n, denominator: 1 };
}

export function fromDecimal(d: number, precision: number): Fraction {
  const factor = Math.pow(10, precision);
  const numerator = Math.round(d * factor);
  return reduce({ numerator, denominator: factor });
}

export function add(a: Fraction, b: Fraction): Fraction {
  return reduce({
    numerator: a.numerator * b.denominator + b.numerator * a.denominator,
    denominator: a.denominator * b.denominator,
  });
}

export function subtract(a: Fraction, b: Fraction): Fraction {
  return reduce({
    numerator: a.numerator * b.denominator - b.numerator * a.denominator,
    denominator: a.denominator * b.denominator,
  });
}

export function multiply(a: Fraction, b: Fraction): Fraction {
  return reduce({
    numerator: a.numerator * b.numerator,
    denominator: a.denominator * b.denominator,
  });
}

export function divide(a: Fraction, b: Fraction): Fraction {
  if (b.numerator === 0) throw new Error('Division by zero');
  // a/b ÷ c/d = a/b × d/c
  // Ensure denominator is positive
  const sign = b.numerator < 0 ? -1 : 1;
  return reduce({
    numerator: a.numerator * b.denominator * sign,
    denominator: a.denominator * Math.abs(b.numerator),
  });
}

export function negate(f: Fraction): Fraction {
  return { numerator: f.numerator === 0 ? 0 : -f.numerator, denominator: f.denominator };
}

export function abs(f: Fraction): Fraction {
  return { numerator: Math.abs(f.numerator), denominator: f.denominator };
}

export function isZero(f: Fraction): boolean {
  return f.numerator === 0;
}

export function isInteger(f: Fraction): boolean {
  return reduce(f).denominator === 1;
}

export function equals(a: Fraction, b: Fraction): boolean {
  const ra = reduce(a);
  const rb = reduce(b);
  return ra.numerator === rb.numerator && ra.denominator === rb.denominator;
}

export function compareTo(a: Fraction, b: Fraction): -1 | 0 | 1 {
  const diff = a.numerator * b.denominator - b.numerator * a.denominator;
  if (diff < 0) return -1;
  if (diff > 0) return 1;
  return 0;
}

export function toMixedNumber(f: Fraction): { whole: number; fractionalPart: Fraction } {
  const r = reduce(f);
  const whole = Math.trunc(r.numerator / r.denominator);
  const remainder = Math.abs(r.numerator) % r.denominator;
  return {
    whole,
    fractionalPart: { numerator: remainder, denominator: r.denominator },
  };
}

export function toDecimalString(f: Fraction, precision: number): string {
  const value = f.numerator / f.denominator;
  return value.toFixed(precision);
}

export function toDisplayString(f: Fraction, format: DisplayFormat): string {
  const r = reduce(f);
  switch (format.kind) {
    case 'integer':
      return `${r.numerator}`;
    case 'commonFraction':
      if (r.denominator === 1) return `${r.numerator}`;
      return `${r.numerator}/${r.denominator}`;
    case 'improperFraction':
      if (r.denominator === 1) return `${r.numerator}`;
      return `${r.numerator}/${r.denominator}`;
    case 'mixedNumber': {
      if (r.denominator === 1) return `${r.numerator}`;
      const { whole, fractionalPart } = toMixedNumber(r);
      if (whole === 0) return `${r.numerator < 0 ? '-' : ''}${fractionalPart.numerator}/${fractionalPart.denominator}`;
      return `${whole} ${fractionalPart.numerator}/${fractionalPart.denominator}`;
    }
    case 'decimal':
      return toDecimalString(r, format.precision);
  }
}

export function findGCD(fractions: Fraction[]): Fraction {
  if (fractions.length === 0) return fromInteger(1);
  let result = abs(fractions[0]);
  for (let i = 1; i < fractions.length; i++) {
    const f = abs(fractions[i]);
    // GCD of two fractions: gcd(a/b, c/d) = gcd(a,c) / lcm(b,d)
    const numGcd = gcd(result.numerator, f.numerator);
    const denLcm = lcm(result.denominator, f.denominator);
    result = reduce({ numerator: numGcd, denominator: denLcm });
  }
  return result;
}

export function parseFraction(input: string): Fraction | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Try integer
  if (/^-?\d+$/.test(trimmed)) {
    return fromInteger(parseInt(trimmed, 10));
  }

  // Try fraction a/b
  const fractionMatch = trimmed.match(/^(-?\d+)\/(\d+)$/);
  if (fractionMatch) {
    const num = parseInt(fractionMatch[1], 10);
    const den = parseInt(fractionMatch[2], 10);
    if (den === 0) return null;
    return reduce({ numerator: num, denominator: den });
  }

  // Try mixed number: a b/c
  const mixedMatch = trimmed.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1], 10);
    const num = parseInt(mixedMatch[2], 10);
    const den = parseInt(mixedMatch[3], 10);
    if (den === 0) return null;
    const sign = whole < 0 ? -1 : 1;
    return reduce({
      numerator: sign * (Math.abs(whole) * den + num),
      denominator: den,
    });
  }

  // Try decimal
  const decimalMatch = trimmed.match(/^-?\d+\.\d+$/);
  if (decimalMatch) {
    const parts = trimmed.split('.');
    const precision = parts[1].length;
    return fromDecimal(parseFloat(trimmed), precision);
  }

  return null;
}
