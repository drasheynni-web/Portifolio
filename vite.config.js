import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function musicLoaderPlugin() {
  return {
    name: 'auto-loader',
    configureServer(server) {
      generateMusicList()
      generateProjectsList()
      generateBackgroundMusicList()
      
      const musicDir = path.resolve(__dirname, 'public/music')
      const imagesDir = path.resolve(__dirname, 'public/music/images')
      const projectsDir = path.resolve(__dirname, 'public/projects')
      const backgroundDir = path.resolve(__dirname, 'public/music/background')
      
      server.watcher.add(musicDir)
      server.watcher.add(imagesDir)
      server.watcher.add(projectsDir)
      server.watcher.add(backgroundDir)
      
      server.watcher.on('all', (event, filePath) => {
        if (filePath.includes('public/music') || filePath.includes('public\\music')) {
          generateMusicList()
          if (filePath.includes('background')) {
            generateBackgroundMusicList()
          }
        }
        if (filePath.includes('public/projects') || filePath.includes('public\\projects')) {
          generateProjectsList()
        }
      })
    },
    buildStart() {
      generateMusicList()
      generateProjectsList()
      generateBackgroundMusicList()
    }
  }
}

function generateMusicList() {
  const musicDir = path.resolve(__dirname, 'public/music')
  const imagesDir = path.resolve(__dirname, 'public/music/images')
  
  let musicJsonFiles = []
  if (fs.existsSync(musicDir)) {
    musicJsonFiles = fs.readdirSync(musicDir)
      .filter(file => /\.json$/i.test(file))
  }
  
  const tracks = []
  
  musicJsonFiles.forEach(file => {
    try {
      const filePath = path.join(musicDir, file)
      const musicData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      
      if (!musicData.audioFile) {
        console.error(`Música ${file}: campo 'audioFile' é obrigatório`)
        return
      }
      
      const track = {
        id: file.replace(/\.json$/i, ''),
        title: musicData.title || 'Sem Título',
        artist: musicData.artist || '',
        genre: musicData.genre || 'Música',
        audioFile: musicData.audioFile,
        imageFile: musicData.imageFile || null,
        imageType: musicData.imageType || 'image',
        featured: musicData.featured || false,
        tags: musicData.tags || [],
        initialVolume: musicData.initialVolume !== undefined ? musicData.initialVolume : 'main-config'
      }
      
      tracks.push(track)
    } catch (error) {
      console.error(`Erro ao ler música ${file}:`, error.message)
    }
  })
  
  const outputPath = path.resolve(__dirname, 'src/utils/musicConfig.json')
  fs.writeFileSync(outputPath, JSON.stringify(tracks, null, 2))
}

function generateBackgroundMusicList() {
  const backgroundDir = path.resolve(__dirname, 'public/music/background')
  
  let backgroundFiles = []
  if (fs.existsSync(backgroundDir)) {
    backgroundFiles = fs.readdirSync(backgroundDir)
      .filter(file => /\.(mp3|wav|ogg)$/i.test(file))
  }
  
  const playlist = backgroundFiles.map(fileName => {
    const nameWithoutExt = fileName.replace(/\.(mp3|wav|ogg)$/i, '')
    return {
      name: nameWithoutExt,
      fileName: fileName
    }
  })
  
  const outputPath = path.resolve(__dirname, 'src/utils/backgroundMusicConfig.json')
  fs.writeFileSync(outputPath, JSON.stringify(playlist, null, 2))
}

function generateProjectsList() {
  const projectsDir = path.resolve(__dirname, 'public/projects')
  const imagesDir = path.resolve(__dirname, 'public/projects/images')
  
  let projectFiles = []
  if (fs.existsSync(projectsDir)) {
    projectFiles = fs.readdirSync(projectsDir)
      .filter(file => /\.json$/i.test(file))
  }
  
  let imageFiles = []
  if (fs.existsSync(imagesDir)) {
    imageFiles = fs.readdirSync(imagesDir)
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
  }
  
  const projects = []
  
  projectFiles.forEach(file => {
    try {
      const filePath = path.join(projectsDir, file)
      const projectData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      
      const projectName = file.replace(/\.json$/i, '')
      
      // Prioridade: 1) imageFile no JSON, 2) nome igual ao JSON
      let imagePath = null
      
      if (projectData.imageFile) {
        // Se tem imageFile no JSON, usa ele
        imagePath = `/projects/images/${projectData.imageFile}`
      } else {
        // Senão, busca imagem com mesmo nome do JSON
        const image = imageFiles.find(imgFile => {
          const imgName = imgFile.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')
          return imgName.toLowerCase() === projectName.toLowerCase()
        })
        imagePath = image ? `/projects/images/${image}` : null
      }
      
      projects.push({
        ...projectData,
        id: projectName,
        image: imagePath
      })
    } catch (error) {
      console.error(`Erro ao ler projeto ${file}:`, error.message)
    }
  })
  
  const outputPath = path.resolve(__dirname, 'src/utils/projectsConfig.json')
  fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2))
}

export default defineConfig({
  // Base precisa ser o nome do repositório quando usando GitHub Pages em user.github.io/RepoName/
  base: '/',
  plugins: [react(), musicLoaderPlugin()],
  assetsInclude: ['**/*.mp3', '**/*.wav', '**/*.ogg', '**/*.mp4', '**/*.webm'],
  publicDir: 'public',
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'icons': ['lucide-react']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
