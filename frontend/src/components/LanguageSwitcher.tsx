import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './LanguageSwitcher.css'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0]

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code)
    setIsOpen(false)
    document.documentElement.lang = code
  }

  return (
    <div className="lang-switcher" data-testid="lang-switcher">
      <button
        className="lang-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
      >
        <span className="lang-flag">{currentLang.flag}</span>
        <span className="lang-code">{currentLang.code.toUpperCase()}</span>
        <span className="lang-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="lang-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`lang-option ${lang.code === i18n.language ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="lang-flag">{lang.flag}</span>
              <span className="lang-name">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
