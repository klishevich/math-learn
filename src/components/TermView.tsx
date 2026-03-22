import type { Term } from '../types/term.ts';
import { SignView } from './SignView.tsx';
import { NumericTermView } from './NumericTermView.tsx';
import { VariableTermView } from './VariableTermView.tsx';
import { BracketTermView } from './BracketTermView.tsx';
import styles from '../styles/term.module.css';

interface TermViewProps {
  term: Term;
  isSelected: boolean;
  isFirst: boolean;
  isDragging: boolean;
  onSelect: (termId: string) => void;
  onBracketExpand: (termId: string) => void;
}

export function TermView({ term, isSelected, isFirst, isDragging, onSelect, onBracketExpand }: TermViewProps) {
  const classNames = [
    styles.termWrapper,
    isSelected ? styles.selected : '',
    isDragging ? styles.dragging : '',
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (term.kind === 'bracket') {
      // Bracket click is handled by BracketTermView
      return;
    }
    onSelect(term.id);
  };

  return (
    <span className={classNames} onClick={handleClick}>
      <SignView sign={term.sign} isFirst={isFirst} />
      {term.kind === 'numeric' && <NumericTermView term={term} />}
      {term.kind === 'variable' && <VariableTermView term={term} />}
      {term.kind === 'bracket' && <BracketTermView term={term} onExpand={onBracketExpand} />}
    </span>
  );
}
