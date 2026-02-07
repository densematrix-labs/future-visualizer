import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../lib/store'
import { createCheckout, getProducts } from '../lib/api'
import './PricingPage.css'

interface Product {
  sku: string
  tokens: number
  price_cents: number
  available: boolean
}

export default function PricingPage() {
  const { t } = useTranslation()
  const { deviceId } = useStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data.products))
      .catch((err) => setError(err.message))
  }, [])

  const handlePurchase = async (sku: string) => {
    if (!deviceId) return
    
    setLoading(sku)
    setError(null)
    
    try {
      const { checkout_url } = await createCheckout(sku, deviceId)
      window.location.href = checkout_url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create checkout')
      setLoading(null)
    }
  }

  const productDetails: Record<string, { name: string; features: string[] }> = {
    starter: {
      name: t('pricing.starter.name'),
      features: [
        t('pricing.starter.feature1'),
        t('pricing.starter.feature2'),
      ],
    },
    standard: {
      name: t('pricing.standard.name'),
      features: [
        t('pricing.standard.feature1'),
        t('pricing.standard.feature2'),
        t('pricing.standard.feature3'),
      ],
    },
    pro: {
      name: t('pricing.pro.name'),
      features: [
        t('pricing.pro.feature1'),
        t('pricing.pro.feature2'),
        t('pricing.pro.feature3'),
        t('pricing.pro.feature4'),
      ],
    },
  }

  return (
    <div className="pricing-page">
      <div className="container">
        <h1>{t('pricing.title')}</h1>
        <p className="pricing-subtitle">{t('pricing.subtitle')}</p>

        {error && <div className="error-message">{error}</div>}

        <div className="pricing-grid">
          {products.map((product) => {
            const details = productDetails[product.sku]
            if (!details) return null

            const isPopular = product.sku === 'standard'
            const price = (product.price_cents / 100).toFixed(2)

            return (
              <div
                key={product.sku}
                className={`pricing-card ${isPopular ? 'popular' : ''}`}
                data-testid={`pricing-card-${product.sku}`}
              >
                {isPopular && (
                  <div className="popular-badge">{t('pricing.popular')}</div>
                )}
                
                <h2>{details.name}</h2>
                
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">{price}</span>
                </div>
                
                <div className="tokens">
                  {product.tokens} {t('pricing.visions')}
                </div>
                
                <ul className="features-list">
                  {details.features.map((feature, i) => (
                    <li key={i}>
                      <span className="check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  className={`btn ${isPopular ? 'btn-primary' : ''}`}
                  onClick={() => handlePurchase(product.sku)}
                  disabled={!product.available || loading === product.sku}
                  data-testid={`buy-btn-${product.sku}`}
                >
                  {loading === product.sku
                    ? t('pricing.processing')
                    : t('pricing.buyNow')}
                </button>
              </div>
            )
          })}
        </div>

        <div className="pricing-footer">
          <p>{t('pricing.guarantee')}</p>
        </div>
      </div>
    </div>
  )
}
