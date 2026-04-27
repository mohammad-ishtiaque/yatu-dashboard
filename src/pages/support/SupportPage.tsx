import { Mail, Phone, MessageCircle, ExternalLink } from 'lucide-react'

interface SupportCard {
  icon: React.ElementType
  title: string
  description: string
  action: string
  href: string
  color: string
}

const SUPPORT_OPTIONS: SupportCard[] = [
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Send us an email and we\'ll get back to you within 24 hours.',
    action: 'support@yetu.com',
    href: 'mailto:support@yetu.com',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Phone,
    title: 'Phone Support',
    description: 'Call us Monday–Friday, 8am–6pm (GMT).',
    action: '+233 30 000 0000',
    href: 'tel:+233300000000',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with our support team in real time.',
    action: 'Start a chat',
    href: '#',
    color: 'bg-purple-50 text-purple-600',
  },
]

export default function SupportPage() {
  return (
    <div className="space-y-6 max-w-[800px]">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Support</h2>
        <p className="text-sm text-gray-500 mt-0.5">Get help from the YETU support team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SUPPORT_OPTIONS.map(opt => {
          const Icon = opt.icon
          return (
            <a
              key={opt.title}
              href={opt.href}
              className="card p-6 flex flex-col gap-4 hover:shadow-md transition-shadow group"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${opt.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{opt.title}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{opt.description}</p>
              </div>
              <span className="text-xs text-red-500 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                {opt.action}
                <ExternalLink className="w-3 h-3" />
              </span>
            </a>
          )
        })}
      </div>

      {/* FAQ note */}
      <div className="card p-5 bg-gray-50/50 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
          <MessageCircle className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Check our FAQ first</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Many common questions are answered in our FAQ section. You can manage them from the FAQ page in the sidebar.
          </p>
        </div>
      </div>
    </div>
  )
}
