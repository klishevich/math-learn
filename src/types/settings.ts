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

export const DEFAULT_SETTINGS: EquationSettings = {
  numericTermCount: 2,
  variableTermCount: 2,
  variableSymbol: '🍎',
  bracketCount: 1,
  useCommonFractions: true,
  fractionDenominatorLimit: 10,
  useImproperFractions: false,
  useMixedNumbers: true,
  useDecimalFractions: true,
  decimalPrecision: 1,
};
