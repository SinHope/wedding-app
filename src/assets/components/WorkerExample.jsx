import React, { useState, useEffect, useRef } from 'react';

function WorkerExample() {
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const workerRef = useRef(null);

  // Initialize worker when component mounts
  useEffect(() => {
    // Create the worker
    workerRef.current = new Worker('/worker.js');
    
    // Listen for messages from worker
    workerRef.current.onmessage = function(e) {
      if (e.data.type === 'RESULT') {
        setResult(e.data.data);
        setIsCalculating(false);
      }
    };
    
    // Handle errors
    workerRef.current.onerror = function(error) {
      console.error('Worker error:', error);
      setIsCalculating(false);
    };
    
    // Cleanup: terminate worker when component unmounts
    return () => {
      workerRef.current.terminate();
    };
  }, []);

  const handleCalculate = () => {
    setIsCalculating(true);
    setResult(null);
    
    // Send message to worker
    workerRef.current.postMessage({
      type: 'CALCULATE',
      data: 20000000000
    });
  };

    const clickHandler = () =>{
    console.log('this button is clicked!')
  }

  return (
    <div>
      <h1>Web Worker in React</h1>
      <button onClick={handleCalculate} disabled={isCalculating}>
        {isCalculating ? 'Calculating...' : 'Start Calculation'}
      </button>
      {result && <p>Result: {result}</p>}

      <p>Try clicking me while working: <button onClick={clickHandler}>Click me!</button></p>

    </div>
  );
}

export default WorkerExample;

