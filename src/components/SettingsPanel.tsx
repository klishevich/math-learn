import type { EquationSettings } from '../types/settings.ts';
import { randomEmoji } from '../types/settings.ts';
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

  const insertRandomEmoji = () => {
    update({ variableSymbol: randomEmoji() });
  };

  return (
    <div className={styles.settingsPanel}>
      <div className={styles.settingsTitle}>Параметры уравнения</div>
      <div className={styles.settingsGrid}>
        <div className={styles.settingItem}>
          <label className={styles.settingLabel}>Кол-во свободных членов (числа)</label>
          <input
            className={styles.settingInput}
            type="text"
            value={settings.numericTermCount}
            onChange={e => update({ numericTermCount: isNaN(+e.target.value) ? 1 : +e.target.value })}
          />
        </div>
        <div className={styles.settingItem}>
          <label className={styles.settingLabel}>Кол-во членов с переменной (иксы)</label>
          <input
            className={styles.settingInput}
            type="text"
            value={settings.variableTermCount}
            onChange={e => update({ variableTermCount: isNaN(+e.target.value) ? 1 : +e.target.value })}
          />
        </div>
        <div className={styles.settingItem}>
          <label className={styles.settingLabel}>Символ для переменной</label>
          <div className={styles.settingInputRow}>
            <input
              className={styles.settingInput}
              type="text"
              value={settings.variableSymbol}
              onChange={e => update({ variableSymbol: e.target.value || '' })}
            />
            <button className={styles.emojiButton} onClick={insertRandomEmoji} type="button" title="Случайный эмодзи">🎲</button>
          </div>
        </div>
        <div className={styles.settingItem}>
          <label className={styles.settingLabel}>Кол-во скобок</label>
          <input
            className={styles.settingInput}
            type="text"
            value={settings.bracketCount}
            onChange={e => update({ bracketCount: isNaN(+e.target.value) ? 1 : +e.target.value })}
          />
        </div>
        <div className={styles.settingItem}>
          <label className={styles.settingLabel}>Макс. значение знаменателя</label>
          <input
            className={styles.settingInput}
            type="text"
            value={settings.fractionDenominatorLimit}
            onChange={e => update({ fractionDenominatorLimit: isNaN(+e.target.value) ? 2 : +e.target.value })}
          />
        </div>
        <div className={styles.settingItem}>
          <label className={styles.settingLabel}>Кол-во десятичных знаков</label>
          <input
            className={styles.settingInput}
            type="text"
            value={settings.decimalPrecision}
            onChange={e => update({ decimalPrecision: isNaN(+e.target.value) ? 0 : +e.target.value  })}
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
