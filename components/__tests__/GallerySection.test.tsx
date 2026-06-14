import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GallerySection } from "../GallerySection";
import { AboutSection } from "../AboutSection";

describe("GallerySection", () => {
  it('renders "FROM THE FIELD" heading', () => {
    render(<GallerySection />);
    expect(screen.getByText("FROM THE FIELD")).toBeInTheDocument();
  });

  it('renders "SIGNAL CALLER SUMMIT 2025" subheading', () => {
    render(<GallerySection />);
    expect(screen.getByText("SIGNAL CALLER SUMMIT 2025")).toBeInTheDocument();
  });

  it("renders 4 images with correct alt text", () => {
    render(<GallerySection />);
    expect(screen.getByAltText("Tre Story coaching on the field")).toBeInTheDocument();
    expect(screen.getByAltText("Tre Story training with an athlete")).toBeInTheDocument();
    expect(screen.getByAltText("Tre Story with camp participants")).toBeInTheDocument();
    expect(screen.getByAltText("Tre Story with family")).toBeInTheDocument();
  });
});

describe("AboutSection", () => {
  it('renders img with alt "Tre Story on the field"', () => {
    render(<AboutSection />);
    expect(screen.getByAltText("Tre Story on the field")).toBeInTheDocument();
  });
});
