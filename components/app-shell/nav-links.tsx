"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Compass, LayoutDashboard, Map, MessageCircle, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/trips", label: "My Trips", icon: Map },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/community", label: "Community", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="top-nav" aria-label="Application navigation">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href === "/trips" && pathname.startsWith("/trips"));
        return <Link key={href} href={href} className={cn("nav-link", active && "nav-link-active")} aria-current={active ? "page" : undefined}><Icon size={17} /><span>{label}</span></Link>;
      })}
    </nav>
  );
}
