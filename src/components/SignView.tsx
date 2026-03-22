import type { Sign } from '../types/term.ts';
import styles from '../styles/term.module.css';

interface SignViewProps {
  sign: Sign;
  isFirst: boolean;
}

export function SignView({ sign, isFirst }: SignViewProps) {
  // Hide '+' on the first term of a side
  if (isFirst && sign === '+') return null;
  return <span className={styles.sign}>{sign === '+' ? '+' : '\u2212'}</span>;
}
