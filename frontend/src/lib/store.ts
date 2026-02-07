import { create } from 'zustand'

interface TokenStatus {
  tokens_remaining: number
  tokens_purchased: number
  free_trial_used: boolean
  free_trial_available: boolean
}

interface VisionSection {
  title: string
  content: string
}

interface VisionResult {
  title: string
  year: number
  summary: string
  sections: Record<string, VisionSection>
  key_changes: string[]
  is_free_trial: boolean
  remaining_tokens: number
}

interface AppState {
  deviceId: string | null
  setDeviceId: (id: string) => void
  
  tokenStatus: TokenStatus | null
  setTokenStatus: (status: TokenStatus) => void
  
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  
  error: string | null
  setError: (error: string | null) => void
  
  visionResult: VisionResult | null
  setVisionResult: (result: VisionResult | null) => void
}

export const useStore = create<AppState>((set) => ({
  deviceId: null,
  setDeviceId: (id) => set({ deviceId: id }),
  
  tokenStatus: null,
  setTokenStatus: (status) => set({ tokenStatus: status }),
  
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  error: null,
  setError: (error) => set({ error }),
  
  visionResult: null,
  setVisionResult: (result) => set({ visionResult: result }),
}))
