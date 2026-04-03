import { useMemo } from 'react';
import styles from '../styles/celebration.module.css';

const ANIMALS = [
  { emoji: '\u{1F436}', name: 'dog' },
  { emoji: '\u{1F431}', name: 'cat' },
  { emoji: '\u{1F984}', name: 'unicorn' },
  { emoji: '\u{1F43B}', name: 'bear' },
  { emoji: '\u{1F428}', name: 'koala' },
  { emoji: '\u{1F981}', name: 'lion' },
  { emoji: '\u{1F430}', name: 'rabbit' },
  { emoji: '\u{1F43C}', name: 'panda' },
  { emoji: '\u{1F992}', name: 'giraffe' },
  { emoji: '\u{1F427}', name: 'penguin' },
  { emoji: '\u{1F985}', name: 'eagle' },
  { emoji: '\u{1F433}', name: 'whale' },
];

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs} сек.`;
  return `${mins} мин. ${secs} сек.`;
}

interface CelebrationViewProps {
  solveTime: number;
}

export function CelebrationView({ solveTime }: CelebrationViewProps) {
  const animal = useMemo(() => ANIMALS[Math.floor(Math.random() * ANIMALS.length)], []);

  return (
    <div className={styles.celebration}>
      <div className={styles.emoji}>{animal.emoji}</div>
      <div className={styles.text}>The {animal.name} is happy :)</div>
      <div className={styles.time}>Время: {formatTime(solveTime)}</div>
    </div>
  );
}
