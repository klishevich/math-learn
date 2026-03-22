import { useCallback } from 'react';
import type { Equation } from '../types/equation.ts';
import { canSelectTerm } from '../engine/validation.ts';

export function useSelection(
  equation: Equation,
  selectedTermIds: string[],
  setSelectedTermIds: (ids: string[]) => void,
) {
  const toggleSelection = useCallback((termId: string) => {
    // If already selected, deselect
    if (selectedTermIds.includes(termId)) {
      setSelectedTermIds(selectedTermIds.filter(id => id !== termId));
      return;
    }

    // Try to add to current selection
    const result = canSelectTerm(equation, selectedTermIds, termId);
    if (result.valid) {
      setSelectedTermIds([...selectedTermIds, termId]);
    } else {
      // Start new selection with just this term
      const freshResult = canSelectTerm(equation, [], termId);
      if (freshResult.valid) {
        setSelectedTermIds([termId]);
      }
    }
  }, [equation, selectedTermIds, setSelectedTermIds]);

  const clearSelection = useCallback(() => {
    setSelectedTermIds([]);
  }, [setSelectedTermIds]);

  return { toggleSelection, clearSelection };
}
