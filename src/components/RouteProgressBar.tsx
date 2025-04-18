import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouteProgress } from '../hooks/useRouteProgress';

const RouteProgressBar = () => {
  const { isLoading, progress } = useRouteProgress();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200 dark:bg-gray-700"
        >
          <motion.div
            className="h-full bg-blue-600 dark:bg-blue-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RouteProgressBar;