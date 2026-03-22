import type { BracketTerm } from '../types/term.ts';
import { FractionView } from './FractionView.tsx';
import { SignView } from './SignView.tsx';
import { NumericTermView } from './NumericTermView.tsx';
import { VariableTermView } from './VariableTermView.tsx';
import styles from '../styles/term.module.css';

interface BracketTermViewProps {
  term: BracketTerm;
  onExpand: (termId: string) => void;
}

export function BracketTermView({ term, onExpand }: BracketTermViewProps) {
  const showMultiplier = !(term.multiplier.numerator === 1 && term.multiplier.denominator === 1 && !term.multiplierIsVariable);

  return (
    <span
      className={styles.bracket}
      onClick={(e) => { e.stopPropagation(); onExpand(term.id); }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onExpand(term.id); }}
    >
      {showMultiplier && (
        <span className={styles.multiplierPart}>
          <FractionView value={term.multiplier} displayFormat={term.multiplierDisplayFormat} />
          {term.multiplierIsVariable && term.multiplierSymbol}
        </span>
      )}
      <span className={styles.bracketParen}>(</span>
      <span className={styles.bracketContent}>
        {term.innerTerms.map((inner, index) => (
          <span key={inner.id} style={{ display: 'inline-flex', alignItems: 'center' }}>
            <SignView sign={inner.sign} isFirst={index === 0} />
            {inner.kind === 'numeric' ? (
              <NumericTermView term={inner} />
            ) : (
              <VariableTermView term={inner} />
            )}
          </span>
        ))}
      </span>
      <span className={styles.bracketParen}>)</span>
    </span>
  );
}
