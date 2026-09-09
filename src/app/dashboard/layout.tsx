import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mi Progreso',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}