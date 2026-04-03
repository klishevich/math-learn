import type { Equation } from '../../types/equation.ts';
import type { BracketTerm, FlatTerm, Sign } from '../../types/term.ts';
import type { Fraction, DisplayFormat } from '../../types/fraction.ts';
import * as frac from '../fraction.ts';
import { createNumericTerm, createVariableTerm } from '../term.ts';

function computeExpandedSign(bracketSign: Sign, innerSign: Sign, multiplierNegative: boolean): Sign {
  let negCount = 0;
  if (bracketSign === '-') negCount++;
  if (innerSign === '-') negCount++;
  if (multiplierNegative) negCount++;
  return negCount % 2 === 0 ? '+' : '-';
}

function getDisplayPrecision(fmt: DisplayFormat): number | null {
  if (fmt.kind === 'integer') return 0;
  if (fmt.kind === 'decimal') return fmt.precision;
  return null; // fraction-based formats
}

function chooseDisplayFormat(value: Fraction, multiplierFmt: DisplayFormat, innerFmt: DisplayFormat): DisplayFormat {
  const mp = getDisplayPrecision(multiplierFmt);
  const ip = getDisplayPrecision(innerFmt);
  // If both are decimal/integer and at least one is decimal, result is decimal
  if (mp !== null && ip !== null && (mp > 0 || ip > 0)) {
    return { kind: 'decimal', precision: mp + ip };
  }
  const r = frac.reduce(value);
  if (r.denominator === 1) return { kind: 'integer' };
  return { kind: 'commonFraction' };
}

function expandInnerTerm(
  innerTerm: FlatTerm,
  multiplier: Fraction,
  multiplierDisplayFormat: DisplayFormat,
  bracketSign: Sign,
  multiplierIsVariable: boolean,
  multiplierSymbol: string | undefined,
  side: 'left' | 'right',
): FlatTerm {
  const multiplierAbs = frac.abs(multiplier);
  const isMultiplierNeg = multiplier.numerator < 0;
  const resultSign = computeExpandedSign(bracketSign, innerTerm.sign, isMultiplierNeg);

  if (innerTerm.kind === 'numeric') {
    const innerFmt = innerTerm.displayFormat;
    if (multiplierIsVariable && multiplierSymbol) {
      // numeric * variable_multiplier = variable term
      const coeff = frac.multiply(innerTerm.value, multiplierAbs);
      return createVariableTerm(coeff, chooseDisplayFormat(coeff, multiplierDisplayFormat, innerFmt), multiplierSymbol, resultSign, side);
    }
    // numeric * numeric_multiplier = numeric
    const value = frac.multiply(innerTerm.value, multiplierAbs);
    return createNumericTerm(value, chooseDisplayFormat(value, multiplierDisplayFormat, innerFmt), resultSign, side);
  } else {
    // variable * numeric_multiplier = variable (multiplierIsVariable should be false here for linearity)
    const innerFmt = innerTerm.coefficientDisplayFormat;
    const coeff = frac.multiply(innerTerm.coefficient, multiplierAbs);
    return createVariableTerm(coeff, chooseDisplayFormat(coeff, multiplierDisplayFormat, innerFmt), innerTerm.symbol, resultSign, side);
  }
}

export function expandBracket(equation: Equation, bracketTermId: string): Equation {
  const processTerms = (terms: typeof equation.left.terms) => {
    const result: typeof terms = [];
    for (const term of terms) {
      if (term.id === bracketTermId && term.kind === 'bracket') {
        const bracket = term as BracketTerm;
        const expanded = bracket.innerTerms.map(inner =>
          expandInnerTerm(
            inner,
            bracket.multiplier,
            bracket.multiplierDisplayFormat,
            bracket.sign,
            bracket.multiplierIsVariable,
            bracket.multiplierSymbol,
            bracket.side,
          ),
        );
        result.push(...expanded);
      } else {
        result.push(term);
      }
    }
    return result;
  };

  return {
    left: { terms: processTerms(equation.left.terms) },
    right: { terms: processTerms(equation.right.terms) },
  };
}
