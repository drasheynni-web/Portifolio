import React, { useState } from 'react'
import { MessageSquare, Calendar, Clock, DollarSign, FileText, Send, CheckCircle } from 'lucide-react'

function HireTicketSection() {
  const [ticket, setTicket] = useState({
    projectType: '',
    budget: '',
    deadline: '',
    description: '',
    priority: 'normal'
  })

  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Ticket submitted:', ticket)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setTicket({
        projectType: '',
        budget: '',
        deadline: '',
        description: '',
        priority: 'normal'
      })
    }, 3000)
  }

  const handleChange = (e) => {
    setTicket({
      ...ticket,
      [e.target.name]: e.target.value
    })
  }

  const projectTypes = [
    'Website Institucional',
    'E-commerce',
    'Aplicativo Mobile',
    'Sistema Web',
    'Landing Page',
    'Produção Musical',
    'Outro'
  ]

  const budgetRanges = [
    'R$ 500 - R$ 1.000',
    'R$ 1.000 - R$ 2.500',
    'R$ 2.500 - R$ 5.000',
    'R$ 5.000 - R$ 10.000',
    'Acima de R$ 10.000'
  ]

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <MessageSquare className="text-purple-400" size={40} />
          </div>
          <h2 className="text-5xl font-bold gradient-text mb-4">Solicitar Contratação</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Preencha o formulário abaixo e receba uma proposta personalizada em até 24 horas
          </p>
        </div>

        {submitted ? (
          <div className="glass-effect rounded-2xl p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-600/20 p-6 rounded-full">
                <CheckCircle className="text-green-400" size={64} />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-4">Ticket Enviado com Sucesso!</h3>
            <p className="text-gray-400 text-lg mb-6">
              Recebi sua solicitação e entrarei em contato em breve com uma proposta detalhada.
            </p>
            <p className="text-sm text-gray-500">
              Você receberá um email de confirmação nos próximos minutos.
            </p>
          </div>
        ) : (
          <div className="glass-effect rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Type */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium mb-3">
                  <FileText size={18} className="text-blue-400" />
                  <span>Tipo de Projeto</span>
                </label>
                <select
                  name="projectType"
                  value={ticket.projectType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                >
                  <option value="">Selecione o tipo de projeto</option>
                  {projectTypes.map((type, index) => (
                    <option key={index} value={type} className="bg-gray-900">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium mb-3">
                  <DollarSign size={18} className="text-green-400" />
                  <span>Orçamento Estimado</span>
                </label>
                <select
                  name="budget"
                  value={ticket.budget}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                >
                  <option value="">Selecione a faixa de orçamento</option>
                  {budgetRanges.map((range, index) => (
                    <option key={index} value={range} className="bg-gray-900">
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              {/* Deadline */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium mb-3">
                  <Calendar size={18} className="text-yellow-400" />
                  <span>Prazo Desejado</span>
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={ticket.deadline}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium mb-3">
                  <Clock size={18} className="text-red-400" />
                  <span>Prioridade</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['normal', 'alta', 'urgente'].map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setTicket({ ...ticket, priority })}
                      className={`py-3 rounded-lg font-medium transition-all ${
                        ticket.priority === priority
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'glass-effect text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium mb-3">
                  <MessageSquare size={18} className="text-purple-400" />
                  <span>Descrição do Projeto</span>
                </label>
                <textarea
                  name="description"
                  value={ticket.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                  placeholder="Descreva seu projeto em detalhes: objetivos, funcionalidades desejadas, público-alvo, referências, etc."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Enviar Solicitação</span>
                <Send size={20} />
              </button>

              <p className="text-sm text-gray-500 text-center">
                Ao enviar, você concorda em receber uma proposta personalizada por email
              </p>
            </form>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="glass-effect rounded-lg p-6 text-center">
            <div className="bg-blue-600/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-blue-400" size={24} />
            </div>
            <h4 className="font-semibold mb-2">Resposta Rápida</h4>
            <p className="text-sm text-gray-400">Retorno em até 24 horas</p>
          </div>

          <div className="glass-effect rounded-lg p-6 text-center">
            <div className="bg-purple-600/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-purple-400" size={24} />
            </div>
            <h4 className="font-semibold mb-2">Proposta Detalhada</h4>
            <p className="text-sm text-gray-400">Orçamento completo e cronograma</p>
          </div>

          <div className="glass-effect rounded-lg p-6 text-center">
            <div className="bg-green-600/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-400" size={24} />
            </div>
            <h4 className="font-semibold mb-2">Sem Compromisso</h4>
            <p className="text-sm text-gray-400">Avalie a proposta sem custos</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HireTicketSection
