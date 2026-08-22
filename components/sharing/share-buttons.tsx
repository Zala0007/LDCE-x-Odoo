"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
  async function share() { if (navigator.share) await navigator.share({ title, url: window.location.href }); else await copy(); }
  return <div className="public-share-buttons"><button className="button button-secondary" onClick={copy}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Copied" : "Copy link"}</button><button className="button button-primary" onClick={share}><Share2 size={16} />Share</button></div>;
}
