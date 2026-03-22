import type { Fraction, DisplayFormat } from '../types/fraction.ts';
import type { Sign, Side, FlatTerm } from '../types/term.ts';
import type { Equation } from '../types/equation.ts';
import type { EquationSettings } from '../types/settings.ts';
import * as frac from './fraction.ts';
import { createNumericTerm, createVariableTerm, createBracketTerm, createZeroTerm } from './term.ts';

type RNG = () => number;

function randomInt(rng: RNG, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function randomSign(rng: RNG): Sign {
  return rng() < 0.5 ? '+' : '-';
}

function randomSide(rng: RNG): Side {
  return rng() < 0.5 ? 'left' : 'right';
}

function pickRandomDisplayFormat(settings: EquationSettings, rng: RNG): DisplayFormat {
  const formats: DisplayFormat[] = [{ kind: 'integer' }];
  if (settings.useCommonFractions) formats.push({ kind: 'commonFraction' });
  if (settings.useImproperFractions) formats.push({ kind: 'improperFraction' });
  if (settings.useMixedNumbers) formats.push({ kind: 'mixedNumber' });
  if (settings.useDecimalFractions) formats.push({ kind: 'decimal', precision: settings.decimalPrecision });
  return formats[randomInt(rng, 0, formats.length - 1)];
}

function generateRandomValue(settings: EquationSettings, format: DisplayFormat, rng: RNG): Fraction {
  const limit = settings.fractionDenominatorLimit;
  switch (format.kind) {
    case 'integer':
      return frac.fromInteger(randomInt(rng, 1, 20));
    case 'commonFraction': {
      const den = randomInt(rng, 2, limit);
      const num = randomInt(rng, 1, den - 1);
      return frac.reduce({ numerator: num, denominator: den });
    }
    case 'improperFraction': {
      const den = randomInt(rng, 2, limit);
      const num = randomInt(rng, den + 1, den * 3);
      return frac.reduce({ numerator: num, denominator: den });
    }
    case 'mixedNumber': {
      const den = randomInt(rng, 2, limit);
      const whole = randomInt(rng, 1, 5);
      const num = randomInt(rng, 1, den - 1);
      return frac.reduce({ numerator: whole * den + num, denominator: den });
    }
    case 'decimal': {
      const factor = Math.pow(10, format.precision);
      const value = randomInt(rng, 1, Math.min(factor * 10, 9999));
      return frac.fromDecimal(value / factor, format.precision);
    }
  }
}

function generateRandomNumericTerm(settings: EquationSettings, sign: Sign, side: Side, rng: RNG): ReturnType<typeof createNumericTerm> {
  const format = pickRandomDisplayFormat(settings, rng);
  const value = generateRandomValue(settings, format, rng);
  return createNumericTerm(value, format, sign, side);
}

function generateRandomVariableTerm(settings: EquationSettings, sign: Sign, side: Side, rng: RNG): ReturnType<typeof createVariableTerm> {
  const format = pickRandomDisplayFormat(settings, rng);
  const value = generateRandomValue(settings, format, rng);
  return createVariableTerm(value, format, settings.variableSymbol, sign, side);
}

export function generateEquation(settings: EquationSettings, rng: RNG = Math.random): Equation {
  const totalTerms = settings.numericTermCount + settings.variableTermCount;

  // Build pool of term types: 'numeric' or 'variable'
  const termTypes: ('numeric' | 'variable')[] = [
    ...Array(settings.numericTermCount).fill('numeric') as 'numeric'[],
    ...Array(settings.variableTermCount).fill('variable') as 'variable'[],
  ];

  // Shuffle the pool
  for (let i = termTypes.length - 1; i > 0; i--) {
    const j = randomInt(rng, 0, i);
    [termTypes[i], termTypes[j]] = [termTypes[j], termTypes[i]];
  }

  // Allocate terms to brackets
  const bracketCount = Math.min(settings.bracketCount, totalTerms - 1); // must leave at least 1 outside
  const bracketAllocations: number[] = []; // how many terms in each bracket
  let allocated = 0;

  for (let b = 0; b < bracketCount; b++) {
    const remaining = totalTerms - allocated;
    const bracketsLeft = bracketCount - b;
    // Must leave at least 1 term for remaining brackets and 1 outside
    const maxForThis = remaining - bracketsLeft; // each remaining bracket needs at least 1
    if (maxForThis < 1) break;
    const count = randomInt(rng, 1, Math.min(maxForThis, 3)); // cap at 3 terms per bracket
    bracketAllocations.push(count);
    allocated += count;
  }

  // Assign term types to brackets and remaining
  let termIndex = 0;
  const bracketTermTypes: ('numeric' | 'variable')[][] = [];
  for (const count of bracketAllocations) {
    bracketTermTypes.push(termTypes.slice(termIndex, termIndex + count));
    termIndex += count;
  }
  const remainingTermTypes = termTypes.slice(termIndex);

  // Generate brackets
  const allTerms: (ReturnType<typeof createBracketTerm> | ReturnType<typeof createNumericTerm> | ReturnType<typeof createVariableTerm>)[] = [];

  for (const innerTypes of bracketTermTypes) {
    const side = randomSide(rng);
    const sign = randomSign(rng);
    const hasVariable = innerTypes.some(t => t === 'variable');

    // Generate inner terms
    const innerTerms: FlatTerm[] = innerTypes.map(type => {
      const innerSign = randomSign(rng);
      if (type === 'numeric') {
        return generateRandomNumericTerm(settings, innerSign, side, rng);
      } else {
        return generateRandomVariableTerm(settings, innerSign, side, rng);
      }
    });

    // If bracket has only one term, that term must be negative
    if (innerTerms.length === 1) {
      innerTerms[0] = { ...innerTerms[0], sign: '-' };
    }

    // Generate multiplier - must be numeric if bracket contains variable terms
    const multiplierFormat = pickRandomDisplayFormat(settings, rng);
    const multiplierValue = generateRandomValue(settings, multiplierFormat, rng);

    // Can only be variable multiplier if no variable terms inside (to keep linear)
    const canBeVariableMultiplier = !hasVariable;
    const multiplierIsVariable = canBeVariableMultiplier && rng() < 0.3;

    const bracket = createBracketTerm(
      multiplierValue,
      multiplierFormat,
      multiplierIsVariable,
      multiplierIsVariable ? settings.variableSymbol : undefined,
      innerTerms,
      sign,
      side,
    );
    allTerms.push(bracket);
  }

  // Generate remaining flat terms
  for (const type of remainingTermTypes) {
    const side = randomSide(rng);
    const sign = randomSign(rng);
    if (type === 'numeric') {
      allTerms.push(generateRandomNumericTerm(settings, sign, side, rng));
    } else {
      allTerms.push(generateRandomVariableTerm(settings, sign, side, rng));
    }
  }

  // Split into sides
  const leftTerms = allTerms.filter(t => t.side === 'left');
  const rightTerms = allTerms.filter(t => t.side === 'right');

  // If one side is empty, add zero
  if (leftTerms.length === 0) leftTerms.push(createZeroTerm('left'));
  if (rightTerms.length === 0) rightTerms.push(createZeroTerm('right'));

  return {
    left: { terms: leftTerms },
    right: { terms: rightTerms },
  };
}
