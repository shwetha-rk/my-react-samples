import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useSearchableContent } from '../hooks/useSearchableContent';

const Contact = () => {
  const { currentPageContent } = useSearchableContent();

  return (
    <>
      <Helmet>
        <title>Contact - My React App</title>
        <meta name="description" content="Get in touch with us" />
      </Helmet>

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
    </>
  );
};

export default Contact;