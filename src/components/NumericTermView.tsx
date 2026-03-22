import type { NumericTerm } from '../types/term.ts';
import { FractionView } from './FractionView.tsx';
import styles from '../styles/term.module.css';

interface NumericTermViewProps {
  term: NumericTerm;
}

export function NumericTermView({ term }: NumericTermViewProps) {
  return (
    <span className={styles.numeric}>
      <FractionView value={term.value} displayFormat={term.displayFormat} />
    </span>
  );
}
