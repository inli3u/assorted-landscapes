import React, { useState, useEffect } from 'react';
import ArrayUtils from '../libraries/ArrayUtil';
import Render from '../libraries/Render';
import './App.css';

const initialControls = {
  algorithm: 'quicksort',
  grainularity: 20,
  steps: 20,
  scale: 50
};

const initialArray = ArrayUtils.resizeMid([], initialControls.grainularity);



function App() {
  const [controls, setControls] = useState(initialControls);
  const [array, setArray] = useState(initialArray);

  useEffect(() => {
    let sortLog = ArrayUtils.sortArray(array, controls.algorithm);
    Render.draw(sortLog, controls.steps, controls.scale / 100);
  }, [controls]);

  function handleAlgorithmChange(e) {
    setControls({...controls, algorithm: e.target.value});
  }

  function handleGrainularityChange(e) {
    setControls({...controls, grainularity: e.target.value});
    setArray(ArrayUtils.resizeMid(array, e.target.value));
  }

  function handleStepsChange(e) {
    setControls({...controls, steps: e.target.value});
  }

  function handleScaleChange(e) {
    setControls({...controls, scale: e.target.value});
  }

  return (
      <div className="grid">
        <div className="controls">

          <h1>As<strong>sorted</strong> Landscapes</h1>

          <div className="control select">
            <label htmlFor="algo">Algorithm</label>
            <select id="algo" value={controls.algorithm} onChange={handleAlgorithmChange}>
              <option value="quicksort">Quicksort</option>
              <option value="mergesort">Mergesort (bottom-up)</option>
            </select>
          </div>

          <div className="control knob">
            <label htmlFor="grainularity">Array length</label>
            <input type="range" id="grainularity" min="2" max="50" value={controls.grainularity} onChange={handleGrainularityChange} />
          </div>

          <div className="control knob">
            <label htmlFor="steps">Sorting iterations</label>
            <input type="range" id="steps" min="2" max="50" value={controls.steps} onChange={handleStepsChange} />
          </div>

          <div className="control knob">
              <label htmlFor="scale">Y-scale</label>
            <input type="range" id="scale" min="1" max="100" value={controls.scale} onChange={handleScaleChange} />
          </div>

          {/* <div className="control button">
            <button>Randomize Array</button>
          </div>

          <div className="control button">
            <button>Randomize Controls</button>
          </div> */}

        </div>

        <canvas></canvas>
      </div>
  );
}

export default App;
