import React, { useState, useRef, useEffect } from 'react'
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react'
import { loadBackgroundMusic } from '../utils/musicLoader'

function BackgroundMusic({ isPaused, onPauseChange }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [playlist, setPlaylist] = useState([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [currentTrackName, setCurrentTrackName] = useState('')
  const audioRef = useRef(null)
  const fadeIntervalRef = useRef(null)
  const targetVolume = 0.08 // Volume alvo (8%) - mais baixinho

  // Carregar playlist ao montar o componente
  useEffect(() => {
    const loadedPlaylist = loadBackgroundMusic()
    setPlaylist(loadedPlaylist)
    if (loadedPlaylist.length > 0) {
      setCurrentTrackName(loadedPlaylist[0].name)
    }
  }, [])

  // Iniciar autoplay quando a playlist estiver carregada
  useEffect(() => {
    if (audioRef.current && playlist.length > 0 && !isPlaying) {
      audioRef.current.volume = 0 // Começa em 0 para fade-in
      // Iniciar tocando automaticamente
      audioRef.current.play().then(() => {
        fadeIn()
        setIsPlaying(true)
      }).catch(e => {
        // Autoplay bloqueado - usuário precisa clicar no botão
      })
    }
  }, [playlist])

  // Separar o listener de visibilidade
  useEffect(() => {
    // Pausar quando a página perde o foco
    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current && isPlaying) {
        fadeOut(() => {
          audioRef.current.pause()
        })
      } else if (!document.hidden && audioRef.current && isPlaying && !isPaused) {
        audioRef.current.play().catch(e => console.error('Erro ao retomar:', e))
        fadeIn()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isPlaying, isPaused])

  // Função para fade out
  const fadeOut = (callback) => {
    if (!audioRef.current) return
    
    const fadeAudio = setInterval(() => {
      if (audioRef.current.volume > 0.01) {
        audioRef.current.volume = Math.max(0, audioRef.current.volume - 0.01)
      } else {
        clearInterval(fadeAudio)
        audioRef.current.volume = 0
        if (callback) callback()
      }
    }, 30) // 30ms entre cada step
    
    fadeIntervalRef.current = fadeAudio
  }

  // Função para fade in
  const fadeIn = () => {
    if (!audioRef.current) return
    
    audioRef.current.volume = 0
    const fadeAudio = setInterval(() => {
      if (audioRef.current.volume < targetVolume - 0.01) {
        audioRef.current.volume = Math.min(targetVolume, audioRef.current.volume + 0.01)
      } else {
        clearInterval(fadeAudio)
        audioRef.current.volume = targetVolume
      }
    }, 30) // 30ms entre cada step
    
    fadeIntervalRef.current = fadeAudio
  }

  useEffect(() => {
    // Pausar quando outra música estiver tocando
    if (isPaused && audioRef.current && isPlaying) {
      fadeOut(() => {
        audioRef.current.pause()
      })
    } else if (!isPaused && audioRef.current && isPlaying) {
      audioRef.current.play().catch(e => console.error('Erro ao tocar:', e))
      fadeIn()
    }

    // Cleanup
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current)
      }
    }
  }, [isPaused, isPlaying])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        fadeOut(() => {
          audioRef.current.pause()
          setIsPlaying(false)
          onPauseChange(false)
        })
      } else {
        audioRef.current.play().catch(e => console.error('Erro ao tocar:', e))
        fadeIn()
        setIsPlaying(true)
        onPauseChange(false)
      }
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={playlist[currentTrackIndex]?.url || ''}
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        onEnded={() => {
          // Avançar para a próxima música
          const nextIndex = (currentTrackIndex + 1) % playlist.length
          setCurrentTrackIndex(nextIndex)
          setCurrentTrackName(playlist[nextIndex]?.name || '')
          if (audioRef.current && isPlaying && !isPaused) {
            audioRef.current.load()
            audioRef.current.play().then(() => {
              fadeIn()
            }).catch(e => console.error('Erro ao tocar próxima:', e))
          }
        }}
      />

      {/* Controle Flutuante - Clean Design */}
      {isPlaying && (
        <div className="fixed bottom-4 right-4 z-50 glass-effect rounded-full px-4 py-2 shadow-lg animate-fade-in">
          <div className="flex items-center gap-3">
            {/* Nome da música */}
            <div className="flex items-center gap-2 min-w-0">
              <Music className="text-red-500 flex-shrink-0" size={16} />
              <p className="text-xs text-white truncate max-w-[150px]">
                {currentTrackName || 'Carregando...'}
              </p>
            </div>
            
            {/* Divisor */}
            <div className="w-px h-4 bg-white/20"></div>
            
            {/* Controles inline */}
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="hover:bg-white/10 rounded-full p-1.5 transition-all"
                title="Pausar"
              >
                <Pause className="text-red-500" size={16} />
              </button>
              
              <button
                onClick={toggleMute}
                className="hover:bg-white/10 rounded-full p-1.5 transition-all"
                title={isMuted ? 'Ativar som' : 'Silenciar'}
              >
                {isMuted ? (
                  <VolumeX className="text-gray-400" size={16} />
                ) : (
                  <Volume2 className="text-red-500" size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Botão para iniciar quando não está tocando */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="fixed bottom-4 right-4 z-50 glass-effect rounded-full p-3 shadow-lg hover:bg-white/10 transition-all hover:scale-110"
          title="Tocar música de fundo"
        >
          <Play className="text-red-500 ml-0.5" size={20} />
        </button>
      )}
    </>
  )
}

export default BackgroundMusic
