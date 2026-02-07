import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../lib/store'
import { getTokenStatus } from '../lib/api'
import './PaymentSuccessPage.css'

export default function PaymentSuccessPage() {
  const { t } = useTranslation()
  const { deviceId, setTokenStatus } = useStore()
  const [loading, setLoading] = useState(true)
  const [tokens, setTokens] = useState<number | null>(null)

  useEffect(() => {
    if (!deviceId) return

    const fetchTokens = async () => {
      try {
        const status = await getTokenStatus(deviceId)
        setTokenStatus(status)
        setTokens(status.tokens_remaining)
      } catch (err) {
        console.error('Failed to fetch token status:', err)
      } finally {
        setLoading(false)
      }
    }

    // Wait a moment for webhook to process
    const timer = setTimeout(fetchTokens, 2000)
    return () => clearTimeout(timer)
  }, [deviceId, setTokenStatus])

  return (
    <div className="success-page">
      <div className="container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h1>{t('success.title')}</h1>
          <p className="success-message">{t('success.message')}</p>

          {loading ? (
            <div className="loading-tokens">{t('success.loading')}</div>
          ) : tokens !== null ? (
            <div className="tokens-display">
              <span className="tokens-label">{t('success.tokensAvailable')}</span>
              <span className="tokens-count">{tokens}</span>
            </div>
          ) : null}

          <Link to="/" className="btn btn-primary">
            {t('success.startUsing')}
          </Link>
        </div>
      </div>
    </div>
  )
}
