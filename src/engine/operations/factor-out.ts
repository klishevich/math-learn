import type { Equation } from '../../types/equation.ts';
import type { Term, FlatTerm, Sign } from '../../types/term.ts';
import type { Fraction, DisplayFormat } from '../../types/fraction.ts';
import * as frac from '../fraction.ts';
import { createNumericTerm, createVariableTerm, createBracketTerm, getEffectiveValue } from '../term.ts';

function chooseDisplayFormat(value: Fraction): DisplayFormat {
  const r = frac.reduce(value);
  if (r.denominator === 1) return { kind: 'integer' };
  return { kind: 'commonFraction' };
}

export function factorOut(
  equation: Equation,
  termIds: string[],
  factor: Fraction,
  includeVariable: boolean,
  variableSymbol?: string,
): Equation {
  if (termIds.length === 0) return equation;

  const processTerms = (terms: Term[], side: 'left' | 'right') => {
    const selectedOnThisSide = terms.filter(t => termIds.includes(t.id));
    if (selectedOnThisSide.length === 0) return terms;

    const selectedTerms = selectedOnThisSide.filter(
      (t): t is FlatTerm => t.kind === 'numeric' || t.kind === 'variable',
    );
    if (selectedTerms.length === 0) return terms;

    // Divide each term by the factor to get inner terms
    const innerTerms: FlatTerm[] = selectedTerms.map(term => {
      const effectiveVal = getEffectiveValue(term);
      const divided = frac.divide(effectiveVal, factor);

      const innerSign: Sign = divided.numerator < 0 ? '-' : '+';
      const absDiv = frac.abs(divided);

      if (term.kind === 'variable' && includeVariable) {
        // Variable term / variable factor = numeric inner term
        return createNumericTerm(absDiv, chooseDisplayFormat(absDiv), innerSign, side);
      } else if (term.kind === 'variable') {
        // Variable term / numeric factor = variable inner term
        return createVariableTerm(absDiv, chooseDisplayFormat(absDiv), term.symbol, innerSign, side);
      } else {
        if (includeVariable) {
          // This shouldn't typically happen (numeric / variable), but handle gracefully
          return createNumericTerm(absDiv, chooseDisplayFormat(absDiv), innerSign, side);
        }
        return createNumericTerm(absDiv, chooseDisplayFormat(absDiv), innerSign, side);
      }
    });

    // Create bracket
    const absFactor = frac.abs(factor);
    const bracketSign: Sign = factor.numerator < 0 ? '-' : '+';
    const bracket = createBracketTerm(
      absFactor,
      chooseDisplayFormat(absFactor),
      includeVariable,
      includeVariable ? (variableSymbol ?? 'x') : undefined,
      innerTerms,
      bracketSign,
      side,
    );

    // Replace selected terms with bracket
    const result: Term[] = [];
    let replaced = false;
    for (const term of terms) {
      if (termIds.includes(term.id)) {
        if (!replaced) {
          result.push(bracket);
          replaced = true;
        }
      } else {
        result.push(term);
      }
    }
    return result;
  };

  return {
    left: { terms: processTerms(equation.left.terms, 'left') },
    right: { terms: processTerms(equation.right.terms, 'right') },
  };
}
