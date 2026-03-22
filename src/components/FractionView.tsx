import type { Fraction, DisplayFormat } from '../types/fraction.ts';
import { toMixedNumber } from '../engine/fraction.ts';
import styles from '../styles/term.module.css';

interface FractionViewProps {
  value: Fraction;
  displayFormat: DisplayFormat;
}

function StackedFraction({ numerator, denominator }: { numerator: number; denominator: number }) {
  return (
    <span className={styles.fraction}>
      <span className={styles.fractionNumerator}>{Math.abs(numerator)}</span>
      <span className={styles.fractionDenominator}>{denominator}</span>
    </span>
  );
}

export function FractionView({ value, displayFormat }: FractionViewProps) {
  switch (displayFormat.kind) {
    case 'integer':
      return <span>{Math.abs(value.numerator)}</span>;

    case 'commonFraction':
      if (value.denominator === 1) return <span>{Math.abs(value.numerator)}</span>;
      return <StackedFraction numerator={value.numerator} denominator={value.denominator} />;

    case 'improperFraction':
      if (value.denominator === 1) return <span>{Math.abs(value.numerator)}</span>;
      return <StackedFraction numerator={value.numerator} denominator={value.denominator} />;

    case 'mixedNumber': {
      if (value.denominator === 1) return <span>{Math.abs(value.numerator)}</span>;
      const { whole, fractionalPart } = toMixedNumber(value);
      if (whole === 0) {
        return <StackedFraction numerator={fractionalPart.numerator} denominator={fractionalPart.denominator} />;
      }
      return (
        <span className={styles.coefficient}>
          <span className={styles.wholePart}>{Math.abs(whole)}</span>
          <StackedFraction numerator={fractionalPart.numerator} denominator={fractionalPart.denominator} />
        </span>
      );
    }

    case 'decimal': {
      const num = value.numerator / value.denominator;
      return <span>{Math.abs(num).toFixed(displayFormat.precision)}</span>;
    }
  }
}
