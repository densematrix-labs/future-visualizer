import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import './Header.css'

export default function Header() {
  const { t } = useTranslation()

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">{t('app.name')}</span>
        </Link>
        
        <nav className="nav">
          <Link to="/pricing" className="nav-link">
            {t('nav.pricing')}
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  )
}
