/**
 * Estructura de datos de los cursos.
 * Cada lenguaje tiene niveles (misiones) posicionados en un mapa.
 *
 * `mapPosition` es el porcentaje dentro del mapa (0-100) donde
 * se dibuja la bandera del nivel.
 * Tú pones la imagen del mapa de fondo y ajustas las coordenadas.
 */

export type Dificultad = 'basico' | 'intermedio' | 'avanzado' | 'boss';

export interface Nivel {
  id: string;
  titulo: string;
  descripcion: string;
  dificultad: Dificultad;
  xp: number;
  duracion: string;
  mapPosition: { x: number; y: number }; // porcentaje del mapa
  requiere?: string[]; // ids de niveles previos
}

export interface CursoLenguaje {
  slug: string;
  nombre: string;
  icono: string;
  color: string;       // color hex para acentos
  descripcion: string;
  niveles: Nivel[];
}

export const CURSOS: CursoLenguaje[] = [
  {
    slug: 'python',
    nombre: 'Python',
    icono: '🐍',
    color: '#3776ab',
    descripcion: 'Lenguaje ideal para empezar. Sintaxis clara y muchísimas aplicaciones.',
    niveles: [
      {
        id: 'py-01',
        titulo: 'Introducción',
        descripcion: '¿Qué es Python y por qué aprenderlo?',
        dificultad: 'basico',
        xp: 10,
        duracion: '10 min',
        mapPosition: { x: 15, y: 75 },
      },
      {
        id: 'py-02',
        titulo: 'Variables y tipos',
        descripcion: 'Guarda información en variables.',
        dificultad: 'basico',
        xp: 20,
        duracion: '20 min',
        mapPosition: { x: 30, y: 60 },
        requiere: ['py-01'],
      },
      {
        id: 'py-03',
        titulo: 'Condicionales',
        descripcion: 'Toma decisiones en tu código con if/else.',
        dificultad: 'basico',
        xp: 20,
        duracion: '25 min',
        mapPosition: { x: 45, y: 70 },
        requiere: ['py-02'],
      },
      {
        id: 'py-04',
        titulo: 'Bucles',
        descripcion: 'Repite acciones con for y while.',
        dificultad: 'intermedio',
        xp: 30,
        duracion: '30 min',
        mapPosition: { x: 60, y: 55 },
        requiere: ['py-03'],
      },
      {
        id: 'py-05',
        titulo: 'Funciones',
        descripcion: 'Organiza tu código en bloques reutilizables.',
        dificultad: 'intermedio',
        xp: 30,
        duracion: '35 min',
        mapPosition: { x: 75, y: 65 },
        requiere: ['py-04'],
      },
      {
        id: 'py-06',
        titulo: 'POO',
        descripcion: 'Programación orientada a objetos.',
        dificultad: 'avanzado',
        xp: 40,
        duracion: '45 min',
        mapPosition: { x: 85, y: 45 },
        requiere: ['py-05'],
      },
      {
        id: 'py-boss',
        titulo: 'Proyecto Final',
        descripcion: 'Construye una app real con todo lo aprendido.',
        dificultad: 'boss',
        xp: 100,
        duracion: '3 horas',
        mapPosition: { x: 90, y: 20 },
        requiere: ['py-06'],
      },
    ],
  },
  {
    slug: 'java',
    nombre: 'Java',
    icono: '☕',
    color: '#f89820',
    descripcion: 'Lenguaje robusto usado en empresas y Android.',
    niveles: [
      {
        id: 'jv-01',
        titulo: 'Introducción',
        descripcion: '¿Qué es Java y la JVM?',
        dificultad: 'basico',
        xp: 10,
        duracion: '10 min',
        mapPosition: { x: 20, y: 70 },
      },
      {
        id: 'jv-02',
        titulo: 'Clases y objetos',
        descripcion: 'Todo en Java es un objeto.',
        dificultad: 'basico',
        xp: 20,
        duracion: '25 min',
        mapPosition: { x: 45, y: 60 },
        requiere: ['jv-01'],
      },
      {
        id: 'jv-03',
        titulo: 'Colecciones',
        descripcion: 'Listas, mapas y sets.',
        dificultad: 'intermedio',
        xp: 30,
        duracion: '40 min',
        mapPosition: { x: 70, y: 65 },
        requiere: ['jv-02'],
      },
      {
        id: 'jv-boss',
        titulo: 'Proyecto Final',
        descripcion: 'App de consola completa.',
        dificultad: 'boss',
        xp: 100,
        duracion: '3 horas',
        mapPosition: { x: 88, y: 30 },
        requiere: ['jv-03'],
      },
    ],
  },
  {
    slug: 'html',
    nombre: 'HTML',
    icono: '🌐',
    color: '#e34c26',
    descripcion: 'Estructura de toda página web.',
    niveles: [
      {
        id: 'ht-01',
        titulo: 'Etiquetas básicas',
        descripcion: 'Tu primera página web.',
        dificultad: 'basico',
        xp: 10,
        duracion: '15 min',
        mapPosition: { x: 25, y: 70 },
      },
      {
        id: 'ht-02',
        titulo: 'Formularios',
        descripcion: 'Inputs, botones y validación.',
        dificultad: 'basico',
        xp: 20,
        duracion: '20 min',
        mapPosition: { x: 55, y: 60 },
        requiere: ['ht-01'],
      },
      {
        id: 'ht-boss',
        titulo: 'Landing Page',
        descripcion: 'Maqueta una página completa.',
        dificultad: 'boss',
        xp: 100,
        duracion: '2 horas',
        mapPosition: { x: 85, y: 40 },
        requiere: ['ht-02'],
      },
    ],
  },
  {
    slug: 'css',
    nombre: 'CSS',
    icono: '🎨',
    color: '#264de4',
    descripcion: 'Dale estilo y vida a tus páginas.',
    niveles: [
      {
        id: 'cs-01',
        titulo: 'Selectores',
        descripcion: 'Cómo apuntar a elementos.',
        dificultad: 'basico',
        xp: 10,
        duracion: '15 min',
        mapPosition: { x: 20, y: 65 },
      },
      {
        id: 'cs-02',
        titulo: 'Flexbox',
        descripcion: 'Layouts modernos sin dolor.',
        dificultad: 'intermedio',
        xp: 30,
        duracion: '30 min',
        mapPosition: { x: 50, y: 55 },
        requiere: ['cs-01'],
      },
      {
        id: 'cs-03',
        titulo: 'Grid',
        descripcion: 'El sistema de grid bidimensional.',
        dificultad: 'intermedio',
        xp: 30,
        duracion: '35 min',
        mapPosition: { x: 75, y: 60 },
        requiere: ['cs-02'],
      },
      {
        id: 'cs-boss',
        titulo: 'Portafolio',
        descripcion: 'Diseña un portafolio responsive.',
        dificultad: 'boss',
        xp: 100,
        duracion: '3 horas',
        mapPosition: { x: 88, y: 25 },
        requiere: ['cs-03'],
      },
    ],
  },
  {
    slug: 'js',
    nombre: 'JavaScript',
    icono: '⚡',
    color: '#f7df1e',
    descripcion: 'El lenguaje de la web moderna.',
    niveles: [
      {
        id: 'js-01',
        titulo: 'Sintaxis básica',
        descripcion: 'Variables, tipos y operadores.',
        dificultad: 'basico',
        xp: 10,
        duracion: '15 min',
        mapPosition: { x: 15, y: 70 },
      },
      {
        id: 'js-02',
        titulo: 'DOM',
        descripcion: 'Manipula el HTML con JS.',
        dificultad: 'intermedio',
        xp: 30,
        duracion: '40 min',
        mapPosition: { x: 35, y: 55 },
        requiere: ['js-01'],
      },
      {
        id: 'js-03',
        titulo: 'Fetch y APIs',
        descripcion: 'Consume datos de internet.',
        dificultad: 'intermedio',
        xp: 30,
        duracion: '45 min',
        mapPosition: { x: 55, y: 65 },
        requiere: ['js-02'],
      },
      {
        id: 'js-04',
        titulo: 'Async/Await',
        descripcion: 'Manejo moderno de promesas.',
        dificultad: 'avanzado',
        xp: 40,
        duracion: '40 min',
        mapPosition: { x: 72, y: 50 },
        requiere: ['js-03'],
      },
      {
        id: 'js-boss',
        titulo: 'App con API',
        descripcion: 'App que consume una API real.',
        dificultad: 'boss',
        xp: 100,
        duracion: '4 horas',
        mapPosition: { x: 88, y: 30 },
        requiere: ['js-04'],
      },
    ],
  },
  {
    slug: 'php',
    nombre: 'PHP',
    icono: '🐘',
    color: '#777bb4',
    descripcion: 'Lenguaje clásico de backend web.',
    niveles: [
      {
        id: 'ph-01',
        titulo: 'Introducción',
        descripcion: 'Tu primer script PHP.',
        dificultad: 'basico',
        xp: 10,
        duracion: '15 min',
        mapPosition: { x: 25, y: 70 },
      },
      {
        id: 'ph-02',
        titulo: 'Formularios',
        descripcion: 'Recibe datos de usuarios.',
        dificultad: 'basico',
        xp: 20,
        duracion: '30 min',
        mapPosition: { x: 55, y: 60 },
        requiere: ['ph-01'],
      },
      {
        id: 'ph-boss',
        titulo: 'CRUD',
        descripcion: 'Sistema completo con base de datos.',
        dificultad: 'boss',
        xp: 100,
        duracion: '4 horas',
        mapPosition: { x: 85, y: 35 },
        requiere: ['ph-02'],
      },
    ],
  },
];

export function getCurso(slug: string) {
  return CURSOS.find((c) => c.slug === slug);
}

export const DIFICULTAD_COLORES: Record<Dificultad, string> = {
  basico: '#22c55e',      // verde
  intermedio: '#eab308',  // amarillo
  avanzado: '#ef4444',    // rojo
  boss: '#dc2626',        // rojo intenso
};

export const DIFICULTAD_LABELS: Record<Dificultad, string> = {
  basico: 'BÁSICO',
  intermedio: 'INTERMEDIO',
  avanzado: 'AVANZADO',
  boss: 'JEFE FINAL',
};