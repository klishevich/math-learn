import type { VariableTerm } from '../types/term.ts';
import { FractionView } from './FractionView.tsx';
import styles from '../styles/term.module.css';

interface VariableTermViewProps {
  term: VariableTerm;
}

export function VariableTermView({ term }: VariableTermViewProps) {
  const showCoefficient = !(term.coefficient.numerator === 1 && term.coefficient.denominator === 1);

  return (
    <span className={styles.variable}>
      {showCoefficient && (
        <FractionView value={term.coefficient} displayFormat={term.coefficientDisplayFormat} />
      )}
      {term.symbol}
    </span>
  );
}
