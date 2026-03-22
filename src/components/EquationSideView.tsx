import { useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import type { Term } from '../types/term.ts';
import { SortableTermView } from './SortableTermView.tsx';
import styles from '../styles/equation.module.css';

interface EquationSideViewProps {
  side: 'left' | 'right';
  terms: Term[];
  selectedTermIds: Set<string>;
  draggedTermId: string | null;
  onSelect: (termId: string) => void;
  onBracketExpand: (termId: string) => void;
}

export function EquationSideView({
  side, terms, selectedTermIds, draggedTermId, onSelect, onBracketExpand,
}: EquationSideViewProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `side-${side}` });

  const classNames = [
    styles.equationSide,
    isOver ? styles.equationSideDropTarget : '',
  ].filter(Boolean).join(' ');

  return (
    <div ref={setNodeRef} className={classNames}>
      <SortableContext items={terms.map(t => t.id)} strategy={horizontalListSortingStrategy}>
        {terms.map((term, index) => (
          <SortableTermView
            key={term.id}
            term={term}
            isSelected={selectedTermIds.has(term.id)}
            isFirst={index === 0}
            isDragging={draggedTermId === term.id}
            onSelect={onSelect}
            onBracketExpand={onBracketExpand}
          />
        ))}
      </SortableContext>
    </div>
  );
}
