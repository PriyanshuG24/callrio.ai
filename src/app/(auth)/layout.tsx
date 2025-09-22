// src/app/(auth)/layout.tsx
import { AppLayout } from '@/components/layout/app-layout';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout>
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-xl bg-white shadow p-6">
          {children}
        </div>
      </div>
    </AppLayout>
  );
}