import { NextResponse } from 'next/server';
import { createHash, randomBytes } from 'crypto';
import { ID, Query } from 'node-appwrite';
import { Resend } from 'resend';
import { serverUsers, serverDatabases } from '@/lib/appwrite-server';

const resend = new Resend(process.env.RESEND_API_KEY);

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }

    // Misma respuesta siempre (no revelar si el email existe)
    const okResponse = NextResponse.json({
      message:
        'Si existe una cuenta con ese email, recibirás un enlace para restablecer la contraseña.',
    });

    let userId: string | null = null;

    try {
      const list = await serverUsers.list([Query.equal('email', email)]);
      if (list.total > 0 && list.users[0]) {
        userId = list.users[0].$id;
      }
    } catch {
      return okResponse;
    }

    if (!userId) {
      return okResponse;
    }

    const token = randomBytes(32).toString('hex');
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1h

    await serverDatabases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_PASSWORD_RESETS_COLLECTION_ID!,
      ID.unique(),
      {
        email,
        user_id: userId,
        token_hash: tokenHash,
        expires_at: expiresAt,
        used: false,
      }
    );

    const origin =
      request.headers.get('origin') ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000';
    const resetUrl = `${origin}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: email,
      subject: 'Restablece tu contraseña',
      html: `
        <p>Hola,</p>
        <p>Pediste restablecer tu contraseña. El enlace es válido por 1 hora:</p>
        <p><a href="${resetUrl}">Restablecer contraseña</a></p>
        <p>Si no fuiste tú, ignora este correo.</p>
      `,
    });

    return okResponse;
  } catch (err) {
    console.error('forgot-password:', err);
    return NextResponse.json(
      { error: 'No se pudo procesar la solicitud' },
      { status: 500 }
    );
  }
}