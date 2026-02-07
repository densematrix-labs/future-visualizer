import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

describe('App', () => {
  it('renders the header', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    expect(screen.getByText('app.name')).toBeInTheDocument()
  })

  it('renders the pricing link', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    expect(screen.getByText('nav.pricing')).toBeInTheDocument()
  })
})
