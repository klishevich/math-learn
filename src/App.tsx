import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useEquationState } from './hooks/useEquationState.ts';
import { useSelection } from './hooks/useSelection.ts';
import { useDragAndDrop } from './hooks/useDragAndDrop.ts';
import { EquationView } from './components/EquationView.tsx';
import { SettingsPanel } from './components/SettingsPanel.tsx';
import { Toolbar } from './components/Toolbar.tsx';
import { canGroupTerms } from './engine/validation.ts';
import { parseFraction } from './engine/fraction.ts';
import './App.css';

function App() {
  const {
    equation, settings, selectedTermIds,
    setSettings, setSelectedTermIds,
    generateNew, handleExpandBracket, handleGroupTerms,
    handleFactorOut, handleMultiplyEquation, handleReorderTerm,
    undo, canUndo,
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

  const selectedSet = new Set(selectedTermIds);

  return (
    <div className="app">
      <h1 className="app-title">Даша любит математику</h1>
      <SettingsPanel settings={settings} onChange={setSettings} onGenerate={generateNew} />
      <DndContext
        sensors={sensors}
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
      </DndContext>
      <Toolbar
        canSum={canSum}
        canFactorOut={canFactor}
        canUndo={canUndo}
        onSum={handleGroupTerms}
        onFactorOut={onFactorOut}
        onMultiplyEquation={onMultiplyEquation}
        onUndo={undo}
      />
    </div>
  );
}

export default App;
