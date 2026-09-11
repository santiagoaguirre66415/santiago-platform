/**
 * Estructura de datos de los cursos.
 * Cada lenguaje tiene niveles (misiones) posicionados en un mapa.
 */

export type Dificultad = 'basico' | 'intermedio' | 'avanzado' | 'boss';

export interface QuizPregunta {
  pregunta: string;
  opciones: string[];
  correcta: number;
  explicacion: string;
}

export interface ContenidoMision {
  teoria: string[];
  ejemplo?: string;
  quiz?: QuizPregunta[];
}

export interface Nivel {
  id: string;
  titulo: string;
  descripcion: string;
  dificultad: Dificultad;
  xp: number;
  duracion: string;
  mapPosition: { x: number; y: number };
  requiere?: string[];
  contenido?: ContenidoMision;
}

export interface CursoLenguaje {
  slug: string;
  nombre: string;
  icono: string;
  color: string;
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
        contenido: {
          teoria: [
            'Python es un lenguaje de programación de alto nivel, interpretado y de propósito general.',
            'Fue creado por Guido van Rossum en 1991 y hoy es uno de los lenguajes más populares del mundo.',
            'Se usa en ciencia de datos, inteligencia artificial, desarrollo web, automatización y más.',
            'Su sintaxis es clara y legible, ideal para quienes empiezan a programar.',
          ],
          ejemplo: `# Tu primer programa\nprint("¡Hola, mundo!")`,
          quiz: [
            {
              pregunta: '¿Quién creó Python?',
              opciones: ['Linus Torvalds', 'Guido van Rossum', 'James Gosling', 'Brendan Eich'],
              correcta: 1,
              explicacion: 'Guido van Rossum creó Python en 1991.',
            },
            {
              pregunta: '¿Qué tipo de lenguaje es Python?',
              opciones: [
                'Compilado y de bajo nivel',
                'Interpretado y de alto nivel',
                'Solo para móviles',
                'Solo para bases de datos',
              ],
              correcta: 1,
              explicacion: 'Python es interpretado y de alto nivel.',
            },
            {
              pregunta: '¿Cuál es una aplicación común de Python?',
              opciones: ['Diseño gráfico', 'Ciencia de datos', 'Edición de video', 'Reparar computadoras'],
              correcta: 1,
              explicacion: 'Python es muy usado en ciencia de datos, IA y automatización.',
            },
          ],
        },
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
        contenido: {
          teoria: [
            'Java es un lenguaje orientado a objetos, compilado y multiplataforma.',
            'Fue creado por Sun Microsystems (ahora Oracle) en 1995.',
            'Funciona en la JVM (Java Virtual Machine), lo que permite "escribir una vez, ejecutar en cualquier lugar".',
            'Es muy usado en aplicaciones empresariales y apps Android.',
          ],
          ejemplo: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("¡Hola, mundo!");\n  }\n}`,
          quiz: [
            {
              pregunta: '¿Qué significa JVM?',
              opciones: ['Java Very Modern', 'Java Virtual Machine', 'Just Value Method', 'Java Version Manager'],
              correcta: 1,
              explicacion: 'JVM significa Java Virtual Machine.',
            },
            {
              pregunta: '¿En qué año se creó Java?',
              opciones: ['1985', '1991', '1995', '2000'],
              correcta: 2,
              explicacion: 'Java fue creado en 1995 por Sun Microsystems.',
            },
          ],
        },
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
        contenido: {
          teoria: [
            'HTML significa HyperText Markup Language.',
            'Es el lenguaje que estructura el contenido de todas las páginas web.',
            'Usa etiquetas (tags) para definir elementos como títulos, párrafos, imágenes y enlaces.',
            'Un archivo HTML siempre empieza con <!DOCTYPE html>.',
          ],
          ejemplo: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>Mi página</title>\n  </head>\n  <body>\n    <h1>¡Hola!</h1>\n    <p>Mi primera página web.</p>\n  </body>\n</html>`,
          quiz: [
            {
              pregunta: '¿Qué significa HTML?',
              opciones: [
                'HyperText Markup Language',
                'High Tech Modern Language',
                'Home Tool Markup Language',
                'HyperText Machine Learning',
              ],
              correcta: 0,
              explicacion: 'HTML significa HyperText Markup Language.',
            },
          ],
        },
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
        contenido: {
          teoria: [
            'CSS significa Cascading Style Sheets.',
            'Se usa para dar estilo y diseño a las páginas HTML.',
            'Los selectores permiten apuntar a elementos específicos.',
            'Ejemplo: p { color: red; } pinta todos los párrafos de rojo.',
          ],
          ejemplo: `body {\n  background: #08090b;\n  color: white;\n  font-family: Arial;\n}\n\nh1 {\n  color: #dc2626;\n}`,
        },
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
        contenido: {
          teoria: [
            'JavaScript es el lenguaje de programación de la web.',
            'Se ejecuta directamente en el navegador.',
            'Permite crear interactividad, animaciones y aplicaciones completas.',
            'Usa let y const para declarar variables.',
          ],
          ejemplo: `const nombre = "Santiago";\nlet edad = 20;\n\nconsole.log(\`Hola, \${nombre}\`);`,
          quiz: [
            {
              pregunta: '¿Dónde se ejecuta JavaScript?',
              opciones: ['Solo en servidores', 'En el navegador', 'Solo en móviles', 'En bases de datos'],
              correcta: 1,
              explicacion: 'JavaScript se ejecuta en el navegador y también en servidores con Node.js.',
            },
          ],
        },
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
        contenido: {
          teoria: [
            'PHP significa PHP: Hypertext Preprocessor.',
            'Es un lenguaje de scripting del lado del servidor.',
            'Muy usado para crear sitios web dinámicos y APIs.',
            'Todo código PHP va dentro de <?php ... ?>.',
          ],
          ejemplo: `<?php\n  echo "¡Hola, mundo!";\n?>`,
        },
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
  basico: '#22c55e',
  intermedio: '#eab308',
  avanzado: '#ef4444',
  boss: '#dc2626',
};

export const DIFICULTAD_LABELS: Record<Dificultad, string> = {
  basico: 'BÁSICO',
  intermedio: 'INTERMEDIO',
  avanzado: 'AVANZADO',
  boss: 'JEFE FINAL',
};