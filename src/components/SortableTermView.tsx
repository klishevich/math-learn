import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: term.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <span ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TermView
        term={term}
        isSelected={isSelected}
        isFirst={isFirst}
        isDragging={isDragging}
        onSelect={onSelect}
        onBracketExpand={onBracketExpand}
      />
    </span>
  );
}
