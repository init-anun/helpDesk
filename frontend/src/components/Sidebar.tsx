"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "▦",
  },
  {
    name: "Patients",
    href: "/patients",
    icon: "♙",
  },
  {
    name: "Schedule",
    href: "/schedule",
    icon: "▣",
  },
  {
    name: "Billing",
    href: "/billing",
    icon: "$",
  },
  {
    name: "Therapists",
    href: "/therapists",
    icon: "♧",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-slate-900 text-white">
      <div className="flex h-full flex-col">

        {/* Logo */}
        <div className="flex h-20 items-center border-b border-slate-700 px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 font-bold">
              H
            </div>

            <div>
              <h1 className="text-lg font-bold">
                HelpDesk
              </h1>

              <p className="text-xs text-slate-400">
                Management System
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main Menu
          </p>

          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center">
                    {item.icon}
                  </span>

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-700 p-4">
          <div className="rounded-lg bg-slate-800 px-3 py-3">
            <p className="text-sm font-medium">
              HelpDesk
            </p>

            <p className="mt-1 text-xs text-slate-400">
              v1.0.0
            </p>
          </div>
        </div>

      </div>
    </aside>
  );
}