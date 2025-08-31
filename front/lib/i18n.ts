import { createI18nClient } from 'next-international/client'

export const locales = ['en', 'es'] as const
export type Locale = (typeof locales)[number]

export const { useI18n, useScopedI18n, I18nProviderClient } = createI18nClient({
  en: () => import('./translations/en'),
  es: () => import('./translations/es'),
})
