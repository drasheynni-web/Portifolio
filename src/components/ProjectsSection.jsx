import React, { useState, useEffect } from 'react'
import { Briefcase, ExternalLink, Star } from 'lucide-react'

const BASE_URL = import.meta.env.BASE_URL

function ProjectsSection() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    // Carregar projetos automaticamente
    import('../utils/projectsConfig.json')
      .then(module => {
        const loadedProjects = module.default || []
        console.log('Projetos carregados:', loadedProjects)
        console.log('BASE_URL:', BASE_URL)
        setProjects(loadedProjects)
      })
      .catch(error => {
        console.error('Erro ao carregar projetos:', error)
        setProjects([])
      })
  }, [])

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-b from-black to-red-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-on-scroll">
          <div className="flex items-center justify-center mb-4">
            <Briefcase className="text-red-500" size={40} />
          </div>
          <h2 className="text-5xl font-bold gradient-text mb-4">Projetos</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Meus projetos e trabalhos
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center text-gray-400 py-12 animate-on-scroll">
            <p className="text-lg">Nenhum projeto adicionado ainda.</p>
            <p className="text-sm mt-2">Adicione projetos na pasta public/projects/</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={`glass-effect rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 group animate-on-scroll animate-delay-${Math.min(index % 3 + 1, 3)}`}
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-red-700 to-black overflow-hidden">
                  {project.featured && (
                    <div className="absolute top-3 right-3 z-10 bg-red-600 rounded-full p-2">
                      <Star size={16} className="text-white" fill="currentColor" />
                    </div>
                  )}
                  {project.image ? (
                    <img
                      src={(() => {
                        const imageUrl = `${BASE_URL}${project.image.startsWith('/') ? project.image.slice(1) : project.image}`
                        console.log(`Imagem do projeto "${project.title}":`, imageUrl)
                        return imageUrl
                      })()}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        console.error(`Erro ao carregar imagem: ${e.target.src}`)
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Briefcase className="text-red-500/30" size={64} />
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{project.description}</p>
                  
                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 5).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Link */}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors text-sm font-medium"
                    >
                      Ver Projeto
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectsSection
