import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../lib/store'
import { visualizeFuture } from '../lib/api'
import VisionResult from '../components/VisionResult'
import './HomePage.css'

export default function HomePage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [concept, setConcept] = useState('')
  const { deviceId, isLoading, setIsLoading, error, setError, visionResult, setVisionResult } = useStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!concept.trim() || !deviceId || isLoading) return

    setIsLoading(true)
    setError(null)
    setVisionResult(null)

    try {
      const result = await visualizeFuture(concept.trim(), i18n.language, deviceId)
      setVisionResult(result)
    } catch (err) {
      if (err instanceof Error && err.message === 'PAYMENT_REQUIRED') {
        navigate('/pricing')
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const examples = [
    { label: 'iPhone', value: 'iPhone' },
    { label: 'Twitter/X', value: 'Twitter' },
    { label: t('examples.remoteWork'), value: 'Remote Work' },
    { label: t('examples.electricCars'), value: 'Electric Cars' },
  ]

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            {t('hero.title')}
            <span className="cursor"></span>
          </h1>
          <p className="hero-subtitle">{t('hero.subtitle')}</p>

          <form onSubmit={handleSubmit} className="visualizer-form">
            <div className="input-wrapper">
              <input
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder={t('form.placeholder')}
                className="concept-input"
                disabled={isLoading}
                maxLength={500}
                data-testid="concept-input"
              />
              <button
                type="submit"
                className="btn-primary submit-btn"
                disabled={!concept.trim() || isLoading}
                data-testid="generate-btn"
              >
                {isLoading ? t('form.generating') : t('form.submit')}
              </button>
            </div>

            <div className="examples">
              <span className="examples-label">{t('form.examples')}:</span>
              {examples.map((ex) => (
                <button
                  key={ex.value}
                  type="button"
                  className="example-btn"
                  onClick={() => setConcept(ex.value)}
                  disabled={isLoading}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </form>

          {error && (
            <div className="error-message" data-testid="error-message">
              {error}
            </div>
          )}
        </div>
      </section>

      {isLoading && (
        <section className="loading-section">
          <div className="container">
            <div className="loading-animation">
              <div className="loading-text">{t('loading.analyzing')}</div>
              <div className="loading-bar">
                <div className="loading-progress"></div>
              </div>
              <div className="loading-subtext">{t('loading.predicting')}</div>
            </div>
          </div>
        </section>
      )}

      {visionResult && !isLoading && (
        <VisionResult result={visionResult} />
      )}

      {!visionResult && !isLoading && (
        <section className="features">
          <div className="container">
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>{t('features.tech.title')}</h3>
                <p>{t('features.tech.desc')}</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">👤</div>
                <h3>{t('features.ux.title')}</h3>
                <p>{t('features.ux.desc')}</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🌍</div>
                <h3>{t('features.society.title')}</h3>
                <p>{t('features.society.desc')}</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
