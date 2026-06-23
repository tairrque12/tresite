"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import type { Registration, Sponsor, Booking } from "@/lib/supabase";

type Tab = "registrations" | "sponsors" | "consultations";
type DateFilter = "7" | "30" | "all";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("registrations");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [regRes, sponsorRes, bookingRes] = await Promise.all([
        fetch("/api/admin/registrations"),
        fetch("/api/admin/sponsors"),
        fetch("/api/admin/bookings"),
      ]);

      if (regRes.ok) {
        const data = await regRes.json();
        setRegistrations(data.registrations || []);
      }
      if (sponsorRes.ok) {
        const data = await sponsorRes.json();
        setSponsors(data.sponsors || []);
      }
      if (bookingRes.ok) {
        const data = await bookingRes.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
    if (status === "authenticated") {
      fetchData();
    }
  }, [status, router, fetchData]);

  const filterByDate = <T extends { created_at: string }>(items: T[]): T[] => {
    if (dateFilter === "all") return items;
    const now = new Date();
    const days = parseInt(dateFilter);
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return items.filter((item) => new Date(item.created_at) >= cutoff);
  };

  const filterRegistrationsBySearch = (items: Registration[]): Registration[] => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter((item) =>
      [item.first_name, item.last_name, item.email, item.phone_number, item.parent_first_name, item.parent_last_name]
        .some((val) => val?.toLowerCase().includes(query))
    );
  };

  const filterSponsorsBySearch = (items: Sponsor[]): Sponsor[] => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter((item) =>
      [item.business_name, item.contact_email]
        .some((val) => val?.toLowerCase().includes(query))
    );
  };

  const filterBookingsBySearch = (items: Booking[]): Booking[] => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter((item) =>
      [item.first_name, item.last_name, item.email, item.phone_number]
        .some((val) => val?.toLowerCase().includes(query))
    );
  };

  const filteredRegistrations = filterRegistrationsBySearch(filterByDate(registrations));
  const filteredSponsors = filterSponsorsBySearch(filterByDate(sponsors));
  const filteredBookings = filterBookingsBySearch(filterByDate(bookings));

  const updateBookingStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const exportCSV = () => {
    const headers = [
      "Date",
      "Athlete Name",
      "Position",
      "Grade",
      "Parent Name",
      "Parent Phone",
      "Parent Email",
      "T-Shirt Size",
      "Payment Status",
    ];
    const rows = registrations.map((r) => [
      new Date(r.created_at).toLocaleDateString(),
      `${r.first_name} ${r.last_name}`,
      r.position,
      r.grade,
      `${r.parent_first_name} ${r.parent_last_name}`,
      r.phone_number,
      r.email,
      r.tshirt_size,
      r.payment_status,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const paidCount = registrations.filter((r) => r.payment_status === "paid").length;

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400 font-body">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Top Bar */}
      <header className="bg-black border-b border-[#1e6b3a]/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="font-display text-white tracking-widest">ADMIN PORTAL</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm font-body hidden md:block">
            Signed in as {session?.user?.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="text-gray-400 text-sm font-body hover:text-white transition-colors"
            data-testid="sign-out-button"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="p-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-testid="stat-cards">
          <div className="bg-[#111] border border-[#1e6b3a]/30 p-4">
            <p className="font-display text-4xl text-[#2d8a4e]">{registrations.length}</p>
            <p className="font-body text-xs text-gray-400 uppercase tracking-widest">
              Total Registrations
            </p>
          </div>
          <div className="bg-[#111] border border-[#1e6b3a]/30 p-4">
            <p className="font-display text-4xl text-[#2d8a4e]">{paidCount}</p>
            <p className="font-body text-xs text-gray-400 uppercase tracking-widest">
              Paid Registrations
            </p>
          </div>
          <div className="bg-[#111] border border-[#1e6b3a]/30 p-4">
            <p className="font-display text-4xl text-[#2d8a4e]">{sponsors.length}</p>
            <p className="font-body text-xs text-gray-400 uppercase tracking-widest">
              Total Sponsors
            </p>
          </div>
          <div className="bg-[#111] border border-[#1e6b3a]/30 p-4">
            <p className="font-display text-4xl text-[#2d8a4e]">{bookings.length}</p>
            <p className="font-body text-xs text-gray-400 uppercase tracking-widest">
              Consultation Requests
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-8 border-b border-[#1e6b3a]/30 mb-6" data-testid="tab-navigation">
          {(["registrations", "sponsors", "consultations"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-display tracking-widest pb-3 transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-[#1e6b3a] text-white"
                  : "text-gray-600 hover:text-gray-400"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#111] border border-[#1e6b3a]/30 text-white px-4 py-2 w-full md:w-64 font-body focus:border-[#2d8a4e] focus:outline-none"
            data-testid="search-input"
          />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilter)}
            className="bg-[#111] border border-[#1e6b3a]/30 text-white px-4 py-2 font-body focus:border-[#2d8a4e] focus:outline-none"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="all">All time</option>
          </select>
          {activeTab === "registrations" && (
            <button
              onClick={exportCSV}
              className="font-display text-[#2d8a4e] border border-[#1e6b3a]/30 px-4 py-2 hover:bg-[#1e6b3a] hover:text-white transition-colors tracking-widest"
              data-testid="export-csv-button"
            >
              EXPORT CSV →
            </button>
          )}
        </div>

        {/* Tables */}
        <div className="overflow-x-auto">
          {activeTab === "registrations" && (
            <table className="w-full min-w-[800px] bg-black" data-testid="registrations-table">
              <thead>
                <tr className="bg-[#111] text-[#2d8a4e] font-display text-xs tracking-widest">
                  <th className="text-left p-3">DATE</th>
                  <th className="text-left p-3">ATHLETE NAME</th>
                  <th className="text-left p-3">POSITION</th>
                  <th className="text-left p-3">AGE/GRADE</th>
                  <th className="text-left p-3">PARENT NAME</th>
                  <th className="text-left p-3">PARENT PHONE</th>
                  <th className="text-left p-3">PARENT EMAIL</th>
                  <th className="text-left p-3">T-SHIRT</th>
                  <th className="text-left p-3">PAYMENT</th>
                  <th className="text-left p-3">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg) => (
                  <tr
                    key={reg.id}
                    className="border-b border-[#1e6b3a]/10 text-gray-300 text-sm font-body hover:bg-[#111]/50"
                  >
                    <td className="p-3">{new Date(reg.created_at).toLocaleDateString()}</td>
                    <td className="p-3">{reg.first_name} {reg.last_name}</td>
                    <td className="p-3">{reg.position}</td>
                    <td className="p-3">{reg.grade}</td>
                    <td className="p-3">{reg.parent_first_name} {reg.parent_last_name}</td>
                    <td className="p-3">{reg.phone_number}</td>
                    <td className="p-3">{reg.email}</td>
                    <td className="p-3">{reg.tshirt_size}</td>
                    <td className="p-3">
                      <span
                        className={`text-xs px-2 py-1 ${
                          reg.payment_status === "paid"
                            ? "bg-[#1e6b3a]/20 text-[#2d8a4e]"
                            : "bg-yellow-900/20 text-yellow-400"
                        }`}
                      >
                        {reg.payment_status === "paid" ? "PAID" : "CASH"}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setSelectedRegistration(reg)}
                        className="text-[#2d8a4e] hover:text-white text-xs"
                        data-testid="view-details-button"
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "sponsors" && (
            <table className="w-full min-w-[800px] bg-black" data-testid="sponsors-table">
              <thead>
                <tr className="bg-[#111] text-[#2d8a4e] font-display text-xs tracking-widest">
                  <th className="text-left p-3">DATE</th>
                  <th className="text-left p-3">BUSINESS NAME</th>
                  <th className="text-left p-3">CONTACT EMAIL</th>
                  <th className="text-left p-3">TIER</th>
                  <th className="text-left p-3">AMOUNT</th>
                  <th className="text-left p-3">PAYMENT METHOD</th>
                  <th className="text-left p-3">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredSponsors.map((sponsor) => (
                  <tr
                    key={sponsor.id}
                    className="border-b border-[#1e6b3a]/10 text-gray-300 text-sm font-body hover:bg-[#111]/50"
                  >
                    <td className="p-3">{new Date(sponsor.created_at).toLocaleDateString()}</td>
                    <td className="p-3">{sponsor.business_name}</td>
                    <td className="p-3">{sponsor.contact_email}</td>
                    <td className="p-3">
                      <span
                        className={`text-xs px-2 py-1 ${
                          sponsor.tier === "platinum"
                            ? "bg-yellow-900/20 text-yellow-400"
                            : sponsor.tier === "gold"
                            ? "bg-orange-900/20 text-orange-400"
                            : sponsor.tier === "silver"
                            ? "bg-gray-800 text-gray-400"
                            : sponsor.tier === "bronze"
                            ? "bg-orange-950/20 text-orange-700"
                            : "bg-[#1e6b3a]/20 text-[#2d8a4e]"
                        }`}
                      >
                        {sponsor.tier.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">${sponsor.amount}</td>
                    <td className="p-3">{sponsor.payment_method}</td>
                    <td className="p-3">
                      <span
                        className={`text-xs px-2 py-1 ${
                          sponsor.payment_status === "paid"
                            ? "bg-[#1e6b3a]/20 text-[#2d8a4e]"
                            : "bg-yellow-900/20 text-yellow-400"
                        }`}
                      >
                        {sponsor.payment_status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "consultations" && (
            <table className="w-full min-w-[800px] bg-black" data-testid="consultations-table">
              <thead>
                <tr className="bg-[#111] text-[#2d8a4e] font-display text-xs tracking-widest">
                  <th className="text-left p-3">DATE</th>
                  <th className="text-left p-3">NAME</th>
                  <th className="text-left p-3">BOOKING TYPE</th>
                  <th className="text-left p-3">SESSION FORMAT</th>
                  <th className="text-left p-3">PREFERRED DATE</th>
                  <th className="text-left p-3">AGE RANGE</th>
                  <th className="text-left p-3">POSITION</th>
                  <th className="text-left p-3">PHONE</th>
                  <th className="text-left p-3">EMAIL</th>
                  <th className="text-left p-3">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-[#1e6b3a]/10 text-gray-300 text-sm font-body hover:bg-[#111]/50"
                  >
                    <td className="p-3">{new Date(booking.created_at).toLocaleDateString()}</td>
                    <td className="p-3">{booking.first_name} {booking.last_name}</td>
                    <td className="p-3">{booking.booking_type}</td>
                    <td className="p-3">{booking.session_format}</td>
                    <td className="p-3">{booking.preferred_date}</td>
                    <td className="p-3">{booking.age_range}</td>
                    <td className="p-3">{booking.positions?.join(", ") || "-"}</td>
                    <td className="p-3">{booking.phone_number}</td>
                    <td className="p-3">{booking.email}</td>
                    <td className="p-3">
                      <select
                        value={booking.status}
                        onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                        className={`text-xs px-2 py-1 bg-transparent border-0 cursor-pointer ${
                          booking.status === "new"
                            ? "text-red-400"
                            : booking.status === "contacted"
                            ? "text-yellow-400"
                            : "text-[#2d8a4e]"
                        }`}
                        data-testid="status-dropdown"
                      >
                        <option value="new" className="bg-[#111]">
                          {booking.status === "new" ? "New" : "New"}
                        </option>
                        <option value="contacted" className="bg-[#111]">Contacted</option>
                        <option value="booked" className="bg-[#111]">Booked</option>
                      </select>
                      {booking.status === "new" && (
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full ml-1"></span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Slide-over Panel */}
      {selectedRegistration && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          data-testid="slide-over-panel"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedRegistration(null)}
          />
          <div className="relative w-96 bg-[#111] p-6 overflow-y-auto">
            <button
              onClick={() => setSelectedRegistration(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ×
            </button>
            <h2 className="font-display text-xl text-white mb-6">REGISTRATION DETAILS</h2>

            <div className="space-y-4 text-sm font-body">
              <div>
                <p className="text-gray-500 uppercase text-xs tracking-widest">Athlete</p>
                <p className="text-white">{selectedRegistration.first_name} {selectedRegistration.last_name}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-xs tracking-widest">Date of Birth</p>
                <p className="text-white">{selectedRegistration.date_of_birth}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-xs tracking-widest">Position</p>
                <p className="text-white">{selectedRegistration.position}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-xs tracking-widest">School</p>
                <p className="text-white">{selectedRegistration.school_name}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-xs tracking-widest">Grade</p>
                <p className="text-white">{selectedRegistration.grade}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-xs tracking-widest">Location</p>
                <p className="text-white">{selectedRegistration.city}, {selectedRegistration.state}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-xs tracking-widest">T-Shirt Size</p>
                <p className="text-white">{selectedRegistration.tshirt_size}</p>
              </div>

              <hr className="border-[#1e6b3a]/30" />

              <div>
                <p className="text-gray-500 uppercase text-xs tracking-widest">Parent/Guardian</p>
                <p className="text-white">{selectedRegistration.parent_first_name} {selectedRegistration.parent_last_name}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-xs tracking-widest">Relationship</p>
                <p className="text-white">{selectedRegistration.relationship}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-xs tracking-widest">Phone</p>
                <p className="text-white">{selectedRegistration.phone_number}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-xs tracking-widest">Email</p>
                <p className="text-white">{selectedRegistration.email}</p>
              </div>

              <hr className="border-[#1e6b3a]/30" />

              <div>
                <p className="text-gray-500 uppercase text-xs tracking-widest">Emergency Contact</p>
                <p className="text-white">{selectedRegistration.emergency_contact_name}</p>
                <p className="text-gray-400">{selectedRegistration.emergency_contact_phone}</p>
              </div>

              <hr className="border-[#1e6b3a]/30" />

              <div>
                <p className="text-gray-500 uppercase text-xs tracking-widest">SMS Consent</p>
                <p className="text-white">{selectedRegistration.sms_consent ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-xs tracking-widest">Waiver</p>
                <p className="text-white">{selectedRegistration.waiver_accepted ? "Accepted" : "Not accepted"}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-xs tracking-widest">Waiver Signature</p>
                <p className="text-white">{selectedRegistration.waiver_signature}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-xs tracking-widest">Signed At</p>
                <p className="text-white">
                  {selectedRegistration.waiver_signed_at
                    ? new Date(selectedRegistration.waiver_signed_at).toLocaleString()
                    : "-"}
                </p>
              </div>

              <hr className="border-[#1e6b3a]/30" />

              <div>
                <p className="text-gray-500 uppercase text-xs tracking-widest">Payment Method</p>
                <p className="text-white">{selectedRegistration.payment_method}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-xs tracking-widest">Payment Status</p>
                <span
                  className={`text-xs px-2 py-1 ${
                    selectedRegistration.payment_status === "paid"
                      ? "bg-[#1e6b3a]/20 text-[#2d8a4e]"
                      : "bg-yellow-900/20 text-yellow-400"
                  }`}
                >
                  {selectedRegistration.payment_status === "paid" ? "PAID" : "CASH"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
