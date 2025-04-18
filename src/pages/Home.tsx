import React from 'react';
import { motion } from 'framer-motion';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { useSearchableContent } from '../hooks/useSearchableContent';

const Home = () => {
  const { currentPageContent } = useSearchableContent();

  useDocumentHead({
    title: 'Home',
    description: 'Welcome to our modern React application'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {currentPageContent.map((section) => (
        <section key={section.id} className="space-y-4">
          <h2
            id={section.heading?.toLowerCase().replace(/\s+/g, '-')}
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            {section.heading}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {section.content}
          </p>
        </section>
      ))}
    </motion.div>
  );
};

export default Home;