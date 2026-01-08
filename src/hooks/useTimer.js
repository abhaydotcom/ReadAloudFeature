import { useEffect, useRef, useState } from "react";

export const useTimer = (duration, onTimeUp) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef(null);

  const startTimer = () => {
    setTimeLeft(duration);
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return { timeLeft, startTimer, stopTimer };
};
