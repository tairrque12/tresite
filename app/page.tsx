import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main className="flex items-center justify-center min-h-[calc(100vh-56px)] text-white">
        <p className="text-gray-400">Slice 1: Navbar only — more coming soon</p>
      </main>
    </div>
  );
}
