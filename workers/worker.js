// worker.js
const performTask = () => {
    for (let a = 0; a < 10000000000; a++) {}
    return "slow hello";
  };
  
  process.on('message', (msg) => {
    if (msg === 'startTask') {
      const result = performTask();
      process.send(result);
    }
  });
  