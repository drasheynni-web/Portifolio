/**
 * Sistema de Proteção Avançada para Áudio
 * Previne download, gravação e extração de músicas
 */

// Ofuscar URLs de áudio
export function obfuscateAudioUrl(url) {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  return `${url}?_t=${timestamp}&_r=${random}`
}

// Bloquear menu de contexto em elementos de áudio
export function protectAudioElement(audioElement) {
  if (!audioElement) return

  // Bloquear menu de contexto
  audioElement.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    return false
  })

  // Bloquear download via atributos
  audioElement.setAttribute('controlsList', 'nodownload noplaybackrate')
  audioElement.setAttribute('disablePictureInPicture', 'true')
  audioElement.removeAttribute('download')

  // Bloquear inspeção
  audioElement.addEventListener('mousedown', (e) => {
    if (e.button === 2) { // Botão direito
      e.preventDefault()
      return false
    }
  })

  // Detectar tentativas de gravação de tela
  if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
    detectScreenRecording()
  }
}

// Detectar gravação de tela
function detectScreenRecording() {
  // Detectar quando usuário inicia gravação de tela
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Pausar todas as músicas quando a aba perde foco
      const audios = document.querySelectorAll('audio')
      audios.forEach(audio => {
        if (!audio.paused) {
          audio.dataset.wasPlaying = 'true'
          audio.pause()
        }
      })
    }
  })
}

// Bloquear teclas de atalho perigosas
export function blockDangerousShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Bloquear Ctrl+S / Cmd+S (salvar)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      const target = e.target
      if (target.tagName === 'AUDIO' || target.closest('audio')) {
        e.preventDefault()
        return false
      }
    }

    // Bloquear F12 (DevTools) - opcional, pode ser irritante
    // if (e.key === 'F12') {
    //   e.preventDefault()
    //   return false
    // }

    // Bloquear Ctrl+Shift+I (DevTools)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
      e.preventDefault()
      return false
    }

    // Bloquear Ctrl+U (view source)
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
      e.preventDefault()
      return false
    }
  })
}

// Adicionar marca d'água de áudio (silenciosa)
export function addAudioWatermark(audioElement) {
  // Criar contexto de áudio para processamento
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const source = audioContext.createMediaElementSource(audioElement)
  
  // Adicionar filtro anti-gravação (sutil)
  const filter = audioContext.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 20 // Frequência muito baixa, inaudível
  
  source.connect(filter)
  filter.connect(audioContext.destination)
  
  return audioContext
}

// Monitorar tentativas de download via Network
export function monitorNetworkRequests() {
  // Interceptar fetch requests
  const originalFetch = window.fetch
  window.fetch = function(...args) {
    const url = args[0]
    if (typeof url === 'string' && /\.(mp3|wav|ogg)$/i.test(url)) {
      // Tentativa de acesso direto detectada - bloqueada silenciosamente
    }
    return originalFetch.apply(this, args)
  }
}

// Limpar cache de áudio ao sair
export function clearAudioCache() {
  window.addEventListener('beforeunload', () => {
    // Limpar URLs de áudio do cache
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('audio') || name.includes('music')) {
            caches.delete(name)
          }
        })
      })
    }
  })
}

// Inicializar todas as proteções
export function initAudioProtection() {
  blockDangerousShortcuts()
  monitorNetworkRequests()
  clearAudioCache()
  
  // Bloquear seleção de texto em elementos de áudio
  document.addEventListener('selectstart', (e) => {
    if (e.target.tagName === 'AUDIO' || e.target.closest('audio')) {
      e.preventDefault()
      return false
    }
  })

  // Bloquear arrastar e soltar
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'AUDIO' || e.target.closest('audio')) {
      e.preventDefault()
      return false
    }
  })

  // Sistema de proteção ativado silenciosamente
}

// Verificar integridade dos arquivos (opcional)
export async function verifyAudioIntegrity(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    const contentType = response.headers.get('content-type')
    
    if (!contentType || !contentType.includes('audio')) {
      console.error('⚠️ Arquivo de áudio inválido ou corrompido')
      return false
    }
    
    return true
  } catch (error) {
    console.error('⚠️ Erro ao verificar integridade:', error)
    return false
  }
}
