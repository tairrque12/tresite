import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhatIsSection } from "../WhatIsSection";

describe("WhatIsSection", () => {
  it('section renders with id="what-is"', () => {
    render(<WhatIsSection />);
    expect(document.getElementById("what-is")).toBeInTheDocument();
  });

  it('renders heading "WHAT IS" and "SIGNAL CALLER SUMMIT"', () => {
    render(<WhatIsSection />);
    expect(screen.getByText("WHAT IS")).toBeInTheDocument();
    expect(screen.getByText("SIGNAL CALLER SUMMIT")).toBeInTheDocument();
  });

  it("renders QB Training track card", () => {
    render(<WhatIsSection />);
    expect(screen.getByText("QB TRAINING")).toBeInTheDocument();
  });

  it("renders WR Training track card", () => {
    render(<WhatIsSection />);
    expect(screen.getByText("WR TRAINING")).toBeInTheDocument();
  });

  it("renders Leadership Sessions track card", () => {
    render(<WhatIsSection />);
    expect(screen.getByText("LEADERSHIP")).toBeInTheDocument();
  });

  it("renders Character Building track card", () => {
    render(<WhatIsSection />);
    expect(screen.getByText("CHARACTER")).toBeInTheDocument();
  });

  it("renders exactly 4 track cards (data-testid='track-card')", () => {
    render(<WhatIsSection />);
    const trackCards = screen.getAllByTestId("track-card");
    expect(trackCards).toHaveLength(4);
  });

  it("renders intro paragraph about the summit", () => {
    render(<WhatIsSection />);
    expect(screen.getByText(/one-day intensive/i)).toBeInTheDocument();
  });

  it('renders "Register Now" CTA with href="/register"', () => {
    render(<WhatIsSection />);
    const registerLink = screen.getByRole("link", { name: /register now/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute("href", "/register");
  });

  it("renders description text for each track", () => {
    render(<WhatIsSection />);
    expect(screen.getByText(/footwork, throwing mechanics/i)).toBeInTheDocument();
    expect(screen.getByText(/route running, catching/i)).toBeInTheDocument();
    expect(screen.getByText(/decision-making, communication/i)).toBeInTheDocument();
    expect(screen.getByText(/faith, discipline, accountability/i)).toBeInTheDocument();
  });
});
