# 🎵 Portfólio Musical

Este projeto é um **site de portfólio musical** pronto, pensado para quem **não é programador**.

Você só precisa **trocar arquivos e textos** em algumas pastas para deixar tudo com a sua cara.

> Esqueça comandos complicados: este guia explica apenas **como mexer no conteúdo** do site.

---

## 📋 O que você pode fazer

- **Adicionar ou remover músicas**
- **Cadastrar projetos** que aparecem na seção de portfólio
- **Alterar textos principais** (título, descrição, rodapé)
- **Trocar foto de perfil**
- **Atualizar links das redes sociais**
- **Publicar/atualizar o site** na internet usando o assistente de deploy

---

## 🎵 Músicas

### Onde colocar as músicas

- Coloque seus arquivos de **áudio** em:

  `public/music/`

- (Opcional) Coloque **imagens ou vídeos** para cada música em:

  `public/music/images/`

### Como cadastrar cada música

Para cada música, crie um **arquivo `.json`** na pasta `public/music/` com as informações que vão aparecer no site.

**Exemplo:** Para a música `minha-musica.mp3`, crie o arquivo `minha-musica.json`

**Modelo de conteúdo:**

```json
{
  "title": "Nome da Música",
  "artist": "Nome do Artista",
  "genre": "Gênero Musical",
  "audioFile": "minha-musica.mp3",
  "imageFile": "minha-musica.jpg",
  "imageType": "image",
  "featured": true,
  "tags": ["Tag1", "Tag2", "Tag3"],
  "initialVolume": 0.5
}
```

### O que significam esses campos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|:-----------:|-----------|
| `title` | String | ✅ | Nome da música |
| `artist` | String | ❌ | Nome do artista |
| `genre` | String | ❌ | Gênero musical |
| `audioFile` | String | ✅ | Nome do arquivo de áudio |
| `imageFile` | String | ❌ | Nome do arquivo de imagem |
| `imageType` | String | ❌ | `"image"`, `"gif"` ou `"video"` |
| `featured` | Boolean | ❌ | `true` para destacar |
| `tags` | Array | ❌ | Tags da música (máximo 3 visíveis) |
| `initialVolume` | Number | ❌ | Volume inicial (0.0 a 1.0). Use `"main-config"` para usar o padrão |

### Formatos suportados

**Áudio:**
- `.mp3`, `.wav`, `.ogg`

**Imagens/Vídeos:**
- `.jpg`, `.jpeg`, `.png` (imagens)
- `.gif` (animações)
- `.mp4`, `.webm` (vídeos)

### ✅ Detecção Automática

**O sistema detecta automaticamente** todos os arquivos `.json` na pasta `public/music/` e os exibe no site.

Você **não precisa** editar código ou configurar nada - basta criar o arquivo JSON e colocar o áudio na pasta!

---

## 🎼 Músicas de Fundo (Background)

### Como funciona

O site toca automaticamente músicas de fundo em **loop contínuo** enquanto o usuário navega.

### Como adicionar músicas de fundo

1. Coloque seus arquivos de áudio (`.mp3`, `.wav` ou `.ogg`) em:

   `public/music/background/`

2. **Pronto!** O sistema detecta automaticamente todas as músicas dessa pasta.

### Comportamento

- **Ordem aleatória:** A cada vez que a página carrega, as músicas são embaralhadas
- **Loop infinito:** Quando todas as músicas terminam, a playlist recomeça
- **Múltiplas músicas:** Você pode colocar quantas músicas quiser na pasta
- **Volume automático:** O volume é baixo (8%) para não atrapalhar a navegação

### Controles

- O usuário pode pausar/despausar a música de fundo
- O usuário pode silenciar o áudio
- A música pausa automaticamente quando o usuário toca uma música do portfólio

### Ajustar volume

Para mudar o volume padrão, edite o arquivo `config.json` (ver seção de personalização).

---

## 📁 Projetos

Os projetos aparecem em forma de **cards** no site (nome, descrição, tags e link).

### Como cadastrar um projeto

1. Vá para a pasta:

   `public/projects/`

2. Crie um arquivo `.json` com o nome do projeto, por exemplo:
   ```
   meu-projeto.json
   ```

3. Use este modelo de conteúdo:

```json
{
  "title": "Nome do Projeto",
  "description": "Descrição completa do projeto. O que ele faz, tecnologias usadas, etc.",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "link": "https://github.com/usuario/projeto",
  "imageFile": "nome-da-imagem.jpg",
  "featured": true
}
```

### Campos do JSON

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|:-----------:|-----------|
| `title` | String | ✅ | Nome que aparece no card |
| `description` | String | ✅ | Texto descritivo do projeto |
| `tags` | Array | ❌ | Tecnologias usadas (máximo 5) |
| `link` | String | ❌ | URL do projeto (GitHub, site, etc) |
| `imageFile` | String | ❌ | Nome do arquivo de imagem em `public/projects/images/` |
| `featured` | Boolean | ❌ | `true` para destacar com ⭐ |

### Imagem do projeto (opcional)

**Opção 1: Especificar no JSON (recomendado)**

Adicione o campo `imageFile` no JSON com o nome da imagem:

```json
{
  "title": "Meu Projeto",
  "description": "Descrição...",
  "imageFile": "screenshot-projeto.jpg",
  "link": "https://github.com/usuario/projeto"
}
```

Coloque a imagem em: `public/projects/images/screenshot-projeto.jpg`

**Opção 2: Usar o mesmo nome do JSON**

Se não especificar `imageFile`, o sistema busca automaticamente uma imagem com o **mesmo nome** do arquivo `.json`:

```
Projeto: public/projects/portfolio.json
Imagem:  public/projects/images/portfolio.jpg
```

### Formatos de imagem aceitos

- `.jpg`, `.jpeg`
- `.png`
- `.gif`
- `.webp`

---

## ⚙️ Personalizar Textos, Foto e Redes Sociais

Tudo isso é controlado por um arquivo chamado `config.json`, que fica na pasta principal do projeto.

```json
{
  "site": {
    "title": "𝐅𝐄𝐍",
    "description": "Criador de conteúdo, músico e desenvolvedor.",
    "profileImage": "assets/profile/foto.jpg"
  },
  "contact": {
    "email": "seu-email@exemplo.com",
    "emailjs": {
      "serviceId": "service_xxxxx",
      "templateId": "template_xxxxx",
      "publicKey": "xxxxxxxxxxxxx"
    }
  },
  "socialMedia": {
    "youtube": "https://www.youtube.com/@seu-canal",
    "discord": "https://discord.gg/seu-servidor",
    "twitter": "https://twitter.com/seu-usuario",
    "instagram": "https://instagram.com/seu-usuario",
    "tiktok": "https://tiktok.com/@seu-usuario"
  },
  "music": {
    "defaultGenre": "Música",
    "defaultVolume": 0.5,
    "backgroundVolume": 0.05
  }
}
```

### Site
- **title**: Nome do site (aparece na página inicial)
- **description**: Descrição que aparece abaixo do nome
- **profileImage**: Caminho da foto **sem a barra inicial** (ex: `assets/profile/foto.jpg`)

### Contato
- **email**: Seu e-mail de contato
- **emailjs**: Credenciais do EmailJS (para formulário funcionar)

### Redes Sociais
- **youtube**: Link do canal
- **discord**: Link do servidor
- **twitter**: Link do perfil
- **instagram**: Link do perfil
- **tiktok**: Link do perfil

### Música
- **defaultGenre**: Gênero padrão das músicas
- **defaultVolume**: Volume inicial (0.0 a 1.0)
- **backgroundVolume**: Volume do fundo (0.0 a 1.0)

### Mudar Foto de Perfil

1. Coloque a nova foto em:

   `public/assets/profile/`

2. No arquivo `config.json`, atualize o caminho **SEM a barra inicial**:
   ```json
   "profileImage": "assets/profile/minha-foto.jpg"
   ```

**⚠️ IMPORTANTE:** Não use `/` no início do caminho, senão a foto não vai carregar no GitHub Pages!

---

## 📂 Estrutura de Pastas (resumo)

```
public/
├── assets/
│   ├── images/          # Imagens gerais (ícones, logos)
│   └── profile/         # Fotos de perfil
│
├── music/               # Músicas e imagens das músicas
│   ├── images/          # Imagens/GIFs/Vídeos das músicas
│   ├── background/      # Músicas de fundo
│   └── *.mp3            # Arquivos de música
│
└── projects/
    ├── images/          # Imagens dos projetos
    └── *.json           # Dados dos projetos
```

---

## 📝 Exemplos Rápidos

### Exemplo 1: Adicionar uma música com GIF

**Passo 1:** Coloque os arquivos:
```
public/music/Epic Song.mp3
public/music/images/Epic Song.gif
```

**Passo 2:** Crie o JSON:
```json
// public/music/Epic Song.json
{
  "title": "Epic Song",
  "artist": "Seu Nome",
  "genre": "Epic",
  "audioFile": "Epic Song.mp3",
  "imageFile": "Epic Song.gif",
  "imageType": "gif",
  "featured": true,
  "tags": ["Epic", "Soundtrack"]
}
```

**Resultado:**
- ✅ Card com música tocável
- ✅ GIF animado como fundo

### Exemplo 2: Adicionar projeto destacado

**Arquivo JSON:**
```json
// public/projects/game-engine.json
{
  "title": "Game Engine 2D",
  "description": "Engine de jogos desenvolvida em C++ com OpenGL",
  "tags": ["C++", "OpenGL", "Game Dev"],
  "link": "https://github.com/usuario/game-engine",
  "imageFile": "engine-screenshot.png",
  "featured": true
}
```

**Imagem:**
```
public/projects/images/engine-screenshot.png
```

**Resultado:**
- ✅ Card com estrela ⭐ de destaque
- ✅ Imagem personalizada (não precisa ter o mesmo nome do JSON)

---

## 🆘 Se algo não aparecer no site

### Se uma música não aparecer

1. Confira se o arquivo `.json` está em `public/music/`
2. Confira se o arquivo de áudio está em `public/music/`
3. Veja se o campo `audioFile` no JSON está **idêntico** ao nome do arquivo de áudio
4. Verifique se o formato é suportado (`.mp3`, `.wav`, `.ogg`)
5. Certifique-se de que o JSON está bem formatado (sem vírgulas extras, aspas corretas)

### Se um projeto não aparecer

1. Confira se o arquivo `.json` está em `public/projects/`.
2. Veja se o JSON está bem formado (use um validador online se precisar).

### Se a imagem não aparecer

1. Confira se o arquivo existe na pasta indicada (`public/...`).
2. Veja se o nome está igual ao que foi colocado no JSON ou no `config.json`.

---

## 🌐 Como publicar/atualizar o site

### Usando o Assistente de Deploy

O projeto inclui um **assistente de deploy** (`deploy_github.exe`) que faz tudo automaticamente.

**Passo a passo:**

1. **Faça suas alterações** (músicas, projetos, textos, foto, redes sociais)

2. **Clique duas vezes** no arquivo `deploy_github.exe` na raiz do projeto

3. **Cole o link do repositório** quando pedido:
   ```
   https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   ```

4. **Confirme** que deseja enviar as alterações

5. **Aguarde** o processo terminar (o assistente mostra o progresso)

6. **Siga as instruções finais** para verificar:
   - ✅ Repositório no GitHub
   - ✅ Aba **Actions** (aguarde o deploy ficar verde ✓)
   - ✅ **Settings > Pages** (Source = "GitHub Actions")
   - ✅ Acesse seu site no link fornecido

**⏱️ Tempo:** O GitHub leva 2-5 minutos para processar e publicar o site após o deploy.

**💡 Dica:** Se o site não atualizar, limpe o cache do navegador (Ctrl+F5) ou abra em modo anônimo.

---

## 🎉 Resumo

- **Você não precisa programar** para usar este portfólio.
- Tudo é controlado por **arquivos e pastas**:
  - Músicas em `public/music/`
  - Projetos em `public/projects/`
  - Textos, foto e redes em `config.json`
- O assistente de deploy cuida da parte complicada (Git, build, publicação).

Use este README como guia de conteúdo, e o assistente como ferramenta para colocar o site no ar.

---

**Desenvolvido com ❤️ e 🎵 para ser simples de usar.**
