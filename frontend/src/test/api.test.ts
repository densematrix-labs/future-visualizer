import { describe, it, expect, vi, beforeEach } from 'vitest'
import { visualizeFuture, getTokenStatus, createCheckout } from '../lib/api'

describe('API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('visualizeFuture', () => {
    it('calls the correct endpoint', async () => {
      const mockResponse = {
        title: 'Future iPhone',
        year: 2036,
        summary: 'Test summary',
        sections: {},
        key_changes: [],
        is_free_trial: true,
        remaining_tokens: 0,
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await visualizeFuture('iPhone', 'en', 'test-device')

      expect(fetch).toHaveBeenCalledWith('/api/v1/visualize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-Id': 'test-device',
        },
        body: JSON.stringify({ concept: 'iPhone', language: 'en' }),
      })

      expect(result.title).toBe('Future iPhone')
    })

    it('throws PAYMENT_REQUIRED on 402', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 402,
        json: () => Promise.resolve({ error: 'Payment required' }),
      })

      await expect(visualizeFuture('iPhone', 'en', 'test-device'))
        .rejects.toThrow('PAYMENT_REQUIRED')
    })
  })

  describe('getTokenStatus', () => {
    it('calls the correct endpoint', async () => {
      const mockResponse = {
        device_id: 'test-device',
        tokens_remaining: 5,
        tokens_purchased: 10,
        free_trial_used: true,
        free_trial_available: false,
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await getTokenStatus('test-device')

      expect(fetch).toHaveBeenCalledWith('/api/v1/tokens/status', {
        headers: {
          'X-Device-Id': 'test-device',
        },
      })

      expect(result.tokens_remaining).toBe(5)
    })
  })

  describe('createCheckout', () => {
    it('calls the correct endpoint', async () => {
      const mockResponse = {
        checkout_url: 'https://checkout.example.com',
        checkout_id: 'checkout-123',
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await createCheckout('starter', 'test-device')

      expect(fetch).toHaveBeenCalledWith('/api/v1/checkout', expect.any(Object))
      expect(result.checkout_url).toBe('https://checkout.example.com')
    })
  })
})
