"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, CalendarClock, HardDrive, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

import logo from "@/assets/historimedlogo.png";

const navItems = [
  { href: "/home", icon: Home, label: "Inicio" },
  { href: "/timeline", icon: CalendarClock, label: "Linha do Tempo" },
  { href: "/drive", icon: HardDrive, label: "Arquivos" },
  { href: "/settings", icon: Settings, label: "Configurações" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r bg-card z-50">
      <div className="flex h-20 items-center justify-center border-b px-6">
        <Link
          href="/home"
          className="flex items-center gap-2 font-headline text-xl font-semibold"
        >
          <Image
            src={logo}
            alt="HistoriMed Logo"
            width={28}
            height={28}
            className="object-contain"
          />
          <span>HistoriMed</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
            >
              <item.icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </Button>
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t p-4">
        <p className="text-center text-xs text-muted-foreground">
          ©️ 2025 HistoriMed
        </p>
      </div>
    </aside>
  );
}
