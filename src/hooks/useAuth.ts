'use client';

import { useEffect, useState, useCallback } from 'react';
import { account } from '@/lib/appwrite';

interface AuthUser {
  $id: string;
  name: string;
  email: string;
}

/**
 * Hook simple para obtener el usuario autenticado.
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const current = await account.get();
      setUser({
        $id: current.$id,
        name: current.name,
        email: current.email,
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      window.location.href = '/';
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cerrar sesión';
      setError(message);
    }
  };

  return { user, loading, error, refresh, logout };
}