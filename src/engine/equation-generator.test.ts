import { describe, it, expect } from 'vitest';
import { generateEquation } from './equation-generator.ts';
import type { EquationSettings } from '../types/settings.ts';
import { DEFAULT_SETTINGS } from '../types/settings.ts';

function createSeededRng(seed: number): () => number {
  // Simple mulberry32 PRNG
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('generateEquation', () => {
  it('generates an equation with correct total term count', () => {
    const rng = createSeededRng(42);
    const eq = generateEquation(DEFAULT_SETTINGS, rng);
    const countTerms = (side: typeof eq.left) => {
      let count = 0;
      for (const t of side.terms) {
        if (t.kind === 'bracket') {
          count += t.innerTerms.length;
        } else {
          // skip zero terms added for empty sides
          if (t.kind === 'numeric' && t.value.numerator === 0) continue;
          count++;
        }
      }
      return count;
    };
    const total = countTerms(eq.left) + countTerms(eq.right);
    expect(total).toBe(DEFAULT_SETTINGS.numericTermCount + DEFAULT_SETTINGS.variableTermCount);
  });

  it('generates deterministic output with seeded RNG', () => {
    const eq1 = generateEquation(DEFAULT_SETTINGS, createSeededRng(123));
    const eq2 = generateEquation(DEFAULT_SETTINGS, createSeededRng(123));
    // Compare structure (ignore UUIDs)
    const strip = (eq: typeof eq1) => JSON.stringify(eq, (key, val) => key === 'id' ? 'ID' : val);
    expect(strip(eq1)).toBe(strip(eq2));
  });

  it('never produces empty sides', () => {
    for (let seed = 0; seed < 50; seed++) {
      const eq = generateEquation(DEFAULT_SETTINGS, createSeededRng(seed));
      expect(eq.left.terms.length).toBeGreaterThanOrEqual(1);
      expect(eq.right.terms.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('respects bracketCount=0', () => {
    const settings: EquationSettings = { ...DEFAULT_SETTINGS, bracketCount: 0 };
    const eq = generateEquation(settings, createSeededRng(42));
    const hasBracket = [...eq.left.terms, ...eq.right.terms].some(t => t.kind === 'bracket');
    expect(hasBracket).toBe(false);
  });

  it('bracket with variable terms has numeric-only multiplier', () => {
    const settings: EquationSettings = {
      ...DEFAULT_SETTINGS,
      numericTermCount: 3,
      variableTermCount: 3,
      bracketCount: 3,
    };
    for (let seed = 0; seed < 50; seed++) {
      const eq = generateEquation(settings, createSeededRng(seed));
      for (const term of [...eq.left.terms, ...eq.right.terms]) {
        if (term.kind === 'bracket') {
          const hasVar = term.innerTerms.some(t => t.kind === 'variable');
          if (hasVar) {
            expect(term.multiplierIsVariable).toBe(false);
          }
        }
      }
    }
  });

  it('single-term bracket has negative inner term', () => {
    const settings: EquationSettings = {
      ...DEFAULT_SETTINGS,
      numericTermCount: 5,
      variableTermCount: 5,
      bracketCount: 5,
    };
    for (let seed = 0; seed < 50; seed++) {
      const eq = generateEquation(settings, createSeededRng(seed));
      for (const term of [...eq.left.terms, ...eq.right.terms]) {
        if (term.kind === 'bracket' && term.innerTerms.length === 1) {
          expect(term.innerTerms[0].sign).toBe('-');
        }
      }
    }
  });

  it('uses custom variable symbol', () => {
    const settings: EquationSettings = { ...DEFAULT_SETTINGS, variableSymbol: 'y' };
    const eq = generateEquation(settings, createSeededRng(42));
    const allTerms = [...eq.left.terms, ...eq.right.terms];
    for (const term of allTerms) {
      if (term.kind === 'variable') {
        expect(term.symbol).toBe('y');
      }
      if (term.kind === 'bracket') {
        for (const inner of term.innerTerms) {
          if (inner.kind === 'variable') {
            expect(inner.symbol).toBe('y');
          }
        }
      }
    }
  });

  it('leaves at least one term outside brackets', () => {
    const settings: EquationSettings = {
      ...DEFAULT_SETTINGS,
      numericTermCount: 2,
      variableTermCount: 2,
      bracketCount: 10,
    };
    for (let seed = 0; seed < 50; seed++) {
      const eq = generateEquation(settings, createSeededRng(seed));
      const allTerms = [...eq.left.terms, ...eq.right.terms];
      const flatTerms = allTerms.filter(t => t.kind !== 'bracket');
      // At least one non-bracket, non-zero term
      const nonZeroFlat = flatTerms.filter(t =>
        !(t.kind === 'numeric' && t.value.numerator === 0),
      );
      expect(nonZeroFlat.length).toBeGreaterThanOrEqual(1);
    }
  });
});
