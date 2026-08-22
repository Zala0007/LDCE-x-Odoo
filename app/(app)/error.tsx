"use client";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function AppError({ reset }: { error: Error; reset: () => void }) { return <div className="error-state"><AlertTriangle size={32} /><h2>We lost the trail.</h2><p>Something unexpected happened while loading this page.</p><Button onClick={reset}>Try again</Button></div>; }
