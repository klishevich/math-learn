import { useState } from 'react';
import styles from '../styles/toolbar.module.css';

interface ToolbarProps {
  canSum: boolean;
  canFactorOut: boolean;
  canUndo: boolean;
  onSum: () => void;
  onFactorOut: (factorInput: string, includeVariable: boolean) => void;
  onMultiplyEquation: (valueInput: string) => void;
  onUndo: () => void;
}

export function Toolbar({ canSum, canFactorOut, canUndo, onSum, onFactorOut, onMultiplyEquation, onUndo }: ToolbarProps) {
  const [factorInput, setFactorInput] = useState('');
  const [factorIncludeVar, setFactorIncludeVar] = useState(false);
  const [multiplyInput, setMultiplyInput] = useState('');

  return (
    <div className={styles.toolbar}>
      {canSum && (
        <div className={styles.toolbarGroup}>
          <button className={styles.toolbarButton} onClick={onSum}>
            Sum
          </button>
        </div>
      )}

      {canFactorOut && (
        <div className={styles.toolbarGroup}>
          <input
            className={styles.toolbarInput}
            type="text"
            placeholder="factor"
            value={factorInput}
            onChange={e => setFactorInput(e.target.value)}
          />
          <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="checkbox"
              checked={factorIncludeVar}
              onChange={e => setFactorIncludeVar(e.target.checked)}
            />
            incl. var
          </label>
          <button
            className={styles.toolbarButton}
            onClick={() => { onFactorOut(factorInput, factorIncludeVar); setFactorInput(''); }}
            disabled={!factorInput}
          >
            Factor out
          </button>
        </div>
      )}

      <div className={styles.separator} />

      <div className={styles.toolbarGroup}>
        <input
          className={styles.toolbarInput}
          type="text"
          placeholder="value"
          value={multiplyInput}
          onChange={e => setMultiplyInput(e.target.value)}
        />
        <button
          className={styles.toolbarButton}
          onClick={() => { onMultiplyEquation(multiplyInput); setMultiplyInput(''); }}
          disabled={!multiplyInput}
        >
          Multiply equation
        </button>
      </div>

      <div className={styles.separator} />

      <button
        className={styles.undoButton}
        onClick={onUndo}
        disabled={!canUndo}
      >
        Undo
      </button>
    </div>
  );
}
