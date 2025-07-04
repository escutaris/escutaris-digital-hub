import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onSearch?: () => void;
  onToggleTheme?: () => void;
}

export function useKeyboardShortcuts({ onSearch, onToggleTheme }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + K para busca
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        onSearch?.();
      }

      // Ctrl/Cmd + Shift + L para alternar tema
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'L') {
        event.preventDefault();
        onToggleTheme?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSearch, onToggleTheme]);
}