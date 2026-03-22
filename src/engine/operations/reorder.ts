import type { Equation } from '../../types/equation.ts';
import type { Term, Side } from '../../types/term.ts';
import { negateTerm } from '../term.ts';

export function reorderTerm(
  equation: Equation,
  termId: string,
  targetSide: Side,
  targetIndex: number,
): Equation {
  // Find the term and its current side
  let term: Term | undefined;
  let sourceSide: Side | undefined;

  for (const t of equation.left.terms) {
    if (t.id === termId) { term = t; sourceSide = 'left'; break; }
  }
  if (!term) {
    for (const t of equation.right.terms) {
      if (t.id === termId) { term = t; sourceSide = 'right'; break; }
    }
  }
  if (!term || !sourceSide) return equation;

  // Remove from source
  const leftTerms = equation.left.terms.filter(t => t.id !== termId);
  const rightTerms = equation.right.terms.filter(t => t.id !== termId);

  // If crossing sides, negate the sign
  let movedTerm = { ...term, side: targetSide };
  if (sourceSide !== targetSide) {
    movedTerm = { ...negateTerm(term), side: targetSide };
  }

  // Insert at target position
  if (targetSide === 'left') {
    const idx = Math.min(targetIndex, leftTerms.length);
    leftTerms.splice(idx, 0, movedTerm);
  } else {
    const idx = Math.min(targetIndex, rightTerms.length);
    rightTerms.splice(idx, 0, movedTerm);
  }

  return {
    left: { terms: leftTerms },
    right: { terms: rightTerms },
  };
}
