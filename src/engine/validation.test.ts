import { describe, it, expect } from 'vitest';
import {
  areTermsAdjacent, areSelectedTermsSameKind,
  canSelectTerm, canGroupTerms, canFactorOut,
} from './validation.ts';
import { createNumericTerm, createVariableTerm, createBracketTerm } from './term.ts';
import { fromInteger } from './fraction.ts';
import type { Equation } from '../types/equation.ts';

function makeTestEquation(): Equation {
  const n1 = createNumericTerm(fromInteger(1), { kind: 'integer' }, '+', 'left');
  const n2 = createNumericTerm(fromInteger(2), { kind: 'integer' }, '-', 'left');
  const v1 = createVariableTerm(fromInteger(3), { kind: 'integer' }, 'x', '+', 'left');
  const n3 = createNumericTerm(fromInteger(4), { kind: 'integer' }, '+', 'right');
  const v2 = createVariableTerm(fromInteger(5), { kind: 'integer' }, 'x', '-', 'right');
  return {
    left: { terms: [n1, n2, v1] },
    right: { terms: [n3, v2] },
  };
}

describe('areTermsAdjacent', () => {
  it('returns true for adjacent terms', () => {
    const eq = makeTestEquation();
    const ids = [eq.left.terms[0].id, eq.left.terms[1].id];
    expect(areTermsAdjacent(eq, ids)).toBe(true);
  });

  it('returns false for non-adjacent terms', () => {
    const eq = makeTestEquation();
    const ids = [eq.left.terms[0].id, eq.left.terms[2].id];
    expect(areTermsAdjacent(eq, ids)).toBe(false);
  });

  it('returns false for terms on different sides', () => {
    const eq = makeTestEquation();
    const ids = [eq.left.terms[0].id, eq.right.terms[0].id];
    expect(areTermsAdjacent(eq, ids)).toBe(false);
  });

  it('returns true for single term', () => {
    const eq = makeTestEquation();
    expect(areTermsAdjacent(eq, [eq.left.terms[0].id])).toBe(true);
  });

  it('returns true for empty array', () => {
    const eq = makeTestEquation();
    expect(areTermsAdjacent(eq, [])).toBe(true);
  });
});

describe('areSelectedTermsSameKind', () => {
  it('returns true for all numeric', () => {
    const eq = makeTestEquation();
    const ids = [eq.left.terms[0].id, eq.left.terms[1].id];
    expect(areSelectedTermsSameKind(eq, ids)).toBe(true);
  });

  it('returns false for mixed kinds', () => {
    const eq = makeTestEquation();
    const ids = [eq.left.terms[0].id, eq.left.terms[2].id]; // numeric + variable
    expect(areSelectedTermsSameKind(eq, ids)).toBe(false);
  });

  it('returns false for bracket term', () => {
    const bracket = createBracketTerm(
      fromInteger(2), { kind: 'integer' }, false, undefined,
      [createNumericTerm(fromInteger(1), { kind: 'integer' }, '+', 'left')],
      '+', 'left',
    );
    const eq: Equation = {
      left: { terms: [bracket] },
      right: { terms: [createNumericTerm(fromInteger(1), { kind: 'integer' }, '+', 'right')] },
    };
    expect(areSelectedTermsSameKind(eq, [bracket.id])).toBe(false);
  });
});

describe('canSelectTerm', () => {
  it('allows selecting first term', () => {
    const eq = makeTestEquation();
    const result = canSelectTerm(eq, [], eq.left.terms[0].id);
    expect(result.valid).toBe(true);
  });

  it('allows selecting adjacent same-kind term', () => {
    const eq = makeTestEquation();
    const result = canSelectTerm(eq, [eq.left.terms[0].id], eq.left.terms[1].id);
    expect(result.valid).toBe(true);
  });

  it('rejects selecting term on different side', () => {
    const eq = makeTestEquation();
    const result = canSelectTerm(eq, [eq.left.terms[0].id], eq.right.terms[0].id);
    expect(result.valid).toBe(false);
  });

  it('rejects selecting non-adjacent term', () => {
    const eq = makeTestEquation();
    // terms[0] is numeric, terms[2] is variable - non-adjacent AND different kind
    const result = canSelectTerm(eq, [eq.left.terms[0].id], eq.left.terms[2].id);
    expect(result.valid).toBe(false);
  });

  it('rejects selecting bracket term', () => {
    const bracket = createBracketTerm(
      fromInteger(2), { kind: 'integer' }, false, undefined,
      [createNumericTerm(fromInteger(1), { kind: 'integer' }, '+', 'left')],
      '+', 'left',
    );
    const eq: Equation = {
      left: { terms: [bracket] },
      right: { terms: [createNumericTerm(fromInteger(1), { kind: 'integer' }, '+', 'right')] },
    };
    const result = canSelectTerm(eq, [], bracket.id);
    expect(result.valid).toBe(false);
  });
});

describe('canGroupTerms', () => {
  it('allows grouping 2+ adjacent same-kind terms', () => {
    const eq = makeTestEquation();
    const ids = [eq.left.terms[0].id, eq.left.terms[1].id];
    expect(canGroupTerms(eq, ids).valid).toBe(true);
  });

  it('rejects grouping single term', () => {
    const eq = makeTestEquation();
    expect(canGroupTerms(eq, [eq.left.terms[0].id]).valid).toBe(false);
  });

  it('rejects grouping non-adjacent terms', () => {
    const n1 = createNumericTerm(fromInteger(1), { kind: 'integer' }, '+', 'left');
    const v1 = createVariableTerm(fromInteger(2), { kind: 'integer' }, 'x', '+', 'left');
    const n2 = createNumericTerm(fromInteger(3), { kind: 'integer' }, '+', 'left');
    const eq: Equation = {
      left: { terms: [n1, v1, n2] },
      right: { terms: [createNumericTerm(fromInteger(1), { kind: 'integer' }, '+', 'right')] },
    };
    expect(canGroupTerms(eq, [n1.id, n2.id]).valid).toBe(false);
  });
});

describe('canFactorOut', () => {
  it('allows factoring 2+ adjacent terms', () => {
    const eq = makeTestEquation();
    const ids = [eq.left.terms[0].id, eq.left.terms[1].id];
    expect(canFactorOut(eq, ids).valid).toBe(true);
  });

  it('rejects factoring single term', () => {
    const eq = makeTestEquation();
    expect(canFactorOut(eq, [eq.left.terms[0].id]).valid).toBe(false);
  });
});
