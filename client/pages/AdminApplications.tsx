import { useEffect, useState, type FormEvent } from "react";
import { ClipboardList, Search, ShieldCheck, X } from "lucide-react";
import type { AdminApplication, AdminApplicationStatus } from "@shared/admin-applications";
import { getAdminApplicationDetails, listAdminApplications, updateAdminApplicationStatus } from "@/lib/admin-applications";

const statuses: Array<AdminApplicationStatus | ""> = ["", "Under Review", "Approved", "Rejected"];

function formatDate(value: string) {
  if (!value) return "Unknown";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function displayValue(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  return typeof value === "string" ? value : String(value ?? "—");
}

export default function AdminApplications() {
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [status, setStatus] = useState<AdminApplicationStatus | "">("");
  const [selectedApplication, setSelectedApplication] = useState<AdminApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  const loadApplications = async (query: string, filter: AdminApplicationStatus | "") => {
    setIsLoading(true);
    setError("");
    try {
      const response = await listAdminApplications(query, filter);
      setApplications(response.applications);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load applications.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void loadApplications("", ""); }, []);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedSearch(search.trim());
    void loadApplications(search.trim(), status);
  };

  const handleFilter = (value: AdminApplicationStatus | "") => {
    setStatus(value);
    void loadApplications(submittedSearch, value);
  };

  const selectApplication = async (application: AdminApplication) => {
    setSelectedApplication(application);
    try {
      setSelectedApplication(await getAdminApplicationDetails(application.id));
    } catch {
      setSelectedApplication(application);
    }
  };

  const handleStatusChange = async (value: AdminApplicationStatus) => {
    if (!selectedApplication || isUpdating || value === selectedApplication.status) return;
    setIsUpdating(true);
    setError("");
    try {
      await updateAdminApplicationStatus(selectedApplication.id, value);
      const updated = { ...selectedApplication, status: value };
      setSelectedApplication(updated);
      setApplications((current) => current.map((application) => application.id === updated.id ? updated : application));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update application status.");
    } finally {
      setIsUpdating(false);
    }
  };

  return <>
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange">Onboarding</p><h2 className="mt-2 text-[32px] font-extrabold tracking-[-0.04em] text-navy sm:text-[40px]">Applications</h2><p className="mt-3 max-w-[580px] text-sm leading-6 text-slate-500">Review contributor applications, inspect submitted details, and manage review status.</p></div><div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><ShieldCheck size={16} className="text-orange" /> Protected administrator data</div></div>
    <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_3px_16px_rgba(20,36,52,0.04)] sm:p-5"><form className="grid gap-3 md:grid-cols-[1fr_200px_auto]" onSubmit={handleSearch}><label className="relative"><span className="sr-only">Search applications</span><Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by applicant name or email" className="h-11 w-full rounded-lg border border-slate-200 bg-[#fbfcfd] pl-10 pr-3 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-orange focus:ring-2 focus:ring-orange/10" /></label><label className="relative"><span className="sr-only">Filter by status</span><select value={status} onChange={(event) => handleFilter(event.target.value as AdminApplicationStatus | "")} className="h-11 w-full rounded-lg border border-slate-200 bg-[#fbfcfd] px-3 text-sm font-semibold text-navy outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/10"><option value="">All statuses</option>{statuses.slice(1).map((option) => <option key={option} value={option}>{option}</option>)}</select></label><button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-navy px-5 text-xs font-extrabold text-white transition hover:bg-navy/90"><Search size={15} /> Search</button></form></div>
    {error && <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">{error}</div>}
    <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_3px_16px_rgba(20,36,52,0.04)]"><div className="flex flex-col justify-between gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:px-6"><div><h3 className="text-sm font-extrabold text-navy">Application queue</h3><p className="mt-1 text-xs text-slate-500">{isLoading ? "Loading applications..." : `${applications.length} application${applications.length === 1 ? "" : "s"}${submittedSearch ? ` matching “${submittedSearch}”` : ""}`}</p></div><span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Formspree submissions</span></div>{isLoading ? <div className="px-5 py-14 text-center text-sm text-slate-500">Loading submitted applications...</div> : applications.length === 0 ? <div className="px-5 py-14 text-center"><ClipboardList size={23} className="mx-auto text-slate-300" /><p className="mt-3 text-sm font-bold text-navy">No applications found</p><p className="mt-1 text-xs text-slate-500">Try changing your search or status filter.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left"><thead className="bg-[#fbfcfd] text-[10px] font-bold uppercase tracking-wide text-slate-400"><tr><th className="px-6 py-3">Applicant</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Phone</th><th className="px-6 py-3">Applied</th><th className="px-6 py-3">Status</th><th className="px-6 py-3"><span className="sr-only">Actions</span></th></tr></thead><tbody className="divide-y divide-slate-100">{applications.map((application) => <tr key={application.id} className="transition hover:bg-[#fbfcfd]"><td className="px-6 py-4"><button type="button" onClick={() => void selectApplication(application)} className="text-left text-sm font-bold text-navy transition hover:text-orange">{application.applicantName}</button></td><td className="px-6 py-4 text-sm text-slate-600">{application.email}</td><td className="px-6 py-4 text-sm text-slate-600">{application.phone || "—"}</td><td className="px-6 py-4 text-xs text-slate-500">{formatDate(application.applicationDate)}</td><td className="px-6 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${application.status === "Approved" ? "bg-emerald-50 text-emerald-700" : application.status === "Rejected" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{application.status}</span></td><td className="px-6 py-4 text-right"><button type="button" onClick={() => void selectApplication(application)} className="text-xs font-bold text-navy transition hover:text-orange">Open</button></td></tr>)}</tbody></table></div>}</div>
    {selectedApplication && <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/45 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Application details" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedApplication(null); }}><section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-xl bg-white p-6 shadow-2xl sm:rounded-xl sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange">Submitted application</p><h3 className="mt-2 text-xl font-extrabold text-navy">{selectedApplication.applicantName}</h3><p className="mt-1 text-xs text-slate-500">Applied {formatDate(selectedApplication.applicationDate)}</p></div><button type="button" onClick={() => setSelectedApplication(null)} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-navy" aria-label="Close application details"><X size={18} /></button></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{Object.entries(selectedApplication.details).map(([key, value]) => <div key={key} className="rounded-lg border border-slate-200 bg-[#fbfcfd] p-4"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{key.replace(/([A-Z])/g, " $1")}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-5 text-navy">{displayValue(value)}</p></div>)}</div><div className="mt-5 flex flex-col justify-between gap-3 rounded-lg border border-orange/20 bg-orange/[0.05] p-4 sm:flex-row sm:items-center"><div><p className="text-xs font-extrabold text-navy">Application status</p><p className="mt-1 text-xs text-slate-500">Update the administrator review status.</p></div><select value={selectedApplication.status} disabled={isUpdating} onChange={(event) => void handleStatusChange(event.target.value as AdminApplicationStatus)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-navy outline-none focus:border-orange"><option>Under Review</option><option>Approved</option><option>Rejected</option></select></div><p className="mt-4 text-xs leading-5 text-slate-500">Only submitted application fields are shown. Passwords, tokens, and secret credentials are never exposed.</p></section></div>}
  </>;
}
