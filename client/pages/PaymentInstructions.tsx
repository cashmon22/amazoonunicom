import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { AuthenticatedShell, PaymentInstructions as InstructionsContent } from "@/pages/PaymentRequest";
import type { PaymentRequest } from "@shared/payment-requests";

export default function PaymentInstructions() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, signOut } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const request = (location.state as { request?: PaymentRequest } | null)?.request;
  const displayName = session?.user.user_metadata?.full_name || session?.user.email?.split("@")[0] || "Contributor";
  const initials = displayName.split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "CN";

  const handleLogout = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try { await signOut(); navigate("/login", { replace: true }); } finally { setIsSigningOut(false); }
  };

  return <AuthenticatedShell onLogout={handleLogout} displayName={displayName} initials={initials} isSigningOut={isSigningOut} mobileNavOpen={mobileNavOpen} onOpenMenu={() => setMobileNavOpen(true)}>
    {request ? <InstructionsContent request={request} /> : <div className="mx-auto max-w-[900px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14"><section className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-card sm:p-10"><h1 className="text-2xl font-extrabold text-navy">Payment Request</h1><p className="mt-3 text-sm text-slate-500">Select a work device to start a new payment request.</p><button type="button" onClick={() => navigate("/trusted-vendor", { replace: true })} className="mt-6 rounded-md bg-orange px-5 py-3 text-sm font-extrabold text-navy">Back to Work Devices</button></section></div>}
  </AuthenticatedShell>;
}
