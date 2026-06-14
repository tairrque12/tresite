import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AboutSection } from '../AboutSection'

describe('AboutSection', () => {
  it('section renders with id="about"', () => {
    render(<AboutSection />)
    expect(document.getElementById('about')).toBeInTheDocument()
  })

  it('renders heading "Meet Tre Story"', () => {
    render(<AboutSection />)
    expect(screen.getByRole('heading', { name: /meet tre story/i })).toBeInTheDocument()
  })

  it('renders label "Founder & Head Coach"', () => {
    render(<AboutSection />)
    expect(screen.getByText(/founder & head coach/i)).toBeInTheDocument()
  })

  it('renders bio text containing "wisdom, faith, and boldness"', () => {
    render(<AboutSection />)
    expect(screen.getByText(/wisdom, faith, and boldness/i)).toBeInTheDocument()
  })

  it('renders primary photo with alt="Tre Story on the field"', () => {
    render(<AboutSection />)
    expect(screen.getByRole('img', { name: 'Tre Story on the field' })).toBeInTheDocument()
  })

  it('renders credential: "Tuskegee University"', () => {
    render(<AboutSection />)
    expect(screen.getByText(/Tuskegee University/)).toBeInTheDocument()
  })

  it('renders credential: "Project Engineer, Atlanta GA"', () => {
    render(<AboutSection />)
    expect(screen.getByText(/Project Engineer/)).toBeInTheDocument()
    expect(screen.getByText(/Atlanta/)).toBeInTheDocument()
  })

  it('renders exactly 4 stat cards (data-testid="stat-card")', () => {
    render(<AboutSection />)
    const statCards = screen.getAllByTestId('stat-card')
    expect(statCards).toHaveLength(4)
  })

  it('renders "Book a Consultation" button with href="/book"', () => {
    render(<AboutSection />)
    const bookButton = screen.getByRole('link', { name: /book a consultation/i })
    expect(bookButton).toBeInTheDocument()
    expect(bookButton).toHaveAttribute('href', '/book')
  })

  it('renders blockquote with attribution "Clifford \\"Tre\\" Story Jr."', () => {
    render(<AboutSection />)
    const quote = screen.getByTestId('quote')
    expect(quote).toBeInTheDocument()
    expect(screen.getByText(/Clifford "Tre" Story Jr/)).toBeInTheDocument()
  })
})
