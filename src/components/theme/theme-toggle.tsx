// src/components/theme/theme-toggle.tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
    variant="ghost"
    size="icon"
    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    aria-label="Toggle theme"
>
  {theme === 'light' ? (
    <Sun className='h-5 w-5 rotate-0 scale-90 transition-all dark:rotate-180 dark:scale-0' />
  ) : (
    <Moon className='h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
  )}
</Button>
  );
}