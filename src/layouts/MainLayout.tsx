import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation, Location, useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, QuestionMarkCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import ThemeToggle from '../components/ThemeToggle';
import ScrollToTop from '../components/ScrollToTop';
import RouteProgressBar from '../components/RouteProgressBar';
import KeyboardShortcutsModal from '../components/KeyboardShortcutsModal';
import SearchModal from '../components/SearchModal';
import useKeyboardNav from '../hooks/useKeyboardNav';
import useFocusTrap from '../hooks/useFocusTrap';

const navigation = [
  { name: 'Home', to: '/' },
  { name: 'About', to: '/about' },
  { name: 'Contact', to: '/contact' },
  { name: 'Period Tracker', to: '/period-tracker' },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location;
  isCurrentPath: (path: string) => boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, location, isCurrentPath }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  
  useFocusTrap(menuRef as React.RefObject<HTMLElement>, isOpen);

  return createPortal(
    <Dialog 
      as="div" 
      className="md:hidden" 
      open={isOpen} 
      onClose={onClose}
      initialFocus={initialFocusRef}
    >
      <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" aria-hidden="true" />
      <Dialog.Panel 
        className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-800 px-6 py-6 sm:max-w-sm"
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-label="Main menu"
      >
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-xl font-bold text-gray-800 dark:text-white" 
            onClick={onClose}
            aria-label="Home page"
          >
            My React App
          </Link>
          <button
            type="button"
            className="rounded-md p-2 text-gray-700 dark:text-gray-300"
            onClick={onClose}
            ref={initialFocusRef}
            aria-label="Close menu"
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <nav className="mt-6 flow-root">
          <div className="space-y-2" role="menu">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className={`${
                  isCurrentPath(item.to)
                    ? 'bg-gray-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } block rounded-lg px-3 py-2 text-base font-medium`}
                onClick={onClose}
                role="menuitem"
                aria-current={isCurrentPath(item.to) ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-3 py-2">
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </Dialog.Panel>
    </Dialog>,
    document.body
  );
};

const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isCurrentPath = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  useKeyboardNav({
    onEscape: () => {
      if (mobileMenuOpen) setMobileMenuOpen(false);
      if (shortcutsOpen) setShortcutsOpen(false);
      if (searchOpen) setSearchOpen(false);
    },
  });

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if no input/textarea is focused
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case '?':
          e.preventDefault();
          setShortcutsOpen(true);
          break;
        case '/':
          e.preventDefault();
          setSearchOpen(true);
          break;
        case 'h':
          e.preventDefault();
          navigate('/');
          break;
        case 'a':
          e.preventDefault();
          navigate('/about');
          break;
        case 'c':
          e.preventDefault();
          navigate('/contact');
          break;
        case 't':
          e.preventDefault();
          document.querySelector<HTMLButtonElement>('button[aria-label="Toggle theme"]')?.click();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <RouteProgressBar />
      <header className="bg-white dark:bg-gray-800 shadow-lg">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center"
                aria-label="Home page"
              >
                <span className="text-xl font-bold text-gray-800 dark:text-white">My React App</span>
              </Link>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 rounded-lg group"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                <span>Search...</span>
                <kbd className="ml-3 text-xs text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400">/</kbd>
              </button>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex md:items-center md:space-x-6" role="navigation">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`${
                    isCurrentPath(item.to)
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  } px-3 py-2 text-sm font-medium transition-colors duration-150`}
                  aria-current={isCurrentPath(item.to) ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => setShortcutsOpen(true)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                aria-label="Show keyboard shortcuts"
              >
                <QuestionMarkCircleIcon className="h-5 w-5" />
              </button>
              <ThemeToggle />
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden space-x-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="rounded-lg p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-300"
                onClick={() => setMobileMenuOpen(true)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label="Open main menu"
              >
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </nav>

        <MobileMenu 
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          location={location}
          isCurrentPath={isCurrentPath}
        />
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8" role="main">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>
      
      <ScrollToTop />
      <KeyboardShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export default MainLayout;