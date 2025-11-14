import React, { useState, useEffect } from 'react'
import { Music, Briefcase, Mail, Share2, Menu, X } from 'lucide-react'
import Hero from './components/Hero'
import MusicSection from './components/MusicSection'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'
import SocialMediaSection from './components/SocialMediaSection'
import BackgroundMusic from './components/BackgroundMusic'
import { verify } from './utils/verify'

function App() {
  const [activeSection, setActiveSection] = useState('hero')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [pauseBackground, setPauseBackground] = useState(false)

  useEffect(() => {
    setTimeout(verify, 2000)
  }, [])

  const sections = [
    { id: 'hero', name: 'Início', icon: null },
    { id: 'music', name: 'Músicas', icon: Music },
    { id: 'projects', name: 'Projetos', icon: Briefcase },
    { id: 'contact', name: 'Contato', icon: Mail },
    { id: 'social', name: 'Redes Sociais', icon: Share2 },
  ]

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId)
    setMobileMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold gradient-text">𝐅𝐄𝐍</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                        activeSection === section.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {Icon && <Icon size={18} />}
                      <span>{section.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-effect border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg transition-all ${
                      activeSection === section.id
                        ? 'bg-red-600 text-white'
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {Icon && <Icon size={18} />}
                    <span>{section.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <section id="hero">
          <Hero onExplore={() => scrollToSection('music')} />
        </section>
        <section id="music">
          <MusicSection 
            onMusicPlay={(isPlaying) => setPauseBackground(isPlaying)}
          />
        </section>
        <section id="projects">
          <ProjectsSection />
        </section>
        <section id="contact">
          <ContactSection />
        </section>
        <section id="social">
          <SocialMediaSection />
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <p className="text-gray-400">© 2025 Fen. Todos os direitos reservados.</p>
          <p className="text-gray-600 text-xs">
            <a 
              href="https://discord.com/users/gsantos" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-500 transition-colors"
              data-dev="R1NhbnRvcw=="
            >
              Desenvolvido por GSantos
            </a>
          </p>
        </div>
      </footer>

      {/* Background Music Control */}
      <BackgroundMusic 
        isPaused={pauseBackground}
        onPauseChange={setPauseBackground}
      />
    </div>
  )
}

export default App
