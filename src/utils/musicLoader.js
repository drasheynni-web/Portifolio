import musicConfig from './musicConfig.json'
import backgroundMusicConfig from './backgroundMusicConfig.json'
import config from '../../config.json'

const BASE_URL = import.meta.env.BASE_URL || '/'

export function loadMusicTracks() {
  try {
    const tracks = musicConfig.map((track, index) => ({
      id: index + 1,
      title: track.title,
      artist: track.artist,
      genre: track.genre,
      audio: `${BASE_URL}music/${track.audioFile}`,
      banner: track.imageFile ? `${BASE_URL}music/images/${track.imageFile}` : null,
      bannerType: track.imageType,
      featured: track.featured,
      tags: track.tags,
      initialVolume: (!track.initialVolume || track.initialVolume === 'main-config' || track.initialVolume === '')
        ? config.music.defaultVolume 
        : parseFloat(track.initialVolume)
    }))
    
    return tracks
  } catch (error) {
    console.error('Erro ao carregar músicas:', error)
    return []
  }
}

export function loadBackgroundMusic() {
  try {
    // Carrega automaticamente todas as músicas da pasta background
    const playlist = backgroundMusicConfig.map(track => ({
      name: track.name,
      url: `${BASE_URL}music/background/${track.fileName}`
    }))
    
    // Embaralha a playlist para ordem aleatória a cada reload
    return shuffleArray(playlist)
  } catch (error) {
    console.error('Erro ao carregar músicas de fundo:', error)
    return []
  }
}

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}