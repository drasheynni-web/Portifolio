import React from 'react'
import { ArrowDown, Sparkles } from 'lucide-react'
import config from '../../config.json'

function Hero({ onExplore }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-800/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Profile Picture */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <img 
              src={config.site.profileImage}
              alt={config.site.title}
              className="relative w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-white/20 shadow-2xl"
            />
            <div className="absolute -top-2 -right-2">
              <Sparkles className="text-yellow-400 animate-pulse" size={32} />
            </div>
          </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-6 gradient-text">
          {config.site.title}
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          {config.site.description}
        </p>
        
        <div className="flex justify-center">
          <button
            onClick={onExplore}
            className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-800 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 flex items-center space-x-2"
          >
            <span>Explorar Portfolio</span>
            <ArrowDown className="group-hover:translate-y-1 transition-transform" size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hero
