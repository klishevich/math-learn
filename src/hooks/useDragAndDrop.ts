import { useCallback, useState } from 'react';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { Equation } from '../types/equation.ts';
import { getTermSide } from '../engine/validation.ts';

export function useDragAndDrop(
  equation: Equation,
  onReorder: (termId: string, targetSide: 'left' | 'right', targetIndex: number) => void,
) {
  const [draggedTermId, setDraggedTermId] = useState<string | null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setDraggedTermId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setDraggedTermId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Determine target side from droppable
    let targetSide: 'left' | 'right';
    if (overId === 'side-left') {
      targetSide = 'left';
    } else if (overId === 'side-right') {
      targetSide = 'right';
    } else {
      // Dropped on another term — find that term's side
      const overSide = getTermSide(equation, overId);
      if (!overSide) return;
      targetSide = overSide;
    }

    // Calculate target index
    const targetTerms = targetSide === 'left' ? equation.left.terms : equation.right.terms;
    const overIndex = targetTerms.findIndex(t => t.id === overId);
    const targetIndex = overIndex >= 0 ? overIndex : targetTerms.length;

    onReorder(activeId, targetSide, targetIndex);
  }, [equation, onReorder]);

  const handleDragCancel = useCallback(() => {
    setDraggedTermId(null);
  }, []);

  return {
    draggedTermId,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
}
