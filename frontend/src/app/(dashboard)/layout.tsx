import Sidebar from "@/components/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}