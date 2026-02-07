const API_BASE = '/api/v1'

interface VisualizeResponse {
  title: string
  year: number
  summary: string
  sections: Record<string, { title: string; content: string }>
  key_changes: string[]
  is_free_trial: boolean
  remaining_tokens: number
}

interface TokenStatusResponse {
  device_id: string
  tokens_remaining: number
  tokens_purchased: number
  free_trial_used: boolean
  free_trial_available: boolean
}

interface CheckoutResponse {
  checkout_url: string
  checkout_id: string
}

interface ProductInfo {
  sku: string
  tokens: number
  price_cents: number
  available: boolean
}

export async function visualizeFuture(
  concept: string,
  language: string,
  deviceId: string
): Promise<VisualizeResponse> {
  const response = await fetch(`${API_BASE}/visualize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Device-Id': deviceId,
    },
    body: JSON.stringify({ concept, language }),
  })

  if (!response.ok) {
    const data = await response.json()
    if (response.status === 402) {
      throw new Error('PAYMENT_REQUIRED')
    }
    // Handle detail being string or object
    const errorMessage = typeof data.detail === 'string' 
      ? data.detail 
      : data.detail?.error || data.detail?.message || 'Failed to generate vision'
    throw new Error(errorMessage)
  }

  return response.json()
}

export async function getTokenStatus(deviceId: string): Promise<TokenStatusResponse> {
  const response = await fetch(`${API_BASE}/tokens/status`, {
    headers: {
      'X-Device-Id': deviceId,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to get token status')
  }

  return response.json()
}

export async function createCheckout(
  productSku: string,
  deviceId: string
): Promise<CheckoutResponse> {
  const response = await fetch(`${API_BASE}/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_sku: productSku,
      device_id: deviceId,
      success_url: `${window.location.origin}/payment/success`,
      cancel_url: `${window.location.origin}/pricing`,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create checkout')
  }

  return response.json()
}

export async function getProducts(): Promise<{ products: ProductInfo[] }> {
  const response = await fetch(`${API_BASE}/products`)
  
  if (!response.ok) {
    throw new Error('Failed to get products')
  }
  
  return response.json()
}
