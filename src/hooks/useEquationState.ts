import { useState, useCallback, useRef } from 'react';
import type { Equation } from '../types/equation.ts';
import type { EquationSettings } from '../types/settings.ts';
import { DEFAULT_SETTINGS } from '../types/settings.ts';
import { generateEquation } from '../engine/equation-generator.ts';
import { expandBracket } from '../engine/operations/expand-bracket.ts';
import { groupTerms } from '../engine/operations/group-sum.ts';
import { factorOut } from '../engine/operations/factor-out.ts';
import { divideEquation, multiplyEquation } from '../engine/operations/multiply-divide.ts';
import { reorderTerm } from '../engine/operations/reorder.ts';
import type { Fraction } from '../types/fraction.ts';
import type { Side } from '../types/term.ts';

function isEquationSolved(eq: Equation): boolean {
  const { left, right } = eq;
  const l = left.terms;
  const r = right.terms;

  // variable = number or number = variable
  const isVarAlone = (terms: Equation['left']['terms']) =>
    terms.length === 1 &&
    terms[0].kind === 'variable' &&
    terms[0].sign === '+' &&
    terms[0].coefficient.numerator === 1 &&
    terms[0].coefficient.denominator === 1;

  const isNumeric = (terms: Equation['left']['terms']) =>
    terms.length === 1 && terms[0].kind === 'numeric';

  return (isVarAlone(l) && isNumeric(r)) || (isNumeric(l) && isVarAlone(r));
}

export function useEquationState() {
  const [settings, setSettings] = useState<EquationSettings>(DEFAULT_SETTINGS);
  const [equation, setEquation] = useState<Equation>(() => generateEquation(DEFAULT_SETTINGS));
  const [history, setHistory] = useState<Equation[]>([]);
  const [selectedTermIds, setSelectedTermIds] = useState<string[]>([]);
  const [solveTime, setSolveTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const applyOperation = useCallback((op: (eq: Equation) => Equation) => {
    setEquation(prev => {
      setHistory(h => [...h, prev]);
      const next = op(prev);
      if (isEquationSolved(next)) {
        setSolveTime(Math.round((Date.now() - startTimeRef.current) / 1000));
      }
      return next;
    });
    setSelectedTermIds([]);
  }, []);

  const generateNew = useCallback(() => {
    setEquation(prev => {
      setHistory(h => [...h, prev]);
      return generateEquation(settings);
    });
    setSelectedTermIds([]);
    setSolveTime(null);
    startTimeRef.current = Date.now();
  }, [settings]);

  const handleExpandBracket = useCallback((bracketTermId: string) => {
    if (confirm('Раскрыть скобки?')) {
      applyOperation(eq => expandBracket(eq, bracketTermId));
    }
  }, [applyOperation]);

  const handleGroupTerms = useCallback(() => {
    applyOperation(eq => groupTerms(eq, selectedTermIds));
  }, [applyOperation, selectedTermIds]);

  const handleFactorOut = useCallback((factor: Fraction, includeVariable: boolean) => {
    applyOperation(eq => factorOut(eq, selectedTermIds, factor, includeVariable, settings.variableSymbol));
  }, [applyOperation, selectedTermIds, settings.variableSymbol]);

  const handleMultiplyEquation = useCallback((factor: Fraction) => {
    applyOperation(eq => multiplyEquation(eq, factor));
  }, [applyOperation]);

  const handleDivideEquation = useCallback((factor: Fraction) => {
    applyOperation(eq => divideEquation(eq, factor));
  }, [applyOperation]);

  const handleReorderTerm = useCallback((termId: string, targetSide: Side, targetIndex: number) => {
    applyOperation(eq => reorderTerm(eq, termId, targetSide, targetIndex));
  }, [applyOperation]);

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const last = newHistory.pop()!;
      setEquation(last);
      setSelectedTermIds([]);
      return newHistory;
    });
  }, []);

  return {
    equation,
    settings,
    selectedTermIds,
    solveTime,
    setSettings,
    setSelectedTermIds,
    generateNew,
    handleExpandBracket,
    handleGroupTerms,
    handleFactorOut,
    handleMultiplyEquation,
    handleDivideEquation,
    handleReorderTerm,
    undo,
    canUndo: history.length > 0,
  };
}
