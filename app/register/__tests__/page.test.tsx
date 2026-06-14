import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "../page";

vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

vi.mock("@stripe/stripe-js", () => ({
  loadStripe: vi.fn(() =>
    Promise.resolve({
      elements: vi.fn(() => ({
        create: vi.fn(() => ({
          mount: vi.fn(),
          unmount: vi.fn(),
          on: vi.fn(),
        })),
      })),
      confirmPayment: vi.fn(() =>
        Promise.resolve({ paymentIntent: { status: "succeeded" } })
      ),
    })
  ),
}));

vi.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardElement: () => <div data-testid="stripe-card-element">Card Element</div>,
  useStripe: () => ({
    confirmCardPayment: vi.fn(() =>
      Promise.resolve({ paymentIntent: { status: "succeeded" } })
    ),
  }),
  useElements: () => ({
    getElement: vi.fn(() => ({})),
  }),
}));

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ clientSecret: "test_secret" }),
  })
) as unknown as typeof fetch;

describe("RegisterPage - Step 1: Athlete Information", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders "ATHLETE INFORMATION" heading', () => {
    render(<RegisterPage />);
    expect(screen.getByText("ATHLETE INFORMATION")).toBeInTheDocument();
  });

  it("renders first name, last name, DOB fields", () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
  });

  it("renders position dropdown with QB and WR options", () => {
    render(<RegisterPage />);
    const positionSelect = screen.getByLabelText(/position/i);
    expect(positionSelect).toBeInTheDocument();
    expect(screen.getByText(/quarterback/i)).toBeInTheDocument();
    expect(screen.getByText(/wide receiver/i)).toBeInTheDocument();
  });

  it("renders grade dropdown", () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/grade/i)).toBeInTheDocument();
  });

  it("cannot advance without filling required fields", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    const nextButton = screen.getByRole("button", { name: /next/i });
    await user.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("ATHLETE INFORMATION")).toBeInTheDocument();
    });
  });
});

describe("RegisterPage - Step 2: Parent Information", () => {
  async function goToStep2() {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/date of birth/i), "2012-05-15");
    await user.selectOptions(screen.getByLabelText(/position/i), "QB");
    await user.type(screen.getByLabelText(/school name/i), "Test School");
    await user.selectOptions(screen.getByLabelText(/grade/i), "8th");
    await user.type(screen.getByLabelText(/city/i), "Atlanta");
    await user.type(screen.getByLabelText(/state/i), "GA");
    await user.selectOptions(screen.getByLabelText(/t-shirt size/i), "AM");

    const nextButton = screen.getByRole("button", { name: /next/i });
    await user.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("PARENT / GUARDIAN INFORMATION")).toBeInTheDocument();
    });
  }

  it("renders parent first name and last name fields", async () => {
    await goToStep2();
    expect(screen.getByLabelText(/parent\/guardian first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/parent\/guardian last name/i)).toBeInTheDocument();
  });

  it("renders phone number field", async () => {
    await goToStep2();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
  });

  it("renders email field", async () => {
    await goToStep2();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('SMS consent checkbox renders with data-testid="sms-consent"', async () => {
    await goToStep2();
    expect(screen.getByTestId("sms-consent")).toBeInTheDocument();
  });

  it("SMS consent is required to advance", async () => {
    await goToStep2();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/parent\/guardian first name/i), "Jane");
    await user.type(screen.getByLabelText(/parent\/guardian last name/i), "Doe");
    await user.selectOptions(screen.getByLabelText(/relationship/i), "Mother");
    await user.type(screen.getByLabelText(/phone number/i), "555-123-4567");
    await user.type(screen.getByLabelText(/email/i), "jane@test.com");

    const nextButton = screen.getByRole("button", { name: /next/i });
    await user.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("PARENT / GUARDIAN INFORMATION")).toBeInTheDocument();
    });
  });
});

describe("RegisterPage - Step 3: Liability Waiver", () => {
  async function goToStep3() {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/date of birth/i), "2012-05-15");
    await user.selectOptions(screen.getByLabelText(/position/i), "QB");
    await user.type(screen.getByLabelText(/school name/i), "Test School");
    await user.selectOptions(screen.getByLabelText(/grade/i), "8th");
    await user.type(screen.getByLabelText(/city/i), "Atlanta");
    await user.type(screen.getByLabelText(/state/i), "GA");
    await user.selectOptions(screen.getByLabelText(/t-shirt size/i), "AM");

    await user.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText("PARENT / GUARDIAN INFORMATION")).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/parent\/guardian first name/i), "Jane");
    await user.type(screen.getByLabelText(/parent\/guardian last name/i), "Doe");
    await user.selectOptions(screen.getByLabelText(/relationship/i), "Mother");
    await user.type(screen.getByLabelText(/phone number/i), "555-123-4567");
    await user.type(screen.getByLabelText(/email/i), "jane@test.com");
    await user.click(screen.getByTestId("sms-consent"));

    await user.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText("LIABILITY WAIVER")).toBeInTheDocument();
    });
  }

  it('renders waiver text containing "RELEASE OF LIABILITY"', async () => {
    await goToStep3();
    expect(screen.getByText(/RELEASE OF LIABILITY/)).toBeInTheDocument();
  });

  it('waiver checkbox renders with data-testid="waiver-checkbox"', async () => {
    await goToStep3();
    expect(screen.getByTestId("waiver-checkbox")).toBeInTheDocument();
  });

  it('signature input renders with data-testid="signature-input"', async () => {
    await goToStep3();
    expect(screen.getByTestId("signature-input")).toBeInTheDocument();
  });

  it("cannot advance without checking waiver and entering signature", async () => {
    await goToStep3();
    const user = userEvent.setup();

    const nextButton = screen.getByRole("button", { name: /next/i });
    await user.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("LIABILITY WAIVER")).toBeInTheDocument();
    });
  });
});

describe("RegisterPage - Step 4: Payment", () => {
  async function goToStep4() {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/date of birth/i), "2012-05-15");
    await user.selectOptions(screen.getByLabelText(/position/i), "QB");
    await user.type(screen.getByLabelText(/school name/i), "Test School");
    await user.selectOptions(screen.getByLabelText(/grade/i), "8th");
    await user.type(screen.getByLabelText(/city/i), "Atlanta");
    await user.type(screen.getByLabelText(/state/i), "GA");
    await user.selectOptions(screen.getByLabelText(/t-shirt size/i), "AM");

    await user.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText("PARENT / GUARDIAN INFORMATION")).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/parent\/guardian first name/i), "Jane");
    await user.type(screen.getByLabelText(/parent\/guardian last name/i), "Doe");
    await user.selectOptions(screen.getByLabelText(/relationship/i), "Mother");
    await user.type(screen.getByLabelText(/phone number/i), "555-123-4567");
    await user.type(screen.getByLabelText(/email/i), "jane@test.com");
    await user.click(screen.getByTestId("sms-consent"));

    await user.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText("LIABILITY WAIVER")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("waiver-checkbox"));
    await user.type(screen.getByTestId("signature-input"), "Jane Doe");

    await user.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "PAYMENT" })).toBeInTheDocument();
    });
  }

  it('renders order summary with "$50.00"', async () => {
    await goToStep4();
    expect(screen.getByText("$50.00")).toBeInTheDocument();
  });

  it('renders "July 18, 2026" in summary', async () => {
    await goToStep4();
    expect(screen.getByText(/July 18, 2026/)).toBeInTheDocument();
  });

  it("Stripe card element container renders after selecting card payment", async () => {
    await goToStep4();
    const user = userEvent.setup();

    const cardButton = screen.getByTestId("payment-method-card");
    await user.click(cardButton);

    await waitFor(() => {
      expect(screen.getByTestId("stripe-card-element")).toBeInTheDocument();
    });
  });

  it('success screen renders "YOU\'RE REGISTERED!" after mock successful payment', async () => {
    await goToStep4();
    const user = userEvent.setup();

    const cardButton = screen.getByTestId("payment-method-card");
    await user.click(cardButton);

    await waitFor(() => {
      expect(screen.getByTestId("stripe-card-element")).toBeInTheDocument();
    });

    const payButton = screen.getByRole("button", { name: /pay \$50/i });
    await user.click(payButton);

    await waitFor(() => {
      expect(screen.getByText("YOU'RE REGISTERED!")).toBeInTheDocument();
    });
  });

  it("renders payment method options (card and cash)", async () => {
    await goToStep4();
    expect(screen.getByTestId("payment-method-card")).toBeInTheDocument();
    expect(screen.getByTestId("payment-method-cash")).toBeInTheDocument();
  });

  it("cash payment option shows complete registration button", async () => {
    await goToStep4();
    const user = userEvent.setup();

    const cashButton = screen.getByTestId("payment-method-cash");
    await user.click(cashButton);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /complete registration/i })).toBeInTheDocument();
    });
  });
});

describe("RegistrationProgress", () => {
  it("renders 4 steps", () => {
    render(<RegisterPage />);
    const progressSteps = screen.getAllByText(/ATHLETE|PARENT|WAIVER|PAYMENT/);
    expect(progressSteps.length).toBeGreaterThanOrEqual(4);
  });

  it("active step has correct styling indicator", () => {
    render(<RegisterPage />);
    const progressBar = document.querySelector('[class*="sticky"]');
    const athleteInProgress = progressBar?.querySelector('[class*="text-white"]');
    expect(athleteInProgress).toBeInTheDocument();
  });
});
