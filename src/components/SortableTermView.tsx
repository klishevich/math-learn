import { useDraggable, useDroppable } from '@dnd-kit/core';
import type { Term } from '../types/term.ts';
import { TermView } from './TermView.tsx';

interface SortableTermViewProps {
  term: Term;
  isSelected: boolean;
  isFirst: boolean;
  isDragging: boolean;
  onSelect: (termId: string) => void;
  onBracketExpand: (termId: string) => void;
}

export function SortableTermView({ term, isSelected, isFirst, isDragging, onSelect, onBracketExpand }: SortableTermViewProps) {
  const { attributes, listeners, setNodeRef: setDragRef } = useDraggable({ id: term.id });
  const { setNodeRef: setDropRef } = useDroppable({ id: term.id });

  return (
    <span
      ref={(node) => { setDragRef(node); setDropRef(node); }}
      {...attributes}
      {...listeners}
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <TermView
        term={term}
        isSelected={isSelected}
        isFirst={isFirst}
        isDragging={false}
        onSelect={onSelect}
        onBracketExpand={onBracketExpand}
      />
    </span>
  );
}
