import type { EquationSettings } from '../types/settings.ts';
import styles from '../styles/settings.module.css';

interface SettingsPanelProps {
  settings: EquationSettings;
  onChange: (settings: EquationSettings) => void;
  onGenerate: () => void;
}

export function SettingsPanel({ settings, onChange, onGenerate }: SettingsPanelProps) {
  const update = (partial: Partial<EquationSettings>) => {
    onChange({ ...settings, ...partial });
  };

  return (
    <div className={styles.settingsPanel}>
      <div className={styles.settingsTitle}>Параметры уравнения</div>
      <div className={styles.settingsGrid}>
        <div className={styles.settingItem}>
          <label className={styles.settingLabel}>Кол-во свободных членов (числа)</label>
          <input
            className={styles.settingInput}
            type="number"
            min={1} max={10}
            value={settings.numericTermCount}
            onChange={e => update({ numericTermCount: Math.max(1, Math.min(10, +e.target.value)) })}
          />
        </div>
        <div className={styles.settingItem}>
          <label className={styles.settingLabel}>Кол-во членов с переменной (иксы)</label>
          <input
            className={styles.settingInput}
            type="number"
            min={1} max={10}
            value={settings.variableTermCount}
            onChange={e => update({ variableTermCount: Math.max(1, Math.min(10, +e.target.value)) })}
          />
        </div>
        <div className={styles.settingItem}>
          <label className={styles.settingLabel}>Символ для переменной</label>
          <input
            className={styles.settingInput}
            type="text"
            value={settings.variableSymbol}
            onChange={e => update({ variableSymbol: e.target.value || '' })}
          />
        </div>
        <div className={styles.settingItem}>
          <label className={styles.settingLabel}>Кол-во скобок</label>
          <input
            className={styles.settingInput}
            type="number"
            min={0} max={10}
            value={settings.bracketCount}
            onChange={e => update({ bracketCount: Math.max(0, Math.min(10, +e.target.value)) })}
          />
        </div>
        <div className={styles.settingItem}>
          <label className={styles.settingLabel}>Макс. значение знаменателя</label>
          <input
            className={styles.settingInput}
            type="number"
            min={2} max={100}
            value={settings.fractionDenominatorLimit}
            onChange={e => update({ fractionDenominatorLimit: Math.max(2, Math.min(100, +e.target.value)) })}
          />
        </div>
        <div className={styles.settingItem}>
          <label className={styles.settingLabel}>Кол-во десятичных знаков</label>
          <input
            className={styles.settingInput}
            type="number"
            min={0} max={10}
            value={settings.decimalPrecision}
            onChange={e => update({ decimalPrecision: Math.max(0, Math.min(10, +e.target.value)) })}
          />
        </div>
        <label className={styles.settingCheckbox}>
          <input
            type="checkbox"
            checked={settings.useCommonFractions}
            onChange={e => update({ useCommonFractions: e.target.checked })}
          />
          Обыкновенные дроби (3/4)
        </label>
        <label className={styles.settingCheckbox}>
          <input
            type="checkbox"
            checked={settings.useImproperFractions}
            onChange={e => update({ useImproperFractions: e.target.checked })}
          />
          Неправильные дроби (7/4)
        </label>
        <label className={styles.settingCheckbox}>
          <input
            type="checkbox"
            checked={settings.useMixedNumbers}
            onChange={e => update({ useMixedNumbers: e.target.checked })}
          />
          Смешанные дроби (1 1/4)
        </label>
        <label className={styles.settingCheckbox}>
          <input
            type="checkbox"
            checked={settings.useDecimalFractions}
            onChange={e => update({ useDecimalFractions: e.target.checked })}
          />
          Десятичные дроби (0,1)
        </label>
      </div>
      <button className={styles.generateButton} onClick={onGenerate}>
        Создать уравнение
      </button>
      <div>
        <br/>
        После создания уравнения, можно менять порядок членов, переносить из за знак равно, группировать, раскрывать скобки и выносить общий множитель за скобки. 
      </div>
    </div>
  );
}
