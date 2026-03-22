import type { Equation } from '../../types/equation.ts';
import type { Term } from '../../types/term.ts';
import type { Fraction, DisplayFormat } from '../../types/fraction.ts';
import * as frac from '../fraction.ts';

function chooseDisplayFormat(value: Fraction): DisplayFormat {
  const r = frac.reduce(value);
  if (r.denominator === 1) return { kind: 'integer' };
  return { kind: 'commonFraction' };
}

function multiplyTerm(term: Term, factor: Fraction): Term {
  switch (term.kind) {
    case 'numeric': {
      const newValue = frac.multiply(term.value, frac.abs(factor));
      const flipSign = factor.numerator < 0;
      return {
        ...term,
        value: newValue,
        displayFormat: chooseDisplayFormat(newValue),
        sign: flipSign ? (term.sign === '+' ? '-' : '+') : term.sign,
      };
    }
    case 'variable': {
      const newCoeff = frac.multiply(term.coefficient, frac.abs(factor));
      const flipSign = factor.numerator < 0;
      return {
        ...term,
        coefficient: newCoeff,
        coefficientDisplayFormat: chooseDisplayFormat(newCoeff),
        sign: flipSign ? (term.sign === '+' ? '-' : '+') : term.sign,
      };
    }
    case 'bracket': {
      const newMult = frac.multiply(term.multiplier, frac.abs(factor));
      const flipSign = factor.numerator < 0;
      return {
        ...term,
        multiplier: newMult,
        multiplierDisplayFormat: chooseDisplayFormat(newMult),
        sign: flipSign ? (term.sign === '+' ? '-' : '+') : term.sign,
      };
    }
  }
}

function divideTerm(term: Term, divisor: Fraction): Term {
  const reciprocal: Fraction = {
    numerator: divisor.numerator < 0 ? -divisor.denominator : divisor.denominator,
    denominator: Math.abs(divisor.numerator),
  };
  return multiplyTerm(term, reciprocal);
}

export function multiplyEquation(equation: Equation, factor: Fraction): Equation {
  if (frac.isZero(factor)) throw new Error('Cannot multiply equation by zero');
  return {
    left: { terms: equation.left.terms.map(t => multiplyTerm(t, factor)) },
    right: { terms: equation.right.terms.map(t => multiplyTerm(t, factor)) },
  };
}

export function divideEquation(equation: Equation, divisor: Fraction): Equation {
  if (frac.isZero(divisor)) throw new Error('Cannot divide equation by zero');
  return {
    left: { terms: equation.left.terms.map(t => divideTerm(t, divisor)) },
    right: { terms: equation.right.terms.map(t => divideTerm(t, divisor)) },
  };
}
