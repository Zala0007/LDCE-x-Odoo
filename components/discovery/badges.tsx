import { IndianRupee, Sparkles } from "lucide-react";

export function BudgetBadge({ costIndex }: { costIndex: number }) {
  const label = costIndex < 40 ? "Budget-friendly" : costIndex < 70 ? "Moderate" : "Premium";
  return <span className="discovery-badge"><IndianRupee size={13} />{label}</span>;
}

export function PopularityBadge({ score }: { score: number }) {
  return <span className="discovery-badge popularity-badge"><Sparkles size={13} />{score}% loved</span>;
}
