'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RootState } from '@/store';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();
console.log('ProtectedRoute token:', token);
  useEffect(() => {
    if (!token) {
      router.replace('/auth');
    }
  }, [token, router]);

  // Optionally, show a loading spinner while checking
  if (!token) return null;

  return <>{children}</>;
}