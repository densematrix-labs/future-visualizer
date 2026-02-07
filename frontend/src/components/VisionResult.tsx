import { useTranslation } from 'react-i18next'
import './VisionResult.css'

interface VisionSection {
  title: string
  content: string
}

interface VisionResultProps {
  result: {
    title: string
    year: number
    summary: string
    sections: Record<string, VisionSection>
    key_changes: string[]
    is_free_trial: boolean
    remaining_tokens: number
  }
}

export default function VisionResult({ result }: VisionResultProps) {
  const { t } = useTranslation()

  const sectionIcons: Record<string, string> = {
    technology: '⚡',
    experience: '👁️',
    society: '🌐',
    wildcard: '🎲',
  }

  return (
    <section className="vision-result" data-testid="vision-result">
      <div className="container">
        <div className="result-header">
          <div className="year-badge">{result.year}</div>
          <h2 className="result-title">{result.title}</h2>
          <p className="result-summary">{result.summary}</p>
        </div>

        <div className="result-status">
          {result.is_free_trial && (
            <span className="status-badge trial">{t('result.freeTrial')}</span>
          )}
          <span className="status-tokens">
            {t('result.tokensRemaining')}: {result.remaining_tokens}
          </span>
        </div>

        <div className="sections-grid">
          {Object.entries(result.sections).map(([key, section]) => (
            <div key={key} className={`section-card section-${key}`}>
              <div className="section-header">
                <span className="section-icon">{sectionIcons[key] || '📄'}</span>
                <h3>{section.title}</h3>
              </div>
              <div className="section-content">
                {section.content.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {result.key_changes.length > 0 && (
          <div className="key-changes">
            <h3>{t('result.keyChanges')}</h3>
            <ul className="changes-list">
              {result.key_changes.map((change, i) => (
                <li key={i}>
                  <span className="change-marker">▸</span>
                  {change}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
