import React, { useState, useEffect } from 'react'
import { Mail, Send, Loader2, X, AlertCircle } from 'lucide-react'
import emailjs from '@emailjs/browser'
import config from '../../config.json'

function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' })
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [canSendEmail, setCanSendEmail] = useState(true)
  const [cooldownTime, setCooldownTime] = useState(0)

  // Verificar cooldown ao carregar
  useEffect(() => {
    const lastSent = localStorage.getItem('lastEmailSent')
    if (lastSent) {
      const timePassed = Date.now() - parseInt(lastSent)
      const cooldown = 5 * 60 * 1000 // 5 minutos
      
      if (timePassed < cooldown) {
        setCanSendEmail(false)
        setCooldownTime(Math.ceil((cooldown - timePassed) / 1000))
      }
    }
  }, [])

  // Countdown timer
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime(cooldownTime - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (cooldownTime === 0 && !canSendEmail) {
      setCanSendEmail(true)
    }
  }, [cooldownTime, canSendEmail])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Verificar rate limit
    if (!canSendEmail) {
      setStatusMessage({
        type: 'error',
        text: `⏱️ Aguarde ${Math.floor(cooldownTime / 60)}:${(cooldownTime % 60).toString().padStart(2, '0')} minutos antes de enviar outra mensagem.`
      })
      return
    }
    
    // Mostrar modal de confirmação
    setShowConfirmModal(true)
  }

  const confirmAndSend = async () => {
    setShowConfirmModal(false)
    setIsLoading(true)
    setStatusMessage({ type: '', text: '' })

    try {
      // Enviar email usando EmailJS
      const templateParams = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      }

      await emailjs.send(
        config.contact.emailjs.serviceId,
        config.contact.emailjs.templateId,
        templateParams,
        config.contact.emailjs.publicKey
      )

      // Salvar timestamp e iniciar cooldown
      localStorage.setItem('lastEmailSent', Date.now().toString())
      setCanSendEmail(false)
      setCooldownTime(5 * 60) // 5 minutos
      
      setStatusMessage({ 
        type: 'success', 
        text: '✅ Mensagem enviada com sucesso! Entrarei em contato em breve.' 
      })
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      
      // Mensagens de erro amigáveis para o usuário
      let errorMessage = '❌ Erro ao enviar mensagem. '
      
      if (error.status === 400) {
        errorMessage += 'Peça para o dono do portfólio verificar as configurações de e-mail.'
      } else if (error.status === 401 || error.status === 403) {
        errorMessage += 'Peça para o dono do portfólio contatar o desenvolvedor do site (erro de autenticação).'
      } else if (error.status === 404) {
        errorMessage += 'Peça para o dono do portfólio contatar o desenvolvedor do site (configuração não encontrada).'
      } else if (error.status === 429) {
        errorMessage += 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
      } else if (!navigator.onLine) {
        errorMessage += 'Verifique sua conexão com a internet.'
      } else {
        errorMessage += 'Tente novamente mais tarde ou entre em contato diretamente por e-mail.'
      }
      
      setStatusMessage({ 
        type: 'error', 
        text: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-b from-red-950 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Mail className="text-red-500" size={40} />
          </div>
          <h2 className="text-5xl font-bold gradient-text mb-4">Contato</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Entre em contato por e-mail. Vamos criar algo incrível juntos!
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Contact Form */}
          <div className="glass-effect rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-6">Envie uma Mensagem</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Assunto
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  placeholder="Assunto da mensagem"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  placeholder="Sua mensagem..."
                />
              </div>

              {/* Status Message */}
              {statusMessage.text && (
                <div className={`p-4 rounded-lg ${
                  statusMessage.type === 'success' 
                    ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
                    : 'bg-red-500/20 border border-red-500/50 text-red-400'
                }`}>
                  {statusMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-800 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <span>Enviar Mensagem</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-red-500" size={24} />
                <h3 className="text-xl font-bold">Confirmar Envio</h3>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Aviso */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-300">
                ⚠️ Verifique os dados antes de enviar. Se houver alguma informação errada, será enviado incorretamente.
              </p>
            </div>

            {/* Dados do formulário */}
            <div className="space-y-4 mb-6">
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Nome</p>
                <p className="text-white font-medium">{formData.name}</p>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">E-mail</p>
                <p className="text-white font-medium break-all">{formData.email}</p>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Assunto</p>
                <p className="text-white font-medium">{formData.subject}</p>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Mensagem</p>
                <p className="text-white text-sm whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                  {formData.message}
                </p>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-medium transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={confirmAndSend}
                className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:shadow-lg hover:shadow-red-500/50 rounded-lg font-semibold transition-all"
              >
                Confirmar e Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactSection
