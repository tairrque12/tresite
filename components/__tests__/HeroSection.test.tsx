import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroSection } from '../HeroSection'

describe('HeroSection', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-01T10:00:00-05:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the logo image with alt="Story\'s Signal Caller Summit"', () => {
    render(<HeroSection />)
    expect(screen.getByRole('img', { name: "Story's Signal Caller Summit" })).toBeInTheDocument()
  })

  it('renders tagline "Developing Quarterbacks. Building Leaders. Inspiring Excellence."', () => {
    render(<HeroSection />)
    expect(screen.getByText('Developing Quarterbacks. Building Leaders. Inspiring Excellence.')).toBeInTheDocument()
  })

  it('renders camp date "July 18th, 2026"', () => {
    render(<HeroSection />)
    expect(screen.getByText('July 18th, 2026')).toBeInTheDocument()
  })

  it('renders camp time "10:00 AM EST"', () => {
    render(<HeroSection />)
    expect(screen.getByText('10:00 AM EST')).toBeInTheDocument()
  })

  it('renders location "Story Field at Morgan Washburn Stadium"', () => {
    render(<HeroSection />)
    expect(screen.getByText('Story Field at Morgan Washburn Stadium')).toBeInTheDocument()
  })

  it('renders "Register Now" CTA button with href="/register"', () => {
    render(<HeroSection />)
    const registerButton = screen.getByRole('link', { name: /register now/i })
    expect(registerButton).toBeInTheDocument()
    expect(registerButton).toHaveAttribute('href', '/register')
  })

  it('renders "Learn More" button that scrolls to #about section', () => {
    render(<HeroSection />)
    const learnMoreButton = screen.getByRole('link', { name: /learn more/i })
    expect(learnMoreButton).toBeInTheDocument()
    expect(learnMoreButton).toHaveAttribute('href', '#about')
  })

  it('"Register Now" button has minimum height of 48px (mobile tap target)', () => {
    render(<HeroSection />)
    const registerButton = screen.getByRole('link', { name: /register now/i })
    expect(registerButton).toHaveClass('min-h-[48px]')
  })

  it('hero section has a countdown timer element rendered on screen', () => {
    render(<HeroSection />)
    expect(screen.getByTestId('countdown-timer')).toBeInTheDocument()
    expect(screen.getByText('DAYS')).toBeInTheDocument()
    expect(screen.getByText('HRS')).toBeInTheDocument()
    expect(screen.getByText('MIN')).toBeInTheDocument()
    expect(screen.getByText('SEC')).toBeInTheDocument()
  })

  it('partner badge renders "Sweet Feet Academy" text', () => {
    render(<HeroSection />)
    expect(screen.getByText(/Sweet Feet Academy/i)).toBeInTheDocument()
  })
})
