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

  it("renders background image with role img", () => {
    render(<HeroSection />);
    expect(
      screen.getByRole("img", { name: /team group photo background/i })
    ).toBeInTheDocument();
  });

  it("renders massive typography with STORY'S, SIGNAL, CALLER, SUMMIT", () => {
    render(<HeroSection />);
    expect(screen.getByText("STORY'S")).toBeInTheDocument();
    expect(screen.getByText("SIGNAL")).toBeInTheDocument();
    expect(screen.getByText("CALLER")).toBeInTheDocument();
    expect(screen.getByText("SUMMIT")).toBeInTheDocument();
  });

  it("renders countdown timer element", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("countdown-timer")).toBeInTheDocument();
    expect(screen.getByText("DAYS")).toBeInTheDocument();
    expect(screen.getByText("HRS")).toBeInTheDocument();
    expect(screen.getByText("MIN")).toBeInTheDocument();
    expect(screen.getByText("SEC")).toBeInTheDocument();
  });

  it("renders info strip with date, time, and location", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("info-strip")).toBeInTheDocument();
    expect(screen.getByText("JULY 18, 2026")).toBeInTheDocument();
    expect(screen.getByText("10:00 AM EST")).toBeInTheDocument();
    expect(screen.getByText("LANETT, AL")).toBeInTheDocument();
  });

  it('renders "Register Now" CTA with href="/register"', () => {
    render(<HeroSection />);
    const registerButtons = screen.getAllByRole("link", { name: /register now/i });
    expect(registerButtons.length).toBeGreaterThan(0);
    expect(registerButtons[0]).toHaveAttribute("href", "/register");
  });

  it("renders Sweet Feet Academy partner text", () => {
    render(<HeroSection />);
    expect(
      screen.getByText(/partnered with sweet feet academy/i)
    ).toBeInTheDocument();
  });
});
