import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
}

const CountdownTimer: React.FC<CountdownTimerProps> = React.memo(() => {
  const [time, setTime] = useState<number>(180); // 3 minutes in seconds
  const [cycles, setCycles] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          setCycles((prevCycles) => prevCycles + 1);
          return 180;
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [cycles]); 
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <span>{formatTime(time)}</span>
  );
}, (prevProps, nextProps) => true);

export default CountdownTimer;
