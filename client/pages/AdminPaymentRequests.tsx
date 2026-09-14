import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CircleAlert, LoaderCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { listPaymentRequests, updatePaymentRequestStatus } from "@/lib/payment-requests";
import { AuthenticatedShell } from "@/pages/PaymentRequest";
import type { PaymentRequest, PaymentRequestStatus } from "@shared/payment-requests";

const statuses: PaymentRequestStatus[] = ["Pending Review", "Approved", "Rejected", "Completed"];

function formatAmount(request: PaymentRequest) {
  if (request.deviceAmount === null) return "Price available on request";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: request.currency, maximumFractionDigits: 0 }).format(request.deviceAmount);
}

export default function AdminPaymentRequests() {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const displayName = session?.user.user_metadata?.full_name || session?.user.email?.split("@")[0] || "Contributor";
  const initials = displayName.split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "CN";
  const isAdmin = session?.user.app_metadata?.role === "admin";

  const loadRequests = () => {
    setIsLoading(true);
    listPaymentRequests().then(setRequests).catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load payment requests.")).finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isAdmin) loadRequests();
    else setIsLoading(false);
  }, [isAdmin]);

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

  const handleStatusChange = async (id: string, status: PaymentRequestStatus) => {
    try {
      await updatePaymentRequestStatus(id, status);
      setRequests((current) => current.map((request) => request.id === id ? { ...request, status } : request));
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Unable to update request status.");
    }
  };

  return <AuthenticatedShell onLogout={handleLogout} displayName={displayName} initials={initials} isSigningOut={isSigningOut} mobileNavOpen={mobileNavOpen} onOpenMenu={() => setMobileNavOpen(true)}><div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12"><Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-orange"><ArrowLeft size={14} /> Back to Dashboard</Link><div className="mt-7 flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange">Administrator workspace</p><h1 className="mt-2 text-[34px] font-extrabold tracking-[-0.045em] text-navy sm:text-[44px]">Payment Requests</h1><p className="mt-3 text-sm leading-6 text-slate-500">Review submitted device payment requests and manage their controlled status.</p></div><ShieldCheck className="hidden text-orange sm:block" size={28} /></div>{!isAdmin ? <div className="mt-8 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-xs leading-5 text-red-800" role="alert"><CircleAlert size={15} className="mt-0.5 shrink-0" />Administrator access is required to review payment requests.</div> : isLoading ? <div className="mt-8 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-sm font-semibold text-navy shadow-card" role="status"><LoaderCircle size={18} className="animate-spin text-orange" /> Loading submitted requests...</div> : error ? <div className="mt-8 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-xs leading-5 text-red-800" role="alert"><CircleAlert size={15} className="mt-0.5 shrink-0" />{error}</div> : <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-card"><table className="w-full min-w-[1120px] text-left text-xs"><thead className="border-b border-slate-100 bg-[#fbfcfd] text-[10px] font-bold uppercase tracking-wide text-slate-400"><tr><th className="px-5 py-4">Request ID</th><th className="px-5 py-4">User</th><th className="px-5 py-4">Contact</th><th className="px-5 py-4">Device</th><th className="px-5 py-4">Amount</th><th className="px-5 py-4">Submitted</th><th className="px-5 py-4">Status</th></tr></thead><tbody>{requests.map((request) => <tr key={request.id} className="border-b border-slate-100 last:border-0"><td className="max-w-[180px] break-all px-5 py-4 font-semibold text-navy">{request.id}</td><td className="px-5 py-4"><p className="font-bold text-navy">{request.fullLegalName}</p><p className="mt-1 text-[10px] text-slate-500">{request.userId}</p></td><td className="px-5 py-4 text-slate-500"><p>{request.email}</p><p className="mt-1">{request.phone}</p></td><td className="px-5 py-4"><p className="font-bold text-navy">{request.deviceName}</p><p className="mt-1 text-[10px] text-slate-500">{request.deviceModel}</p></td><td className="px-5 py-4 font-bold text-navy">{formatAmount(request)}</td><td className="whitespace-nowrap px-5 py-4 text-slate-500">{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(request.createdAt))}</td><td className="px-5 py-4"><label className="sr-only" htmlFor={`status-${request.id}`}>Status for {request.id}</label><select id={`status-${request.id}`} value={request.status} onChange={(event) => handleStatusChange(request.id, event.target.value as PaymentRequestStatus)} className="rounded-md border border-slate-200 bg-white px-2 py-2 text-xs font-bold text-navy outline-none focus:border-orange">{statuses.map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table>{requests.length === 0 && <p className="px-5 py-12 text-center text-sm text-slate-500">No payment requests have been submitted.</p>}</div>}</div></AuthenticatedShell>;
}
