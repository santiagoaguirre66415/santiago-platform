import { Client, Users, Databases } from 'node-appwrite';

/**
 * Appwrite solo en servidor (API key).
 * No importar desde componentes 'use client'.
 */
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

export const serverUsers = new Users(client);
export const serverDatabases = new Databases(client);