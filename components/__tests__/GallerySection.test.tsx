import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import GalleryPage from "../../app/gallery/page";
import { AboutSection } from "../AboutSection";

describe("GalleryPage", () => {
  it('renders "FROM THE FIELD" heading', () => {
    render(<GalleryPage />);
    expect(screen.getByText("FROM THE FIELD")).toBeInTheDocument();
  });

  it('renders "SIGNAL CALLER SUMMIT 2025" subheading', () => {
    render(<GalleryPage />);
    expect(screen.getByText("SIGNAL CALLER SUMMIT 2025")).toBeInTheDocument();
  });

  it("renders 10 images in gallery", () => {
    render(<GalleryPage />);
    expect(screen.getByAltText("Signal Caller Summit group photo")).toBeInTheDocument();
    expect(screen.getByAltText("Clifford Story, III coaching on the field")).toBeInTheDocument();
    expect(screen.getByAltText("Clifford Story, III training with an athlete")).toBeInTheDocument();
    expect(screen.getByAltText("Clifford Story, III with camp participants")).toBeInTheDocument();
    expect(screen.getByAltText("Clifford Story, III with family")).toBeInTheDocument();
    const campPhotos = screen.getAllByAltText("Signal Caller Summit camp photo");
    expect(campPhotos.length).toBe(5);
  });
});

describe("AboutSection", () => {
  it('renders img with alt "Clifford Story, III on the field"', () => {
    render(<AboutSection />);
    expect(screen.getByAltText("Clifford Story, III on the field")).toBeInTheDocument();
  });
});
