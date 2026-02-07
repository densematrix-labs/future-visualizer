import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LanguageSwitcher from '../components/LanguageSwitcher'

describe('LanguageSwitcher', () => {
  it('renders the language switcher', () => {
    render(<LanguageSwitcher />)
    
    expect(screen.getByTestId('lang-switcher')).toBeInTheDocument()
  })

  it('shows dropdown when clicked', () => {
    render(<LanguageSwitcher />)
    
    const trigger = screen.getByRole('button', { name: /select language/i })
    fireEvent.click(trigger)
    
    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('中文')).toBeInTheDocument()
    expect(screen.getByText('日本語')).toBeInTheDocument()
  })

  it('displays all 7 languages', () => {
    render(<LanguageSwitcher />)
    
    const trigger = screen.getByRole('button', { name: /select language/i })
    fireEvent.click(trigger)
    
    const languages = ['English', '中文', '日本語', 'Deutsch', 'Français', '한국어', 'Español']
    languages.forEach(lang => {
      expect(screen.getByText(lang)).toBeInTheDocument()
    })
  })
})
