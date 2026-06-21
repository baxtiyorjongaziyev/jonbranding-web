import { defineField, defineType } from 'sanity'

export const settings = defineType({
  name: 'siteSettings',
  title: 'Sayt Sozlamalari',
  type: 'document',
  fields: [
    defineField({ name: 'phone', title: 'Telefon raqami', type: 'string', initialValue: '+998336450097' }),
    defineField({ name: 'telegramPersonal', title: 'Telegram (shaxsiy)', type: 'url', initialValue: 'https://t.me/baxtiyorjon_gaziyev' }),
    defineField({ name: 'telegramChannel', title: 'Telegram kanal', type: 'url', initialValue: 'https://t.me/JonBranding' }),
    defineField({ name: 'instagram', title: 'Instagram', type: 'url', initialValue: 'https://www.instagram.com/jon.branding/' }),
    defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp raqami', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'address', title: 'Manzil', type: 'string' }),
  ],
  preview: { prepare: () => ({ title: 'Sayt Sozlamalari' }) },
})
