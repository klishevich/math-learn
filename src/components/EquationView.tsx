import type { Equation } from '../types/equation.ts';
import { EquationSideView } from './EquationSideView.tsx';
import styles from '../styles/equation.module.css';

interface EquationViewProps {
  equation: Equation;
  selectedTermIds: Set<string>;
  draggedTermId: string | null;
  onSelect: (termId: string) => void;
  onBracketExpand: (termId: string) => void;
}

export function EquationView({ equation, selectedTermIds, draggedTermId, onSelect, onBracketExpand }: EquationViewProps) {
  return (
    <div className={styles.equationContainer}>
      <EquationSideView
        side="left"
        terms={equation.left.terms}
        selectedTermIds={selectedTermIds}
        draggedTermId={draggedTermId}
        onSelect={onSelect}
        onBracketExpand={onBracketExpand}
      />
      <span className={styles.equalsSign}>=</span>
      <EquationSideView
        side="right"
        terms={equation.right.terms}
        selectedTermIds={selectedTermIds}
        draggedTermId={draggedTermId}
        onSelect={onSelect}
        onBracketExpand={onBracketExpand}
      />
    </div>
  );
}
