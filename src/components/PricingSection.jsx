import React from 'react'
import { ShoppingCart, Download } from 'lucide-react'

function PricingSection() {
  const assets = [
    {
      id: 1,
      name: 'Asset Teste',
      description: 'Descrição do asset',
      price: 'R$ 50',
      image: '/asset-imagem.jpg' // Coloque a imagem do asset aqui
    }
  ]

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <ShoppingCart className="text-red-500" size={40} />
          </div>
          <h2 className="text-5xl font-bold gradient-text mb-4">Assets</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Compre assets e recursos exclusivos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="glass-effect rounded-xl overflow-hidden hover:scale-105 transition-all duration-300"
            >
              {/* Asset Image */}
              <div className="relative h-48 bg-gradient-to-br from-red-600 to-black">
                <img
                  src={asset.image}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>

              {/* Asset Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{asset.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{asset.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold gradient-text">{asset.price}</span>
                  <button className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-800 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-red-500/50 transition-all flex items-center space-x-2">
                    <ShoppingCart size={18} />
                    <span>Comprar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PricingSection
