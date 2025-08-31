"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage()

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'es' : 'en')
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage}
      className="px-3 py-2 font-medium hover:bg-primary/10 hover:text-primary transition-colors duration-200 rounded-lg border border-border/50 hover:border-primary/30"
    >
      🌐 {locale === 'en' ? 'EN' : 'ES'}
    </Button>
  )
}
