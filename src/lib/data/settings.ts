import { client } from '@/sanity/lib/client'

export interface SiteSettings {
  phone: string
  telegramPersonal: string
  telegramChannel: string
  instagram: string
  linkedin?: string
  whatsapp?: string
  email?: string
  address?: string
}

const DEFAULTS: SiteSettings = {
  phone: '+998336450097',
  telegramPersonal: 'https://t.me/baxtiyorjon_gaziyev',
  telegramChannel: 'https://t.me/JonBranding',
  instagram: 'https://www.instagram.com/jon.branding/',
  linkedin: 'https://www.linkedin.com/in/baxtiyorjongaziyev/',
}

const QUERY = `*[_type == "siteSettings"][0] {
  phone, telegramPersonal, telegramChannel,
  instagram, linkedin, whatsapp, email, address
}`

export async function fetchSettings(): Promise<SiteSettings> {
  try {
    const data = await client.fetch<SiteSettings>(QUERY)
    if (data?.phone) return { ...DEFAULTS, ...data }
  } catch (e) {
    console.error('Sanity settings fetch failed, using defaults:', e)
  }
  return DEFAULTS
}
