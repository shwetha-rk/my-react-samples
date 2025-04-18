import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface ShortcutItem {
  key: string;
  description: string;
}

const shortcuts: ShortcutItem[] = [
  { key: '?', description: 'Show keyboard shortcuts' },
  { key: '/', description: 'Focus search' },
  { key: 'Esc', description: 'Close modal / menu' },
  { key: 'h', description: 'Go to home' },
  { key: 'a', description: 'Go to about' },
  { key: 'c', description: 'Go to contact' },
  { key: 't', description: 'Toggle theme' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcutsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative z-50"
          open={isOpen}
          onClose={onClose}
        >
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" aria-hidden="true" />
          
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel
                as={motion.div}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-md overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                    Keyboard Shortcuts
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {shortcuts.map((shortcut) => (
                    <div
                      key={shortcut.key}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-700 dark:text-gray-300">
                        {shortcut.description}
                      </span>
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 font-mono">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcutsModal;