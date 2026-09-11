/**
 * Sistema unificado de progreso.
 * Guarda XP total, niveles del home y misiones de cursos.
 */

const STORAGE_KEY = 'santiago-unified-progress';

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

export function loadProgress(): ProgressData {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
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
  } catch {
    // ignore
  }
}