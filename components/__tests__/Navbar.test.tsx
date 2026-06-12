import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navbar } from '../Navbar'

describe('Navbar', () => {
  it('renders brand name "Signal Caller Summit"', () => {
    render(<Navbar />)
    expect(screen.getByText('Signal Caller Summit')).toBeInTheDocument()
  })

  it('renders "Register Now" button/link', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /register now/i })).toBeInTheDocument()
  })

  it('renders nav links: About, Sponsors, Updates', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sponsors/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /updates/i })).toBeInTheDocument()
  })

  it('"Register Now" is the only element with filled green background styling', () => {
    render(<Navbar />)
    const registerLinks = screen.getAllByRole('link', { name: /register now/i })
    registerLinks.forEach((link) => {
      expect(link).toHaveClass('bg-[#1e6b3a]')
    })

    const aboutLink = screen.getByRole('link', { name: /^about$/i })
    expect(aboutLink).not.toHaveClass('bg-[#1e6b3a]')
  })

  it('hamburger menu icon renders on mobile (check aria-label="Open menu")', () => {
    render(<Navbar />)
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument()
  })

  it('mobile menu opens when hamburger is clicked — About, Sponsors, Updates, Book Clifford all visible', async () => {
    const user = userEvent.setup()
    render(<Navbar />)

    const hamburger = screen.getByRole('button', { name: 'Open menu' })
    await user.click(hamburger)

    const mobileMenu = screen.getByTestId('mobile-menu')
    expect(mobileMenu).toBeInTheDocument()

    expect(screen.getByTestId('mobile-about')).toBeInTheDocument()
    expect(screen.getByTestId('mobile-sponsors')).toBeInTheDocument()
    expect(screen.getByTestId('mobile-updates')).toBeInTheDocument()
    expect(screen.getByTestId('mobile-book')).toBeInTheDocument()
  })

  it('mobile menu closes when X button is clicked', async () => {
    const user = userEvent.setup()
    render(<Navbar />)

    const hamburger = screen.getByRole('button', { name: 'Open menu' })
    await user.click(hamburger)

    const closeButton = screen.getByRole('button', { name: 'Close menu' })
    await user.click(closeButton)

    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument()
  })

  it('"Register Now" and "Book Clifford" both appear in the open mobile menu', async () => {
    const user = userEvent.setup()
    render(<Navbar />)

    const hamburger = screen.getByRole('button', { name: 'Open menu' })
    await user.click(hamburger)

    expect(screen.getByTestId('mobile-register')).toBeInTheDocument()
    expect(screen.getByTestId('mobile-book')).toBeInTheDocument()
  })

  it('navbar has sticky positioning (check className includes "sticky" or "fixed")', () => {
    render(<Navbar />)
    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    const hasSticky = nav.className.includes('sticky') || nav.className.includes('fixed')
    expect(hasSticky).toBe(true)
  })

  it('logo/brand name acts as a home link (href="/")', () => {
    render(<Navbar />)
    const brandLink = screen.getByRole('link', { name: /signal caller summit/i })
    expect(brandLink).toHaveAttribute('href', '/')
  })
})
