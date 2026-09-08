export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Santiago Aguirre
          </h1>
          <p className="text-xl text-gray-300">
            Desarrollador Full Stack & Educador
          </p>
        </header>

        {/* Sobre mí */}
        <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">👋 Sobre mí</h2>
          <p className="text-gray-200 leading-relaxed">
            Soy un desarrollador apasionado por la tecnología y la educación. 
            Creo contenido gratuito para ayudar a otros a aprender programación 
            desde cero. Mi misión es hacer que el conocimiento técnico sea 
            accesible para todos.
          </p>
        </section>

        {/* Habilidades */}
        <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">💻 Habilidades</h2>
          <div className="flex flex-wrap gap-3">
            {['Python', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Appwrite', 'Git', 'SQL'].map((skill) => (
              <span 
                key={skill}
                className="px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full text-sm hover:bg-purple-500/30 transition cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Proyectos */}
        <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-4">🚀 Proyectos</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 p-6 rounded-xl hover:bg-white/10 transition cursor-pointer">
              <h3 className="font-semibold text-lg mb-2">📚 Curso Gratuito</h3>
              <p className="text-gray-300 text-sm">
                Plataforma educativa para aprender programación desde cero
              </p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl hover:bg-white/10 transition cursor-pointer">
              <h3 className="font-semibold text-lg mb-2">🌐 Sitio Personal</h3>
              <p className="text-gray-300 text-sm">
                Mi portafolio y blog personal construido con Next.js
              </p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl hover:bg-white/10 transition cursor-pointer">
              <h3 className="font-semibold text-lg mb-2">🤖 Proyectos de IA</h3>
              <p className="text-gray-300 text-sm">
                Experimentos con inteligencia artificial y automatización
              </p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl hover:bg-white/10 transition cursor-pointer">
              <h3 className="font-semibold text-lg mb-2">💼 Open Source</h3>
              <p className="text-gray-300 text-sm">
                Contribuciones a proyectos de código abierto
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-400">
          <p>© 2026 Santiago Aguirre - Todos los derechos reservados</p>
        </footer>
      </div>
    </main>
  );
}