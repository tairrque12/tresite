import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock next-auth/react
const mockSignIn = vi.fn();
const mockSignOut = vi.fn();
const mockUseSession = vi.fn();

vi.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
  useSession: () => mockUseSession(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

import AdminLoginPage from "../login/page";
import AdminDashboardPage from "../dashboard/page";

describe("Admin Login Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
  });

  it("renders email and password inputs", () => {
    render(<AdminLoginPage />);

    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
  });

  it("renders sign in button", () => {
    render(<AdminLoginPage />);

    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows error on invalid credentials", async () => {
    mockSignIn.mockResolvedValue({ error: "Invalid credentials" });

    render(<AdminLoginPage />);

    await userEvent.type(screen.getByTestId("email-input"), "wrong@email.com");
    await userEvent.type(screen.getByTestId("password-input"), "wrongpassword");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent("Invalid credentials");
    });
  });

  it("redirects to /admin/dashboard on valid credentials", async () => {
    mockSignIn.mockResolvedValue({ error: null });

    render(<AdminLoginPage />);

    await userEvent.type(screen.getByTestId("email-input"), "admin@test.com");
    await userEvent.type(screen.getByTestId("password-input"), "password");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/admin/dashboard");
    });
  });
});

describe("Admin Dashboard Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSession.mockReturnValue({
      data: { user: { email: "admin@test.com" } },
      status: "authenticated",
    });
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ registrations: [], sponsors: [], bookings: [] }),
    });
  });

  it("redirects to login if no session", async () => {
    mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<AdminDashboardPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/admin/login");
    });
  });

  it("renders four stat cards", async () => {
    render(<AdminDashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId("stat-cards")).toBeInTheDocument();
    });

    expect(screen.getByText("Total Registrations")).toBeInTheDocument();
    expect(screen.getByText("Paid Registrations")).toBeInTheDocument();
    expect(screen.getByText("Total Sponsors")).toBeInTheDocument();
    expect(screen.getByText("Consultation Requests")).toBeInTheDocument();
  });

  it("renders three tabs: REGISTRATIONS, SPONSORS, CONSULTATIONS", async () => {
    render(<AdminDashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId("tab-navigation")).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "REGISTRATIONS" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "SPONSORS" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "CONSULTATIONS" })).toBeInTheDocument();
  });

  it("registrations table renders with correct columns", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        registrations: [
          {
            id: "1",
            created_at: "2024-01-01",
            first_name: "John",
            last_name: "Doe",
            position: "QB",
            grade: "10th",
            parent_first_name: "Jane",
            parent_last_name: "Doe",
            phone_number: "555-1234",
            email: "jane@test.com",
            tshirt_size: "M",
            payment_status: "paid",
          },
        ],
        sponsors: [],
        bookings: [],
      }),
    });

    render(<AdminDashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId("registrations-table")).toBeInTheDocument();
    });

    expect(screen.getByText("DATE")).toBeInTheDocument();
    expect(screen.getByText("ATHLETE NAME")).toBeInTheDocument();
    expect(screen.getByText("POSITION")).toBeInTheDocument();
    expect(screen.getByText("PARENT NAME")).toBeInTheDocument();
    expect(screen.getByText("PARENT EMAIL")).toBeInTheDocument();
    expect(screen.getByText("PAYMENT")).toBeInTheDocument();
  });

  it("sponsors table renders with correct columns", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        registrations: [],
        sponsors: [
          {
            id: "1",
            created_at: "2024-01-01",
            business_name: "Test Business",
            contact_email: "test@business.com",
            tier: "gold",
            amount: 150,
            payment_method: "card",
            payment_status: "paid",
          },
        ],
        bookings: [],
      }),
    });

    render(<AdminDashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId("tab-navigation")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "SPONSORS" }));

    await waitFor(() => {
      expect(screen.getByTestId("sponsors-table")).toBeInTheDocument();
    });

    expect(screen.getByText("BUSINESS NAME")).toBeInTheDocument();
    expect(screen.getByText("CONTACT EMAIL")).toBeInTheDocument();
    expect(screen.getByText("TIER")).toBeInTheDocument();
    expect(screen.getByText("AMOUNT")).toBeInTheDocument();
  });

  it("consultations table renders with correct columns", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        registrations: [],
        sponsors: [],
        bookings: [
          {
            id: "1",
            created_at: "2024-01-01",
            first_name: "John",
            last_name: "Doe",
            booking_type: "individual",
            session_format: "in-person",
            preferred_date: "2024-02-01",
            age_range: "14-16",
            positions: ["QB"],
            phone_number: "555-1234",
            email: "john@test.com",
            status: "new",
          },
        ],
      }),
    });

    render(<AdminDashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId("tab-navigation")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "CONSULTATIONS" }));

    await waitFor(() => {
      expect(screen.getByTestId("consultations-table")).toBeInTheDocument();
    });

    expect(screen.getByText("NAME")).toBeInTheDocument();
    expect(screen.getByText("BOOKING TYPE")).toBeInTheDocument();
    expect(screen.getByText("SESSION FORMAT")).toBeInTheDocument();
    expect(screen.getByText("PREFERRED DATE")).toBeInTheDocument();
  });

  it("search input renders on each tab", async () => {
    render(<AdminDashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId("search-input")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "SPONSORS" }));
    expect(screen.getByTestId("search-input")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "CONSULTATIONS" }));
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
  });

  it("export CSV button renders on registrations tab", async () => {
    render(<AdminDashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId("export-csv-button")).toBeInTheDocument();
    });
  });

  it("sign out button renders", async () => {
    render(<AdminDashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId("sign-out-button")).toBeInTheDocument();
    });
  });

  it("slide-over panel renders on View details click", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        registrations: [
          {
            id: "1",
            created_at: "2024-01-01",
            first_name: "John",
            last_name: "Doe",
            date_of_birth: "2010-01-01",
            position: "QB",
            school_name: "Test High",
            grade: "10th",
            city: "Lanett",
            state: "AL",
            tshirt_size: "M",
            parent_first_name: "Jane",
            parent_last_name: "Doe",
            relationship: "Mother",
            phone_number: "555-1234",
            email: "jane@test.com",
            emergency_contact_name: "Bob",
            emergency_contact_phone: "555-5678",
            sms_consent: true,
            waiver_accepted: true,
            waiver_signature: "Jane Doe",
            waiver_signed_at: "2024-01-01T12:00:00Z",
            payment_method: "card",
            payment_status: "paid",
          },
        ],
        sponsors: [],
        bookings: [],
      }),
    });

    render(<AdminDashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId("view-details-button")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("view-details-button"));

    await waitFor(() => {
      expect(screen.getByTestId("slide-over-panel")).toBeInTheDocument();
    });
  });

  it("status dropdown renders on consultations tab", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        registrations: [],
        sponsors: [],
        bookings: [
          {
            id: "1",
            created_at: "2024-01-01",
            first_name: "John",
            last_name: "Doe",
            booking_type: "individual",
            session_format: "in-person",
            preferred_date: "2024-02-01",
            age_range: "14-16",
            positions: ["QB"],
            phone_number: "555-1234",
            email: "john@test.com",
            status: "new",
          },
        ],
      }),
    });

    render(<AdminDashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId("tab-navigation")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "CONSULTATIONS" }));

    await waitFor(() => {
      expect(screen.getByTestId("status-dropdown")).toBeInTheDocument();
    });
  });
});
