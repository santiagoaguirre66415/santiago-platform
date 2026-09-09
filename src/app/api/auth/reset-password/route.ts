import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { Query } from 'node-appwrite';
import { serverUsers, serverDatabases } from '@/lib/appwrite-server';

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      token?: string;
      email?: string;
      password?: string;
    };

    const token = body.token?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!token || !email || !password) {
      return NextResponse.json(
        { error: 'Faltan datos' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

    const tokenHash = hashToken(token);

    const result = await serverDatabases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_PASSWORD_RESETS_COLLECTION_ID!,
      [
        Query.equal('token_hash', tokenHash),
        Query.equal('email', email),
        Query.equal('used', false),
        Query.limit(1),
      ]
    );

    if (result.total === 0 || !result.documents[0]) {
      return NextResponse.json(
        { error: 'Enlace inválido o ya usado' },
        { status: 400 }
      );
    }

    const doc = result.documents[0];
    const expiresAt = new Date(doc.expires_at as string);

    if (expiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { error: 'El enlace ha expirado. Solicita uno nuevo.' },
        { status: 400 }
      );
    }

    // Actualizar contraseña en Appwrite Auth
    await serverUsers.updatePassword(doc.user_id as string, password);

    // Marcar token como usado
    await serverDatabases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_PASSWORD_RESETS_COLLECTION_ID!,
      doc.$id,
      { used: true }
    );

    return NextResponse.json({ message: 'Contraseña actualizada' });
  } catch (err) {
    console.error('reset-password:', err);
    return NextResponse.json(
      { error: 'No se pudo actualizar la contraseña' },
      { status: 500 }
    );
  }
}