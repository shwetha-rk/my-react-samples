import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useRouteProgress = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const startLoading = () => {
      setIsLoading(true);
      setProgress(0);
      
      const incrementProgress = () => {
        setProgress(prev => {
          const next = prev + (100 - prev) * 0.1;
          return Math.min(next, 99);
        });
      };

      timeoutId = setInterval(incrementProgress, 100);
    };

    const stopLoading = () => {
      setProgress(100);
      clearInterval(timeoutId);
      
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    };

    startLoading();
    const cleanup = setTimeout(stopLoading, 500);

    return () => {
      clearTimeout(cleanup);
      clearInterval(timeoutId);
    };
  }, [location]);

  return { isLoading, progress };
};