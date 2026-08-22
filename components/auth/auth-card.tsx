import Link from "next/link";
import { Compass } from "lucide-react";

export function AuthCard({ eyebrow, title, description, children, footer }: { eyebrow: string; title: string; description: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <main className="auth-page">
      <section className="auth-story" aria-label="GlobeTrotter introduction">
        <Link className="brand brand-light" href="/"><span className="brand-mark"><Compass size={21} /></span>GlobeTrotter</Link>
        <div className="auth-story-copy">
          <p className="eyebrow eyebrow-light">Travel, thoughtfully</p>
          <h2>Build journeys worth remembering.</h2>
          <p>One calm place for every city, every plan, and every possibility.</p>
        </div>
        <p className="auth-quote">“The world is full of places waiting to become your story.”</p>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="muted">{description}</p>
          {children}
          {footer ? <div className="auth-footer">{footer}</div> : null}
        </div>
      </section>
    </main>
  );
}
