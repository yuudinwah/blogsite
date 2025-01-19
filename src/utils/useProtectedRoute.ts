// hooks/useProtectedRoute.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { User } from '@/interfaces/firebaseInterface';

export function useProtectedRoute(): User | null {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
    }
  }, [user, router]);

  return user;
}
