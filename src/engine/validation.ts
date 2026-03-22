import type { Equation } from '../types/equation.ts';
import type { Term } from '../types/term.ts';

export function getTermById(equation: Equation, termId: string): Term | undefined {
  for (const term of [...equation.left.terms, ...equation.right.terms]) {
    if (term.id === termId) return term;
  }
  return undefined;
}

export function getTermSide(equation: Equation, termId: string): 'left' | 'right' | undefined {
  if (equation.left.terms.some(t => t.id === termId)) return 'left';
  if (equation.right.terms.some(t => t.id === termId)) return 'right';
  return undefined;
}

export function areTermsAdjacent(equation: Equation, termIds: string[]): boolean {
  if (termIds.length <= 1) return true;

  // All must be on the same side
  const side = getTermSide(equation, termIds[0]);
  if (!side) return false;
  const sideTerms = side === 'left' ? equation.left.terms : equation.right.terms;

  // Find indices
  const indices = termIds.map(id => sideTerms.findIndex(t => t.id === id));
  if (indices.some(i => i === -1)) return false;

  // Check that all terms on same side
  if (!termIds.every(id => getTermSide(equation, id) === side)) return false;

  // Sort indices and check they form a contiguous block
  const sorted = [...indices].sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] !== sorted[i - 1] + 1) return false;
  }
  return true;
}

export function areSelectedTermsSameKind(equation: Equation, termIds: string[]): boolean {
  if (termIds.length === 0) return true;
  const terms = termIds.map(id => getTermById(equation, id)).filter(Boolean) as Term[];
  if (terms.length !== termIds.length) return false;
  if (terms.some(t => t.kind === 'bracket')) return false;
  const firstKind = terms[0].kind;
  return terms.every(t => t.kind === firstKind);
}

export function canSelectTerm(
  equation: Equation,
  currentSelectedIds: string[],
  termId: string,
): { valid: boolean; reason?: string } {
  const term = getTermById(equation, termId);
  if (!term) return { valid: false, reason: 'Term not found' };

  if (currentSelectedIds.length === 0) {
    // Brackets can't be selected for grouping
    if (term.kind === 'bracket') return { valid: false, reason: 'Cannot select bracket terms' };
    return { valid: true };
  }

  // Check same side
  const existingSide = getTermSide(equation, currentSelectedIds[0]);
  const newSide = getTermSide(equation, termId);
  if (existingSide !== newSide) {
    return { valid: false, reason: 'All selected terms must be on the same side' };
  }

  // Check same kind
  const newIds = [...currentSelectedIds, termId];
  if (!areSelectedTermsSameKind(equation, newIds)) {
    return { valid: false, reason: 'Selected terms must be of the same kind (all numeric or all variable)' };
  }

  // Check adjacency
  if (!areTermsAdjacent(equation, newIds)) {
    return { valid: false, reason: 'Selected terms must be adjacent' };
  }

  return { valid: true };
}

export function canGroupTerms(
  equation: Equation,
  termIds: string[],
): { valid: boolean; reason?: string } {
  if (termIds.length < 2) {
    return { valid: false, reason: 'Select at least 2 terms to group' };
  }
  if (!areSelectedTermsSameKind(equation, termIds)) {
    return { valid: false, reason: 'Selected terms must be of the same kind' };
  }
  if (!areTermsAdjacent(equation, termIds)) {
    return { valid: false, reason: 'Selected terms must be adjacent' };
  }
  return { valid: true };
}

export function canFactorOut(
  equation: Equation,
  termIds: string[],
): { valid: boolean; reason?: string } {
  if (termIds.length < 2) {
    return { valid: false, reason: 'Select at least 2 terms to factor out' };
  }
  if (!areTermsAdjacent(equation, termIds)) {
    return { valid: false, reason: 'Selected terms must be adjacent' };
  }
  return { valid: true };
}
