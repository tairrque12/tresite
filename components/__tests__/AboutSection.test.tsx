import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutSection } from "../AboutSection";

describe("AboutSection", () => {
  it('section renders with id="about"', () => {
    render(<AboutSection />);
    expect(document.getElementById("about")).toBeInTheDocument();
  });

  it('renders "TRE" as main display text', () => {
    render(<AboutSection />);
    expect(screen.getByText("TRE")).toBeInTheDocument();
  });

  it('renders "FOUNDER" heading', () => {
    render(<AboutSection />);
    expect(
      screen.getByRole("heading", { name: /founder/i })
    ).toBeInTheDocument();
  });

  it('renders bio text containing "wisdom, faith, and boldness"', () => {
    render(<AboutSection />);
    expect(screen.getByText(/wisdom, faith, and boldness/i)).toBeInTheDocument();
  });

  it('renders primary photo with alt="Tre Story on the field"', () => {
    render(<AboutSection />);
    expect(
      screen.getByRole("img", { name: "Tre Story on the field" })
    ).toBeInTheDocument();
  });

  it('renders credential: "Tuskegee University"', () => {
    render(<AboutSection />);
    expect(screen.getByText(/Tuskegee University/)).toBeInTheDocument();
  });

  it('renders credential: "Project Engineer"', () => {
    render(<AboutSection />);
    expect(screen.getByText(/Project Engineer/)).toBeInTheDocument();
  });

  it('renders exactly 4 stat elements (data-testid="stat-card")', () => {
    render(<AboutSection />);
    const statCards = screen.getAllByTestId("stat-card");
    expect(statCards).toHaveLength(4);
  });

  it('renders "Book a Consultation" link with href="/book"', () => {
    render(<AboutSection />);
    const bookLink = screen.getByRole("link", { name: /book a consultation/i });
    expect(bookLink).toBeInTheDocument();
    expect(bookLink).toHaveAttribute("href", "/book");
  });

  it('renders blockquote with attribution "Clifford \\"Tre\\" Story Jr."', () => {
    render(<AboutSection />);
    const quote = screen.getByTestId("quote");
    expect(quote).toBeInTheDocument();
    expect(screen.getByText(/Clifford "Tre" Story Jr/)).toBeInTheDocument();
  });
});
