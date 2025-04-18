import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useSearchableContent, SearchableSection } from '../hooks/useSearchableContent';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { allContent } = useSearchableContent();

  const filteredResults = useMemo(() => {
    if (query === '') return allContent;
    
    const searchTerms = query.toLowerCase().split(' ');
    return allContent.filter((item) => {
      const searchableText = `${item.title} ${item.description} ${item.content}`.toLowerCase();
      return searchTerms.every(term => searchableText.includes(term));
    });
  }, [query, allContent]);

  const handleResultClick = (result: SearchableSection) => {
    navigate(result.path);
    // If the result has a heading, append it as a hash to scroll to that section
    if (result.heading) {
      const headingId = result.heading.toLowerCase().replace(/\s+/g, '-');
      setTimeout(() => {
        document.getElementById(headingId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < filteredResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          handleResultClick(filteredResults[selectedIndex]);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative z-50"
          onClose={onClose}
          open={isOpen}
          static
        >
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" aria-hidden="true" />

          <div className="fixed inset-0 overflow-y-auto pt-[20vh]">
            <div className="flex min-h-full items-start justify-center p-4">
              <Dialog.Panel
                as={motion.div}
                initial={{ scale: 0.95, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: -20 }}
                className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-2xl"
              >
                <div className="flex items-center border-b border-gray-200 dark:border-gray-700">
                  <MagnifyingGlassIcon className="h-5 w-5 ml-4 text-gray-500 dark:text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full py-4 px-3 text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-transparent border-0 focus:outline-none focus:ring-0"
                    placeholder="Search..."
                    aria-label="Search content"
                  />
                  <button
                    onClick={onClose}
                    className="p-2 mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    aria-label="Close search"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {filteredResults.length > 0 ? (
                  <div className="max-h-[60vh] overflow-y-auto">
                    {filteredResults.map((result, index) => (
                      <motion.button
                        key={result.id}
                        className={`w-full text-left px-4 py-3 flex flex-col ${
                          index === selectedIndex
                            ? 'bg-blue-50 dark:bg-blue-900/20'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                        onClick={() => handleResultClick(result)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <span className="font-medium text-gray-900 dark:text-white">
                          {result.title}
                          {result.heading && (
                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                              in {result.heading}
                            </span>
                          )}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {result.description}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {result.path}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No results found
                  </div>
                )}

                {query === '' && (
                  <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                      <span>
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 font-mono text-xs">↑</kbd>
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 font-mono text-xs ml-1">↓</kbd>
                        to navigate
                      </span>
                      <span>
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 font-mono text-xs">Enter</kbd>
                        to select
                      </span>
                      <span>
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 font-mono text-xs">Esc</kbd>
                        to close
                      </span>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;