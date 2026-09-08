'use client';

import { useState } from 'react';
import { databases } from '@/lib/appwrite';

export default function TestDB() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      // Intentar listar documentos de la tabla users
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!
      );
      setResult(`✅ Conexión exitosa! Documentos en users: ${response.total}`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Test de Conexión Appwrite</h1>
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold disabled:opacity-50 transition"
        >
          {loading ? 'Probando...' : 'Probar Conexión'}
        </button>
        {result && (
          <p className="mt-6 text-lg">{result}</p>
        )}
      </div>
    </main>
  );
}