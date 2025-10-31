'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth-client';
import { ArrowBigLeft } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <Button variant="outline" onClick={handleLogout} className='cursor-pointer flex items-center gap-2 hover:bg-gray-500 dark:hover:bg-gray-800'>
      <ArrowBigLeft className="h-4 w-4" />
      Logout  
    </Button>
  );
}
