import Link from "next/link";
import { ArrowRight, CalendarDays, Compass, MapPinned, WalletCards } from "lucide-react";

export default function HomePage() {
  return (
    <main className="landing">
      <nav className="landing-nav" aria-label="Main navigation">
        <Link className="brand" href="/"><span className="brand-mark"><Compass size={21} /></span>GlobeTrotter</Link>
        <div className="landing-actions"><Link className="text-link" href="/login">Log in</Link><Link className="button button-primary" href="/signup">Start planning <ArrowRight size={17} /></Link></div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Your world, beautifully planned</p>
          <h1>Go further.<br /><em>Plan smarter.</em></h1>
          <p className="hero-lead">Shape multi-city adventures, balance every budget, and keep the whole journey in one inspiring place.</p>
          <div className="hero-actions"><Link className="button button-primary button-large" href="/signup">Plan your first trip <ArrowRight size={18} /></Link><Link className="button button-ghost button-large" href="/login">I have an account</Link></div>
          <div className="trust-row"><span>Simple by design</span><span>Built for every screen</span><span>Your plans stay yours</span></div>
        </div>
        <div className="hero-visual" aria-label="Travel inspiration collage">
          <div className="hero-image hero-image-main"><div className="place-label"><span>Next stop</span><strong>Udaipur, India</strong></div></div>
          <div className="postcard postcard-top"><span className="postcard-icon"><MapPinned size={18} /></span><p>Three cities</p><strong>One seamless story</strong></div>
          <div className="postcard postcard-bottom"><span className="postcard-icon sun"><WalletCards size={18} /></span><p>Budget clarity</p><strong>Spend on what matters</strong></div>
          <span className="route-line" aria-hidden />
        </div>
      </section>

      <section className="feature-strip" aria-label="Product highlights">
        <article><MapPinned /><div><strong>Map every stop</strong><span>Build flexible multi-city routes.</span></div></article>
        <article><CalendarDays /><div><strong>See every day</strong><span>Keep plans and activities in rhythm.</span></div></article>
        <article><WalletCards /><div><strong>Know your budget</strong><span>Understand the cost before you go.</span></div></article>
      </section>
    </main>
  );
}
