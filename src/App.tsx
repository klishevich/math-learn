import { DndContext, DragOverlay, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { useEquationState } from './hooks/useEquationState.ts';
import { useSelection } from './hooks/useSelection.ts';
import { useDragAndDrop } from './hooks/useDragAndDrop.ts';
import { EquationView } from './components/EquationView.tsx';
import { TermView } from './components/TermView.tsx';
import { SettingsPanel } from './components/SettingsPanel.tsx';
import { Toolbar } from './components/Toolbar.tsx';
import { CelebrationView } from './components/CelebrationView.tsx';
import { canGroupTerms } from './engine/validation.ts';
import { parseFraction } from './engine/fraction.ts';
import './App.css';

function App() {
  const {
    equation, settings, selectedTermIds, solveTime,
    setSettings, setSelectedTermIds,
    generateNew, handleExpandBracket, handleGroupTerms,
    handleFactorOut, handleMultiplyEquation, handleDivideEquation,
    handleReorderTerm, undo, canUndo,
  } = useEquationState();

  const { toggleSelection } = useSelection(equation, selectedTermIds, setSelectedTermIds);

  const {
    draggedTermId, handleDragStart, handleDragEnd, handleDragCancel,
  } = useDragAndDrop(equation, handleReorderTerm);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
  );

  const canSum = selectedTermIds.length >= 2 && canGroupTerms(equation, selectedTermIds).valid;
  const canFactor = selectedTermIds.length >= 2;

  const onFactorOut = (factorInput: string, includeVariable: boolean) => {
    const factor = parseFraction(factorInput);
    if (!factor) {
      alert('Invalid factor. Enter an integer or fraction (e.g., 2, 3/4, -1/2)');
      return;
    }
    handleFactorOut(factor, includeVariable);
  };

  const onMultiplyEquation = (valueInput: string) => {
    const factor = parseFraction(valueInput);
    if (!factor) {
      alert('Invalid value. Enter an integer or fraction (e.g., 2, 3/4, -1/2)');
      return;
    }
    handleMultiplyEquation(factor);
  };

  const onDivideEquation = (valueInput: string) => {
    const factor = parseFraction(valueInput);
    if (!factor) {
      alert('Invalid value. Enter an integer or fraction (e.g., 2, 3/4, -1/2)');
      return;
    }
    handleDivideEquation(factor);
  };

  const selectedSet = new Set(selectedTermIds);

  const allTerms = [...equation.left.terms, ...equation.right.terms];
  const draggedTerm = draggedTermId ? allTerms.find(t => t.id === draggedTermId) ?? null : null;

  return (
    <div className="app">
      <h1 className="app-title">Даша любит математику</h1>
      <SettingsPanel settings={settings} onChange={setSettings} onGenerate={generateNew} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <EquationView
          equation={equation}
          selectedTermIds={selectedSet}
          draggedTermId={draggedTermId}
          onSelect={toggleSelection}
          onBracketExpand={handleExpandBracket}
        />
        <DragOverlay dropAnimation={null}>
          {draggedTerm && (
            <TermView
              term={draggedTerm}
              isSelected={false}
              isFirst={true}
              isDragging={true}
              onSelect={() => {}}
              onBracketExpand={() => {}}
            />
          )}
        </DragOverlay>
      </DndContext>
      {solveTime !== null && <CelebrationView solveTime={solveTime} />}
      <Toolbar
        canSum={canSum}
        canFactorOut={canFactor}
        canUndo={canUndo}
        onSum={handleGroupTerms}
        onFactorOut={onFactorOut}
        onMultiplyEquation={onMultiplyEquation}
        onDivideEquation={onDivideEquation}
        onUndo={undo}
      />
    </div>
  );
}

export default App;
