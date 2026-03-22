import type { Term } from './term.ts';

export interface EquationSide {
  terms: Term[];
}

export interface Equation {
  left: EquationSide;
  right: EquationSide;
}
