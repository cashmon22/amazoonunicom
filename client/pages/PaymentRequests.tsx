import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CircleAlert, LoaderCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { listPaymentRequests } from "@/lib/payment-requests";
import { AuthenticatedShell } from "@/pages/PaymentRequest";
import type { PaymentRequest } from "@shared/payment-requests";

function formatAmount(request: PaymentRequest) {
  if (request.deviceAmount === null) return "Price available on request";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: request.currency, maximumFractionDigits: 0 }).format(request.deviceAmount);
}

export default function PaymentRequests() {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const displayName = session?.user.user_metadata?.full_name || session?.user.email?.split("@")[0] || "Contributor";
  const initials = displayName.split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "CN";

  useEffect(() => {
    listPaymentRequests().then(setRequests).catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load your requests.")).finally(() => setIsLoading(false));
  }, []);

  const handleLogout = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
      navigate("/login", { replace: true });
    } finally {
      setIsSigningOut(false);
    }
  };

  return <AuthenticatedShell onLogout={handleLogout} displayName={displayName} initials={initials} isSigningOut={isSigningOut} mobileNavOpen={mobileNavOpen} onOpenMenu={() => setMobileNavOpen(true)}><div className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12"><Link to="/trusted-vendor" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-orange"><ArrowLeft size={14} /> Back to Work Devices</Link><div className="mt-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange">Contributor requests</p><h1 className="mt-2 text-[34px] font-extrabold tracking-[-0.045em] text-navy sm:text-[44px]">My Payment Requests</h1><p className="mt-3 text-sm leading-6 text-slate-500">Review the payment requests associated with your authenticated contributor account.</p></div><ShieldCheck className="hidden text-orange sm:block" size={28} /></div>{isLoading ? <div className="mt-8 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-sm font-semibold text-navy shadow-card" role="status"><LoaderCircle size={18} className="animate-spin text-orange" /> Loading your requests...</div> : error ? <div className="mt-8 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-xs leading-5 text-red-800" role="alert"><CircleAlert size={15} className="mt-0.5 shrink-0" />{error}</div> : requests.length === 0 ? <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center shadow-card"><p className="text-sm font-extrabold text-navy">No payment requests yet</p><p className="mt-2 text-xs text-slate-500">Select a supported work device to submit your first request.</p><Link to="/trusted-vendor" className="mt-5 inline-flex rounded-md bg-orange px-4 py-2.5 text-xs font-extrabold text-navy">Browse Work Devices</Link></div> : <div className="mt-8 space-y-4">{requests.map((request) => <article key={request.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card sm:p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-[10px] font-semibold text-slate-400">Request ID</p><p className="mt-1 break-all text-xs font-bold text-navy">{request.id}</p><h2 className="mt-4 text-base font-extrabold text-navy">{request.deviceName}</h2><p className="mt-1 text-xs text-slate-500">{request.deviceModel}</p></div><span className="inline-flex w-fit rounded-full border border-orange/30 bg-orange/10 px-3 py-1.5 text-[10px] font-extrabold text-orange">{request.status}</span></div><div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 text-xs sm:grid-cols-4"><div><p className="text-[10px] text-slate-400">Amount</p><p className="mt-1 font-bold text-navy">{formatAmount(request)}</p></div><div><p className="text-[10px] text-slate-400">Vendor</p><p className="mt-1 font-bold text-navy">{request.vendor}</p></div><div><p className="text-[10px] text-slate-400">Submitted</p><p className="mt-1 font-bold text-navy">{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(request.createdAt))}</p></div><div><p className="text-[10px] text-slate-400">Email</p><p className="mt-1 truncate font-bold text-navy">{request.email}</p></div></div></article>)}</div>}</div></AuthenticatedShell>;
}
