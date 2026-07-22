import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "../HeroSection";

describe("HeroSection", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-01T10:00:00-05:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders background image", () => {
    render(<HeroSection />);
    expect(
      screen.getByAltText(/group photo background/i)
    ).toBeInTheDocument();
  });

  it("renders massive typography with STORY'S, SIGNAL, CALLER, SUMMIT", () => {
    render(<HeroSection />);
    expect(screen.getByText("STORY'S")).toBeInTheDocument();
    expect(screen.getByText("SIGNAL")).toBeInTheDocument();
    expect(screen.getByText("CALLER")).toBeInTheDocument();
    expect(screen.getByText("SUMMIT")).toBeInTheDocument();
  });

  it("renders next summit CTA with waitlist link", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("next-summit-cta")).toBeInTheDocument();
    expect(screen.getByText("SIGNAL CALLER SUMMIT 2026 COMPLETE")).toBeInTheDocument();
    expect(screen.getByText(/be the first to know/i)).toBeInTheDocument();
    const waitlistLinks = screen.getAllByRole("link", { name: /join waitlist/i });
    expect(waitlistLinks.length).toBeGreaterThan(0);
    expect(waitlistLinks[0]).toHaveAttribute("href", "/register?waitlist=true");
  });

  it("renders info strip with waitlist message", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("info-strip")).toBeInTheDocument();
    expect(screen.getByText("BE FIRST TO KNOW ABOUT THE NEXT SUMMIT")).toBeInTheDocument();
  });

  it('renders "Join Waitlist" CTA with href="/register?waitlist=true"', () => {
    render(<HeroSection />);
    const waitlistButtons = screen.getAllByRole("link", { name: /join waitlist/i });
    expect(waitlistButtons.length).toBeGreaterThan(0);
    expect(waitlistButtons[0]).toHaveAttribute("href", "/register?waitlist=true");
  });

  it("renders Sweet Feet Academy partner text", () => {
    render(<HeroSection />);
    expect(
      screen.getByText(/partnered with sweet feet academy/i)
    ).toBeInTheDocument();
  });
});
