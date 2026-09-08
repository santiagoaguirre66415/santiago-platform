'use client';

import { useEffect, useState } from 'react';
import { account } from '@/lib/appwrite';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (err) {
        window.location.href = '/login';
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    await account.deleteSession('current');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-xl">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 border border-red-400/30 rounded-lg hover:bg-red-500/30 transition"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-4">
            ¡Hola, {user?.name}! 👋
          </h2>
          <p className="text-gray-300">{user?.email}</p>
        </div>
      </div>
    </main>
  );
}