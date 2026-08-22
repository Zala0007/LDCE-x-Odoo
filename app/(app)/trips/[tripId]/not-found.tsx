import Link from "next/link";
import { MapPinOff } from "lucide-react";
export default function TripNotFound() { return <div className="error-state"><MapPinOff size={34} /><h2>Trip not found</h2><p>It may have been removed, or it belongs to another traveler.</p><Link className="button button-primary" href="/trips">Return to My Trips</Link></div>; }
