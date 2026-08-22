import Link from "next/link";
import { Bell, Compass, Plus } from "lucide-react";
import { logoutAction } from "@/app/actions/auth-actions";
import { NavLinks } from "@/components/app-shell/nav-links";
import { initials } from "@/lib/utils";

export function AppShell({ user, children }: { user: { name?: string | null; email?: string | null; image?: string | null; role?: string }; children: React.ReactNode }) {
  return (
    <div className="app-frame">
      <aside className="sidebar">
        <Link className="brand" href="/trips"><span className="brand-mark"><Compass size={21} /></span>GlobeTrotter</Link>
        <NavLinks />
        <div className="sidebar-note"><span className="sidebar-note-icon">✦</span><strong>Travel, thoughtfully.</strong><p>Your world is waiting to be mapped.</p></div>
      </aside>
      <div className="app-main">
        <header className="app-header">
          <Link className="mobile-brand" href="/trips"><Compass size={22} /><strong>GlobeTrotter</strong></Link>
          <div className="app-header-spacer" />
          <Link className="icon-button" href="/trips" aria-label="Notifications"><Bell size={19} /></Link>
          <Link className="button button-primary header-new-trip" href="/trips/new"><Plus size={17} /> Plan a trip</Link>
          <details className="user-menu">
            <summary aria-label="Open user menu"><span className="avatar">{initials(user.name)}</span><span className="user-menu-copy"><strong>{user.name}</strong><small>{user.email}</small></span></summary>
            <div className="user-menu-popover"><Link href="/profile">Profile & settings</Link>{user.role === "ADMIN" ? <Link href="/admin">Admin analytics</Link> : null}<form action={logoutAction}><button type="submit">Log out</button></form></div>
          </details>
        </header>
        <main className="content">{children}</main>
        <NavLinks mobile />
      </div>
    </div>
  );
}
