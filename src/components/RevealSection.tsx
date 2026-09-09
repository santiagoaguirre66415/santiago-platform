'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Sección que se revela al entrar en viewport (Intersection Observer).
 * Respeta prefers-reduced-motion.
 */
interface RevealSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Callback cuando se desbloquea (entra en vista) */
  onUnlock?: () => void;
  /** Umbral de visibilidad (0-1) */
  threshold?: number;
}

export default function RevealSection({
  children,
  id,
  className = '',
  onUnlock,
  threshold = 0.2,
}: RevealSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const unlockedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respetar preferencia de movimiento reducido
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setVisible(true);
      if (!unlockedRef.current) {
        unlockedRef.current = true;
        onUnlock?.();
      }
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (!unlockedRef.current) {
            unlockedRef.current = true;
            onUnlock?.();
          }
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onUnlock, threshold]);

  return (
    <section
      ref={ref}
      id={id}
      className={`reveal-section ${visible ? 'reveal-visible' : ''} ${className}`}
    >
      {children}
    </section>
  );
}