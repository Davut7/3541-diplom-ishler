import en from './en.js'
import tk from './tk.js'

export const messages = {
  en,
  tk
}

export const availableLocales = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'tk', name: 'Türkmen', flag: '🇹🇲' }
]

export function createI18n() {
  let currentLocale = localStorage.getItem('locale') || 'en'

  const i18n = {
    locale: currentLocale,
    messages,

    t(key) {
      const keys = key.split('.')
      let value = messages[this.locale]

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k]
        } else {
          // Fallback to English
          value = messages.en
          for (const k2 of keys) {
            if (value && typeof value === 'object' && k2 in value) {
              value = value[k2]
            } else {
              return key
            }
          }
          break
        }
      }

      return value || key
    },

    setLocale(locale) {
      if (messages[locale]) {
        this.locale = locale
        localStorage.setItem('locale', locale)
        return true
      }
      return false
    },

    getLocale() {
      return this.locale
    }
  }

  return i18n
}

export default createI18n
