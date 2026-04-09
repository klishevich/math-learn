import type { Equation } from '../../types/equation.ts';
import type { DisplayFormat } from '../../types/fraction.ts';
import type { Term } from '../../types/term.ts';
import { reduce } from '../fraction.ts';

function canConvertToDecimal(denominator: number): boolean {
  let d = denominator;
  while (d % 2 === 0) d /= 2;
  while (d % 5 === 0) d /= 5;
  return d === 1;
}

function getDisplayFormat(term: Term): DisplayFormat | null {
  switch (term.kind) {
    case 'numeric': return term.displayFormat;
    case 'variable': return term.coefficientDisplayFormat;
    default: return null;
  }
}

function isDecimalFormat(fmt: DisplayFormat): boolean {
  return fmt.kind === 'decimal';
}

function isFractionFormat(fmt: DisplayFormat): boolean {
  return fmt.kind === 'commonFraction' || fmt.kind === 'improperFraction' || fmt.kind === 'mixedNumber';
}

function getFraction(term: Term) {
  switch (term.kind) {
    case 'numeric': return term.value;
    case 'variable': return term.coefficient;
    default: return null;
  }
}

function decimalPrecision(denominator: number): number {
  let twos = 0, fives = 0;
  let d = denominator;
  while (d % 2 === 0) { d /= 2; twos++; }
  while (d % 5 === 0) { d /= 5; fives++; }
  return Math.max(twos, fives);
}

export function convertFraction(eq: Equation, termIds: string[]): Equation | string {
  // Check all terms first
  for (const side of [eq.left, eq.right] as const) {
    for (const term of side.terms) {
      if (!termIds.includes(term.id)) continue;
      const fmt = getDisplayFormat(term);
      if (!fmt) continue;

      if (fmt.kind === 'integer') return 'Целое число, нечего конвертировать';

      if (isFractionFormat(fmt)) {
        const frac = getFraction(term);
        if (!frac) continue;
        const r = reduce(frac);
        if (r.denominator === 1) return 'Целое число, нечего конвертировать';
        if (!canConvertToDecimal(r.denominator)) {
          return 'Нельзя перевести в десятичную дробь';
        }
      }
    }
  }

  const mapTerms = (terms: typeof eq.left.terms) =>
    terms.map(term => {
      if (!termIds.includes(term.id)) return term;
      const fmt = getDisplayFormat(term);
      if (!fmt) return term;

      let newFormat: DisplayFormat;
      if (isDecimalFormat(fmt)) {
        newFormat = { kind: 'commonFraction' };
      } else if (isFractionFormat(fmt)) {
        const frac = getFraction(term);
        if (!frac) return term;
        const r = reduce(frac);
        newFormat = { kind: 'decimal', precision: decimalPrecision(r.denominator) };
      } else {
        return term;
      }

      if (term.kind === 'numeric') return { ...term, displayFormat: newFormat };
      if (term.kind === 'variable') return { ...term, coefficientDisplayFormat: newFormat };
      return term;
    });

  return {
    left: { terms: mapTerms(eq.left.terms) },
    right: { terms: mapTerms(eq.right.terms) },
  };
}
