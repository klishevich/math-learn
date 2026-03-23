import { useState, Fragment } from 'react';
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
        <Fragment>
          <div className={styles.toolbarGroup}>
            <button className={styles.toolbarButton} onClick={onSum}>
              Сложить
            </button>
          </div>
          <div className={styles.separator} />
        </Fragment>
      )}

      {canFactorOut && (
        <Fragment>
          <div className={styles.toolbarGroup}>
            <input
              className={styles.toolbarInput}
              type="text"
              placeholder="Множ."
              value={factorInput}
              onChange={e => setFactorInput(e.target.value)}
            />
            <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="checkbox"
                checked={factorIncludeVar}
                onChange={e => setFactorIncludeVar(e.target.checked)}
              />
              перем.
            </label>
            <button
              className={styles.toolbarButton}
              onClick={() => { onFactorOut(factorInput, factorIncludeVar); setFactorInput(''); }}
              disabled={!factorInput}
            >
              Вынести
            </button>
          </div>
          <div className={styles.separator} />
        </Fragment>
      )}

      <div className={styles.toolbarGroup}>
        <input
          className={styles.toolbarInput}
          type="text"
          placeholder="значение"
          value={multiplyInput}
          onChange={e => setMultiplyInput(e.target.value)}
        />
        <button
          className={styles.toolbarButton}
          onClick={() => { onMultiplyEquation(multiplyInput); setMultiplyInput(''); }}
          disabled={!multiplyInput}
        >
          Умножить уравн.
        </button>
      </div>

      <div className={styles.separator} />

      <button
        className={styles.undoButton}
        onClick={onUndo}
        disabled={!canUndo}
      >
        Отменить
      </button>
    </div>
  );
}
