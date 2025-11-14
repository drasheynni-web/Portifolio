import React, { useState, useRef, useEffect } from 'react'
import { Music, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react'
import { loadMusicTracks } from '../utils/musicLoader'
import { 
  initAudioProtection, 
  protectAudioElement
} from '../utils/audioProtection'

function MusicSection({ onMusicPlay }) {
  const [currentPlaying, setCurrentPlaying] = useState(null)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRefs = useRef({})
  const videoRefs = useRef({})
  const [tracks, setTracks] = useState([])

  useEffect(() => {
    const loadedTracks = loadMusicTracks()
    setTracks(loadedTracks)
    
    initAudioProtection()
  }, [])

  useEffect(() => {
    // Aplicar volume a todos os áudios
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.volume = isMuted ? 0 : volume
      }
    })

    // Bloquear atalhos de teclado para download
    const preventDownload = (e) => {
      // Bloquear Ctrl+S, Ctrl+Shift+S
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        const activeElement = document.activeElement
        if (activeElement && activeElement.tagName === 'AUDIO') {
          e.preventDefault()
          return false
        }
      }
    }

    document.addEventListener('keydown', preventDownload)
    return () => document.removeEventListener('keydown', preventDownload)
  }, [volume, isMuted])

  // Fade out para músicas dos cards
  const fadeOutTrack = (audio, callback) => {
    const fadeAudio = setInterval(() => {
      if (audio.volume > 0.01) {
        audio.volume = Math.max(0, audio.volume - 0.05)
      } else {
        clearInterval(fadeAudio)
        audio.volume = 0
        if (callback) callback()
      }
    }, 30)
  }

  // Fade in para músicas dos cards
  const fadeInTrack = (audio, targetVol) => {
    audio.volume = 0
    const fadeAudio = setInterval(() => {
      if (audio.volume < targetVol - 0.05) {
        audio.volume = Math.min(targetVol, audio.volume + 0.05)
      } else {
        clearInterval(fadeAudio)
        audio.volume = targetVol
      }
    }, 30)
  }

  const togglePlay = (trackId) => {
    const audio = audioRefs.current[trackId]
    const video = videoRefs.current[trackId]
    
    if (!audio) return

    if (currentPlaying === trackId) {
      audio.pause()
      if (video) video.pause()
      setCurrentPlaying(null)
      if (onMusicPlay) onMusicPlay(false)
    } else {
      // Pausar todas as outras músicas
      Object.entries(audioRefs.current).forEach(([id, otherAudio]) => {
        if (otherAudio && id !== trackId.toString()) {
          otherAudio.pause()
          const otherVideo = videoRefs.current[id]
          if (otherVideo) otherVideo.pause()
        }
      })

      // Aplicar volume inicial da música
      const track = tracks.find(t => t.id === trackId)
      if (track && track.initialVolume !== undefined) {
        audio.volume = track.initialVolume
        setVolume(track.initialVolume)
      }

      audio.play()
      if (video) video.play()
      setCurrentPlaying(trackId)
      if (onMusicPlay) onMusicPlay(true)
    }
  }

  const handleAudioEnd = (trackId) => {
    if (currentPlaying === trackId) {
      const video = videoRefs.current[trackId]
      if (video) video.pause()
      setCurrentPlaying(null)
      if (onMusicPlay) onMusicPlay(false) // Notificar que terminou
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (newVolume > 0) {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleTimeUpdate = (trackId) => {
    const audio = audioRefs.current[trackId]
    if (audio && currentPlaying === trackId) {
      setCurrentTime(audio.currentTime)
      setDuration(audio.duration)
    }
  }

  const handleSeek = (e) => {
    const audio = audioRefs.current[currentPlaying]
    if (audio) {
      const seekTime = parseFloat(e.target.value)
      audio.currentTime = seekTime
      setCurrentTime(seekTime)
    }
  }

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const skipBackward = (trackId) => {
    const audio = audioRefs.current[trackId]
    if (audio) {
      audio.currentTime = Math.max(0, audio.currentTime - 5)
    }
  }

  const skipForward = (trackId) => {
    const audio = audioRefs.current[trackId]
    if (audio) {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 5)
    }
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-on-scroll">
          <div className="flex items-center justify-center mb-4">
            <Music className="text-red-500" size={40} />
          </div>
          <h2 className="text-5xl font-bold gradient-text mb-4">Músicas</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Minhas músicas e produções
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className={`glass-effect rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 animate-on-scroll animate-delay-${Math.min(index % 3 + 1, 3)}`}
            >
              <div className="relative h-48 bg-gradient-to-br from-red-600 to-black overflow-hidden group">
                {track.banner ? (
                  track.bannerType === 'video' ? (
                    <video
                      ref={(el) => (videoRefs.current[track.id] = el)}
                      src={track.banner}
                      className="w-full h-full object-cover"
                      loop
                      muted
                      playsInline
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <img
                      src={track.banner}
                      alt={track.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="text-red-500/30" size={64} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center transition-colors duration-300">
                  <button
                    onClick={() => togglePlay(track.id)}
                    className="bg-white/90 hover:bg-white rounded-full p-4 transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
                  >
                    {currentPlaying === track.id ? (
                      <Pause className="text-red-600" size={32} fill="currentColor" />
                    ) : (
                      <Play className="text-red-600 ml-1" size={32} fill="currentColor" />
                    )}
                  </button>
                </div>
              </div>

              {/* Track Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{track.title}</h3>
                    {track.artist && (
                      <p className="text-gray-400 text-sm">{track.artist}</p>
                    )}
                  </div>
                  {track.featured && (
                    <div className="bg-red-600 rounded-full p-1.5 ml-2">
                      <Music size={14} className="text-white" />
                    </div>
                  )}
                </div>
                <p className="text-red-400 text-sm mb-3">{track.genre}</p>
                
                {/* Tags */}
                {track.tags && track.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {track.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Audio Element - MÁXIMA PROTEÇÃO */}
                <audio
                  ref={(el) => {
                    if (el) {
                      audioRefs.current[track.id] = el
                      protectAudioElement(el)
                    }
                  }}
                  src={track.audio}
                  onEnded={() => handleAudioEnd(track.id)}
                  onError={(e) => console.error('Erro ao carregar áudio protegido')}
                  onTimeUpdate={() => handleTimeUpdate(track.id)}
                  onLoadedMetadata={() => handleTimeUpdate(track.id)}
                  controlsList="nodownload noplaybackrate"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                  onMouseDown={(e) => e.button === 2 && e.preventDefault()}
                />

                {/* Audio Controls - SEMPRE VISÍVEIS quando tocando */}
                {currentPlaying === track.id && (
                  <div className="space-y-3">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        step="0.1"
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${(currentTime / duration) * 100}%, #374151 ${(currentTime / duration) * 100}%, #374151 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Playback Controls */}
                    <div className="flex items-center justify-center gap-4 py-2">
                      <button
                        onClick={() => skipBackward(track.id)}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Voltar 5s"
                      >
                        <SkipBack size={20} />
                      </button>
                      
                      <button
                        onClick={() => togglePlay(track.id)}
                        className="bg-red-600 hover:bg-red-700 rounded-full p-3 transition-all hover:scale-110"
                      >
                        {currentPlaying === track.id ? (
                          <Pause className="text-white" size={20} fill="currentColor" />
                        ) : (
                          <Play className="text-white ml-0.5" size={20} fill="currentColor" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => skipForward(track.id)}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Avançar 5s"
                      >
                        <SkipForward size={20} />
                      </button>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center space-x-3 bg-black/30 rounded-lg p-3">
                      <button
                        onClick={toggleMute}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX size={18} />
                        ) : (
                          <Volume2 size={18} />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${(isMuted ? 0 : volume) * 100}%, #374151 ${(isMuted ? 0 : volume) * 100}%, #374151 100%)`
                        }}
                      />
                      <span className="text-xs text-gray-400 w-8 text-right">
                        {Math.round((isMuted ? 0 : volume) * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MusicSection
