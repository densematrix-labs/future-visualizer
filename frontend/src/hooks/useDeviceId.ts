import { useEffect } from 'react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { useStore } from '../lib/store'

export function useDeviceId() {
  const { deviceId, setDeviceId } = useStore()

  useEffect(() => {
    if (deviceId) return

    const initFingerprint = async () => {
      try {
        const fp = await FingerprintJS.load()
        const result = await fp.get()
        setDeviceId(result.visitorId)
      } catch (error) {
        // Fallback to localStorage-based ID
        const storedId = localStorage.getItem('device_id')
        if (storedId) {
          setDeviceId(storedId)
        } else {
          const newId = 'fv_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
          localStorage.setItem('device_id', newId)
          setDeviceId(newId)
        }
      }
    }

    initFingerprint()
  }, [deviceId, setDeviceId])

  return deviceId
}
