import type { Equation } from '../../types/equation.ts';
import type { Term, FlatTerm, Sign } from '../../types/term.ts';
import type { DisplayFormat } from '../../types/fraction.ts';
import * as frac from '../fraction.ts';
import { createNumericTerm, createVariableTerm, createZeroTerm, getEffectiveValue } from '../term.ts';

function chooseDisplayFormat(value: import('../../types/fraction.ts').Fraction, terms: FlatTerm[]): DisplayFormat {
  // If all terms are decimal, preserve decimal format with max precision
  const decimalFormats = terms.map(t => {
    const fmt = t.kind === 'variable' ? t.coefficientDisplayFormat : t.displayFormat;
    return fmt.kind === 'decimal' ? fmt : null;
  }).filter((f): f is { kind: 'decimal'; precision: number } => f !== null);

  if (decimalFormats.length === terms.length && decimalFormats.length > 0) {
    const maxPrecision = Math.max(...decimalFormats.map(f => f.precision));
    return { kind: 'decimal', precision: maxPrecision };
  }

  const r = frac.reduce(value);
  if (r.denominator === 1) return { kind: 'integer' };
  return { kind: 'commonFraction' };
}

export function groupTerms(equation: Equation, termIds: string[]): Equation {
  if (termIds.length === 0) return equation;

  const processTerms = (terms: Term[], side: 'left' | 'right') => {
    // Check if any selected terms are on this side
    const selectedOnThisSide = terms.filter(t => termIds.includes(t.id));
    if (selectedOnThisSide.length === 0) return terms;

    // Get the selected flat terms
    const selectedTerms = selectedOnThisSide.filter(
      (t): t is FlatTerm => t.kind === 'numeric' || t.kind === 'variable',
    );
    if (selectedTerms.length === 0) return terms;

    // Sum the effective values
    let sum = frac.fromInteger(0);
    for (const term of selectedTerms) {
      sum = frac.add(sum, getEffectiveValue(term));
    }

    // Determine sign and absolute value
    const sign: Sign = sum.numerator < 0 ? '-' : '+';
    const absValue = frac.abs(sum);

    // Create replacement term
    let replacement: FlatTerm;
    const firstKind = selectedTerms[0].kind;
    if (firstKind === 'variable') {
      const vt = selectedTerms[0];
      if (vt.kind === 'variable') {
        replacement = createVariableTerm(absValue, chooseDisplayFormat(absValue, selectedTerms), vt.symbol, sign, side);
      } else {
        replacement = createNumericTerm(absValue, chooseDisplayFormat(absValue, selectedTerms), sign, side);
      }
    } else {
      replacement = createNumericTerm(absValue, chooseDisplayFormat(absValue, selectedTerms), sign, side);
    }

    // Build result: everything before first selected, replacement, everything after last selected
    const result: Term[] = [];
    let replaced = false;
    for (const term of terms) {
      if (termIds.includes(term.id)) {
        if (!replaced) {
          // Handle zero sum: if the result is zero and there are other terms, skip it
          if (!frac.isZero(sum)) {
            result.push(replacement);
          }
          replaced = true;
        }
        // Skip this selected term
      } else {
        result.push(term);
      }
    }

    // If all terms were selected and sum is zero, add a zero term
    if (result.length === 0) {
      result.push(createZeroTerm(side));
    }

    return result;
  };

  return {
    left: { terms: processTerms(equation.left.terms, 'left') },
    right: { terms: processTerms(equation.right.terms, 'right') },
  };
}
