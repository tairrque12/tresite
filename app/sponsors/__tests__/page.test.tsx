import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SponsorsPage from "../page";
import SuccessPage from "../success/page";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("tier=gold"),
}));

describe("SponsorsPage", () => {
  it('renders "INVEST IN THE NEXT GENERATION" heading', () => {
    render(<SponsorsPage />);
    expect(screen.getByText("INVEST IN THE")).toBeInTheDocument();
    expect(screen.getByText("NEXT GENERATION")).toBeInTheDocument();
  });

  it("renders deadline countdown element", () => {
    render(<SponsorsPage />);
    const countdowns = screen.getAllByTestId("sponsor-countdown");
    expect(countdowns.length).toBeGreaterThan(0);
  });

  it("renders all 5 tier cards", () => {
    render(<SponsorsPage />);
    expect(screen.getByTestId("tier-platinum")).toBeInTheDocument();
    expect(screen.getByTestId("tier-gold")).toBeInTheDocument();
    expect(screen.getByTestId("tier-silver")).toBeInTheDocument();
    expect(screen.getByTestId("tier-bronze")).toBeInTheDocument();
    expect(screen.getByTestId("tier-friend")).toBeInTheDocument();
  });

  it('Platinum card shows "LIMITED TO 5" badge', () => {
    render(<SponsorsPage />);
    expect(screen.getByText("LIMITED TO 5")).toBeInTheDocument();
  });

  it("each tier card renders correct price", () => {
    render(<SponsorsPage />);
    expect(screen.getByText("$250")).toBeInTheDocument();
    expect(screen.getByText("$150")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();
    expect(screen.getByText("$50")).toBeInTheDocument();
    expect(screen.getByText("$25")).toBeInTheDocument();
  });

  it("each CTA button renders with correct data-testid", () => {
    render(<SponsorsPage />);
    expect(screen.getByTestId("cta-platinum")).toBeInTheDocument();
    expect(screen.getByTestId("cta-gold")).toBeInTheDocument();
    expect(screen.getByTestId("cta-silver")).toBeInTheDocument();
    expect(screen.getByTestId("cta-bronze")).toBeInTheDocument();
    expect(screen.getByTestId("cta-friend")).toBeInTheDocument();
  });

  it("Platinum CTA links to /sponsors/checkout?tier=platinum", () => {
    render(<SponsorsPage />);
    const platinumCta = screen.getByTestId("cta-platinum");
    expect(platinumCta).toHaveAttribute("href", "/sponsors/checkout?tier=platinum");
  });

  it('"CURRENT SPONSORS" section renders', () => {
    render(<SponsorsPage />);
    expect(screen.getByText("CURRENT SPONSORS")).toBeInTheDocument();
  });

  it("Sweet Feet Academy renders in sponsors wall", () => {
    render(<SponsorsPage />);
    expect(screen.getByText("SWEET FEET ACADEMY")).toBeInTheDocument();
  });

  it("contact form renders name, email, message fields", () => {
    render(<SponsorsPage />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it("contact form submit button renders", () => {
    render(<SponsorsPage />);
    expect(
      screen.getByRole("button", { name: /send message/i })
    ).toBeInTheDocument();
  });

  it('deadline strip renders "JULY 1ST DEADLINE"', () => {
    render(<SponsorsPage />);
    const deadlineElements = screen.getAllByText(/JULY 1ST DEADLINE/i);
    expect(deadlineElements.length).toBeGreaterThan(0);
  });

  it('empty Platinum slots show "YOUR BRAND HERE"', () => {
    render(<SponsorsPage />);
    const emptySlots = screen.getAllByText("YOUR BRAND HERE");
    expect(emptySlots.length).toBeGreaterThanOrEqual(4);
  });

  it('in-kind section renders "DIFFERENT IDEA?"', () => {
    render(<SponsorsPage />);
    expect(screen.getByText("DIFFERENT IDEA?")).toBeInTheDocument();
  });
});

describe("SponsorsSuccessPage", () => {
  it('renders "THANK YOU FOR INVESTING"', () => {
    render(<SuccessPage />);
    expect(screen.getByText("THANK YOU FOR INVESTING")).toBeInTheDocument();
  });
});
