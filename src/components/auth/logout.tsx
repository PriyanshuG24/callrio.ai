// src/components/auth/logout-button.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth-client';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace('/');
    router.refresh(); // Refresh to update the auth state
  };

  return (
    <Button variant="ghost" onClick={handleLogout} className='cursor-pointer flex items-center gap-2'>
      Logout
    </Button>
  );
}