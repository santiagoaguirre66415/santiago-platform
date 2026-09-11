/**
 * Sistema unificado de progreso (v2).
 *
 * v2 incluye migración automática: limpia claves viejas
 * una sola vez para resetear el progreso de usuarios existentes.
 */

const STORAGE_KEY = 'santiago-unified-progress-v2';

// Claves viejas que se limpian la primera vez que un usuario entra en v2
const LEGACY_KEYS = [
  'santiago-unified-progress',
  'santiago-portfolio-progress-v6',
  'santiago-portfolio-progress-v5',
  'santiago-portfolio-progress-v4',
  'santiago-courses-progress',
];

export interface ProgressData {
  xp: number;
  nivelesHome: number[];
  logrosHome: number[];
  misionesCompletadas: string[];
}

export const DEFAULT_PROGRESS: ProgressData = {
  xp: 0,
  nivelesHome: [1],
  logrosHome: [1, 2],
  misionesCompletadas: [],
};

/**
 * Limpia claves viejas de localStorage.
 * Solo se ejecuta la primera vez que el usuario entra en v2.
 */
function migrateLegacy() {
  if (typeof window === 'undefined') return;
  try {
    const alreadyMigrated = localStorage.getItem('santiago-progress-v2-migrated');
    if (alreadyMigrated === 'true') return;

    // Borrar claves viejas
    LEGACY_KEYS.forEach((key) => {
      localStorage.removeItem(key);
    });

    // Marcar como migrado
    localStorage.setItem('santiago-progress-v2-migrated', 'true');
  } catch {
    // ignore
  }
}

export function loadProgress(): ProgressData {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;

  // Ejecutar migración una sola vez
  migrateLegacy();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
      nivelesHome: Array.isArray(parsed.nivelesHome) ? parsed.nivelesHome : [1],
      logrosHome: Array.isArray(parsed.logrosHome) ? parsed.logrosHome : [1, 2],
      misionesCompletadas: Array.isArray(parsed.misionesCompletadas)
        ? parsed.misionesCompletadas
        : [],
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(data: ProgressData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function addXp(amount: number): number {
  const current = loadProgress();
  const newXp = current.xp + amount;
  saveProgress({ ...current, xp: newXp });
  return newXp;
}

export function getXp(): number {
  return loadProgress().xp;
}

export function resetProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    // NO borrar el marcador de migración para no re-limpiar
  } catch {
    // ignore
  }
}