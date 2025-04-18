import React, { useState } from 'react';
import { useTheme, ThemeColor } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon, SwatchIcon } from '@heroicons/react/24/outline';
import { Popover } from '@headlessui/react';

const themeColors: { color: ThemeColor; label: string; className: string }[] = [
  { color: 'blue', label: 'Blue', className: 'bg-blue-500' },
  { color: 'green', label: 'Green', className: 'bg-green-500' },
  { color: 'purple', label: 'Purple', className: 'bg-purple-500' },
  { color: 'pink', label: 'Pink', className: 'bg-pink-500' },
];

const ThemeToggle = () => {
  const { mode, color, toggleMode, setColor } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      {isOpen}
      <button
        onClick={toggleMode}
        className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        aria-label="Toggle dark mode"
      >
        {mode === 'dark' ? (
          <SunIcon className="h-5 w-5" />
        ) : (
          <MoonIcon className="h-5 w-5" />
        )}
      </button>

      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white ${
                open ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
              aria-label="Change color theme"
            >
              <SwatchIcon className="h-5 w-5" />
            </Popover.Button>

            <Popover.Panel className="absolute right-0 mt-2 w-48 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 p-2 space-y-1">
              {themeColors.map((theme) => (
                <button
                  key={theme.color}
                  onClick={() => {
                    setColor(theme.color);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                    color === theme.color
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full mr-2 ${theme.className}`} />
                  <span className="text-gray-900 dark:text-white">{theme.label}</span>
                </button>
              ))}
            </Popover.Panel>
          </>
        )}
      </Popover>
    </div>
  );
};

export default ThemeToggle;