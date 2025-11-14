import React from 'react'
import { Share2 } from 'lucide-react'
import youtubeIcon from '../assets/youtube-168-svgrepo-com.svg'
import discordIcon from '../assets/discord-svgrepo-com.svg'
import twitterIcon from '../assets/twitter-original.svg'
import instagramIcon from '../assets/instagram-svgrepo-com.svg'
import tiktokIcon from '../assets/tiktok-svgrepo-com.svg'

function SocialMediaSection() {
  const socialLinks = [
    {
      name: 'YouTube',
      iconSvg: youtubeIcon,
      color: 'from-red-600 to-red-800',
      link: '#'
    },
    {
      name: 'Discord',
      iconSvg: discordIcon,
      color: 'from-indigo-600 to-indigo-800',
      link: '#'
    },
    {
      name: 'Twitter',
      iconSvg: twitterIcon,
      color: 'from-blue-400 to-blue-600',
      link: '#'
    },
    {
      name: 'Instagram',
      iconSvg: instagramIcon,
      color: 'from-purple-600 to-pink-600',
      link: '#'
    },
    {
      name: 'TikTok',
      iconSvg: tiktokIcon,
      color: 'from-black to-teal-500',
      link: '#'
    }
  ]

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-b from-black to-red-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Share2 className="text-red-500" size={40} />
          </div>
          <h2 className="text-5xl font-bold gradient-text mb-4">Redes Sociais</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Conecte-se comigo nas redes sociais e acompanhe meu trabalho
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {socialLinks.map((social) => {
            return (
              <a
                key={social.name}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-effect rounded-xl p-6 hover:scale-105 transition-all duration-300 group text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className={`bg-gradient-to-r ${social.color} p-4 rounded-lg group-hover:scale-110 transition-transform`}>
                    <img 
                      src={social.iconSvg} 
                      alt={social.name}
                      className="w-7 h-7 brightness-0 invert"
                    />
                  </div>
                </div>
                
                <h3 className="text-lg font-bold">{social.name}</h3>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SocialMediaSection
