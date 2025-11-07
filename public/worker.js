self.addEventListener('message', function(e) {
  const { type, data } = e.data;
  
  if (type === 'CALCULATE') {
    // Heavy calculation
    let result = 0;
    for (let i = 0; i < data; i++) {
      result += Math.sqrt(i);
    }
    
    self.postMessage({
      type: 'RESULT',
      data: result
    });
  }
});