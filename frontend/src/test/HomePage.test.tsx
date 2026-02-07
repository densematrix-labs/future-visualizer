import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import { useStore } from '../lib/store'

vi.mock('../lib/store', () => ({
  useStore: vi.fn(() => ({
    deviceId: 'test-device',
    isLoading: false,
    setIsLoading: vi.fn(),
    error: null,
    setError: vi.fn(),
    visionResult: null,
    setVisionResult: vi.fn(),
  })),
}))

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the hero title', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('hero.title')).toBeInTheDocument()
  })

  it('renders the input field', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )
    
    expect(screen.getByTestId('concept-input')).toBeInTheDocument()
  })

  it('renders the generate button', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )
    
    expect(screen.getByTestId('generate-btn')).toBeInTheDocument()
  })

  it('button is disabled when input is empty', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )
    
    const button = screen.getByTestId('generate-btn')
    expect(button).toBeDisabled()
  })

  it('button is enabled when input has text', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )
    
    const input = screen.getByTestId('concept-input')
    fireEvent.change(input, { target: { value: 'iPhone' } })
    
    const button = screen.getByTestId('generate-btn')
    expect(button).not.toBeDisabled()
  })

  it('shows loading state', () => {
    vi.mocked(useStore).mockReturnValue({
      deviceId: 'test-device',
      isLoading: true,
      setIsLoading: vi.fn(),
      error: null,
      setError: vi.fn(),
      visionResult: null,
      setVisionResult: vi.fn(),
    } as ReturnType<typeof useStore>)

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('loading.analyzing')).toBeInTheDocument()
  })

  it('shows error message', () => {
    vi.mocked(useStore).mockReturnValue({
      deviceId: 'test-device',
      isLoading: false,
      setIsLoading: vi.fn(),
      error: 'Test error',
      setError: vi.fn(),
      visionResult: null,
      setVisionResult: vi.fn(),
    } as ReturnType<typeof useStore>)

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )
    
    expect(screen.getByTestId('error-message')).toHaveTextContent('Test error')
  })

  it('renders example buttons', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('iPhone')).toBeInTheDocument()
    expect(screen.getByText('Twitter/X')).toBeInTheDocument()
  })
})
