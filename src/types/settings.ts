export interface EquationSettings {
  numericTermCount: number;
  variableTermCount: number;
  variableSymbol: string;
  bracketCount: number;
  useCommonFractions: boolean;
  fractionDenominatorLimit: number;
  useImproperFractions: boolean;
  useMixedNumbers: boolean;
  useDecimalFractions: boolean;
  decimalPrecision: number;
}

export const VARIABLE_EMOJIS = ['🐱', '🐶', '🦊', '🐸', '🐵', '🦄', '🐙', '🦋', '🐢', '🐧', '🦀', '🐬', '🌟', '🍎', '🚀', '🎸', '⚡', '🔥', '🌈', '💎'];

export function randomEmoji() {
  return VARIABLE_EMOJIS[Math.floor(Math.random() * VARIABLE_EMOJIS.length)];
}

export const DEFAULT_SETTINGS: EquationSettings = {
  numericTermCount: 2,
  variableTermCount: 2,
  variableSymbol: randomEmoji(),
  bracketCount: 1,
  useCommonFractions: true,
  fractionDenominatorLimit: 10,
  useImproperFractions: false,
  useMixedNumbers: false,
  useDecimalFractions: true,
  decimalPrecision: 1,
};
