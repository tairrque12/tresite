import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BookPage from "../page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

global.fetch = vi.fn();

describe("BookPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders "BOOK A 1 ON 1 CONSULTATION" heading', () => {
    render(<BookPage />);
    expect(screen.getByText("BOOK A")).toBeInTheDocument();
    expect(screen.getByText("1 ON 1")).toBeInTheDocument();
    expect(screen.getByText("CONSULTATION")).toBeInTheDocument();
  });

  it('renders "YEAR-ROUND TRAINING" label', () => {
    render(<BookPage />);
    expect(screen.getByText("YEAR-ROUND TRAINING")).toBeInTheDocument();
  });

  it("renders first name and last name fields", () => {
    render(<BookPage />);
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
  });

  it("renders email and phone fields", () => {
    render(<BookPage />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
  });

  it("renders booking type dropdown with all 5 options", () => {
    render(<BookPage />);
    const select = screen.getByLabelText(/type of booking/i);
    expect(select).toBeInTheDocument();
    expect(screen.getByText("Individual Athlete (1-on-1)")).toBeInTheDocument();
    expect(screen.getByText("Group Session (2-10 Athletes)")).toBeInTheDocument();
    expect(screen.getByText("Team Training (11+ Athletes)")).toBeInTheDocument();
    expect(screen.getByText("School / Organization Visit")).toBeInTheDocument();
    expect(screen.getByText("Speaking Engagement")).toBeInTheDocument();
  });

  it("renders age range dropdown", () => {
    render(<BookPage />);
    expect(screen.getByLabelText(/age range/i)).toBeInTheDocument();
  });

  it("renders skill level dropdown", () => {
    render(<BookPage />);
    expect(screen.getByLabelText(/skill level/i)).toBeInTheDocument();
  });

  it("renders position checkboxes (QB, WR, Both, N/A)", () => {
    render(<BookPage />);
    expect(screen.getByLabelText(/quarterback \(qb\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/wide receiver \(wr\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^both$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^n\/a$/i)).toBeInTheDocument();
  });

  it("renders session format dropdown with 3 options", () => {
    render(<BookPage />);
    const select = screen.getByLabelText(/preferred session format/i);
    expect(select).toBeInTheDocument();
    expect(screen.getByText("In-Person — Lanett, AL area")).toBeInTheDocument();
    expect(screen.getByText("Virtual — Zoom film review / mechanics breakdown")).toBeInTheDocument();
    expect(screen.getByText("Travel — Clifford Story, III comes to your location")).toBeInTheDocument();
  });

  it("renders preferred date input", () => {
    render(<BookPage />);
    expect(screen.getByLabelText(/preferred date/i)).toBeInTheDocument();
  });

  it("renders session goals textarea", () => {
    render(<BookPage />);
    expect(screen.getByLabelText(/session goals/i)).toBeInTheDocument();
  });

  it("renders SMS consent checkbox", () => {
    render(<BookPage />);
    expect(screen.getByTestId("sms-consent-book")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<BookPage />);
    expect(screen.getByTestId("submit-book")).toBeInTheDocument();
  });

  it("shows validation error when submitting empty form", async () => {
    render(<BookPage />);
    const submitButton = screen.getByTestId("submit-book");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });
  });

  it("email input has correct type attribute for validation", () => {
    render(<BookPage />);
    const emailInput = screen.getByLabelText(/email address/i);
    expect(emailInput).toHaveAttribute("type", "email");
  });

  it("shows validation error when sessionGoals is under 20 characters", async () => {
    render(<BookPage />);
    const goalsTextarea = screen.getByLabelText(/session goals/i);
    fireEvent.change(goalsTextarea, { target: { value: "Short goal" } });

    const submitButton = screen.getByTestId("submit-book");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/at least 20 characters/i)).toBeInTheDocument();
    });
  });

  it('success state renders "REQUEST SENT!" after mock successful submission', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    render(<BookPage />);

    // Fill out required fields
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: "555-123-4567" } });
    fireEvent.change(screen.getByLabelText(/type of booking/i), { target: { value: "individual" } });
    fireEvent.change(screen.getByLabelText(/age range/i), { target: { value: "14-16" } });
    fireEvent.change(screen.getByLabelText(/skill level/i), { target: { value: "intermediate" } });
    fireEvent.change(screen.getByLabelText(/preferred session format/i), { target: { value: "in-person" } });
    fireEvent.change(screen.getByLabelText(/preferred date/i), { target: { value: "2026-08-01" } });
    fireEvent.change(screen.getByLabelText(/session goals/i), {
      target: { value: "I want to improve my throwing mechanics and footwork significantly." }
    });
    fireEvent.click(screen.getByTestId("sms-consent-book"));

    fireEvent.click(screen.getByTestId("submit-book"));

    await waitFor(() => {
      expect(screen.getByText("REQUEST SENT!")).toBeInTheDocument();
    });
  });

  it("success state shows booking summary", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    render(<BookPage />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: "555-123-4567" } });
    fireEvent.change(screen.getByLabelText(/type of booking/i), { target: { value: "individual" } });
    fireEvent.change(screen.getByLabelText(/age range/i), { target: { value: "14-16" } });
    fireEvent.change(screen.getByLabelText(/skill level/i), { target: { value: "intermediate" } });
    fireEvent.change(screen.getByLabelText(/preferred session format/i), { target: { value: "in-person" } });
    fireEvent.change(screen.getByLabelText(/preferred date/i), { target: { value: "2026-08-01" } });
    fireEvent.change(screen.getByLabelText(/session goals/i), {
      target: { value: "I want to improve my throwing mechanics and footwork significantly." }
    });
    fireEvent.click(screen.getByTestId("sms-consent-book"));

    fireEvent.click(screen.getByTestId("submit-book"));

    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    });
  });

  it('three column "what Clifford Story, III offers" strip renders', () => {
    render(<BookPage />);
    expect(screen.getByText("QB DEVELOPMENT")).toBeInTheDocument();
    expect(screen.getByText("WR TRAINING")).toBeInTheDocument();
    expect(screen.getByText("LEADERSHIP + LIFE")).toBeInTheDocument();
  });

  it('"cliffstoryiii@gmail.com" contact info renders', () => {
    render(<BookPage />);
    const emails = screen.getAllByText("cliffstoryiii@gmail.com");
    expect(emails.length).toBeGreaterThan(0);
  });
});
