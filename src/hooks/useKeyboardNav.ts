import { useCallback, useEffect } from 'react';

interface KeyboardNavProps {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onTab?: (event: KeyboardEvent) => void;
}

export const useKeyboardNav = ({
  onEscape,
  onEnter,
  onArrowUp,
  onArrowDown,
  onTab,
}: KeyboardNavProps) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onEscape?.();
          break;
        case 'Enter':
          onEnter?.();
          break;
        case 'ArrowUp':
          onArrowUp?.();
          break;
        case 'ArrowDown':
          onArrowDown?.();
          break;
        case 'Tab':
          onTab?.(event);
          break;
        default:
          break;
      }
    },
    [onEscape, onEnter, onArrowUp, onArrowDown, onTab]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

export default useKeyboardNav;