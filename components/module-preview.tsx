import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export function ModulePreview({ icon: Icon, title, description, owner }: { icon: LucideIcon; title: string; description: string; owner: string }) {
  return <div className="narrow-page"><PageHeader eyebrow={`${owner} module`} title={title} description={description} /><section className="preview-card"><span><Icon size={30} /></span><h2>Foundation ready</h2><p>This route is reserved and wired into the application shell. Its database-backed experience is intentionally scheduled for {owner} so team ownership stays clean.</p><Link className="button button-secondary" href="/trips"><ArrowLeft size={17} /> Back to My Trips</Link></section></div>;
}
