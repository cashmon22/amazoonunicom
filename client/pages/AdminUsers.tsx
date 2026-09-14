import { useEffect, useState } from "react";
import { Search, ShieldCheck, UserRound, X } from "lucide-react";
import type { AdminUser, AdminUserStatus } from "@shared/admin-users";
import { getAdminUserDetails, listAdminUsers, updateAdminUserStatus } from "@/lib/admin-users";

function formatDate(value: string | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  const loadUsers = async (query: string) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await listAdminUsers(query);
      setUsers(response.users);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load users.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers("");
  }, []);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedSearch(search.trim());
    void loadUsers(search.trim());
  };

  const handleSelectUser = async (user: AdminUser) => {
    setSelectedUser(user);
    try {
      const details = await getAdminUserDetails(user.id);
      setSelectedUser(details);
    } catch {
      setSelectedUser(user);
    }
  };

  const handleStatusChange = async (status: AdminUserStatus) => {
    if (!selectedUser || isUpdating || status === selectedUser.status) return;
    setIsUpdating(true);
    setError("");
    try {
      const updatedUser = await updateAdminUserStatus(selectedUser.id, status);
      setSelectedUser(updatedUser);
      setUsers((current) => current.map((user) => user.id === updatedUser.id ? updatedUser : user));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update account status.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange">People</p>
          <h2 className="mt-2 text-[32px] font-extrabold tracking-[-0.04em] text-navy sm:text-[40px]">Users</h2>
          <p className="mt-3 max-w-[580px] text-sm leading-6 text-slate-500">View contributor accounts and manage basic account status from the administrator workspace.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><ShieldCheck size={16} className="text-orange" /> Protected administrator data</div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_3px_16px_rgba(20,36,52,0.04)] sm:p-5">
        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSearch}>
          <label className="relative flex-1"><span className="sr-only">Search users</span><Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or email" className="h-11 w-full rounded-lg border border-slate-200 bg-[#fbfcfd] pl-10 pr-3 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-orange focus:ring-2 focus:ring-orange/10" /></label>
          <button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-navy px-5 text-xs font-extrabold text-white transition hover:bg-navy/90"><Search size={15} /> Search users</button>
        </form>
      </div>

      {error && <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">{error}</div>}

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_3px_16px_rgba(20,36,52,0.04)]">
        <div className="flex flex-col justify-between gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:px-6"><div><h3 className="text-sm font-extrabold text-navy">User directory</h3><p className="mt-1 text-xs text-slate-500">{isLoading ? "Loading users..." : `${users.length} user${users.length === 1 ? "" : "s"}${submittedSearch ? ` matching “${submittedSearch}”` : ""}`}</p></div><span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Credentials never shown</span></div>
        {isLoading ? <div className="px-5 py-14 text-center text-sm text-slate-500">Loading user accounts...</div> : users.length === 0 ? <div className="px-5 py-14 text-center"><UserRound size={23} className="mx-auto text-slate-300" /><p className="mt-3 text-sm font-bold text-navy">No users found</p><p className="mt-1 text-xs text-slate-500">Try a different name or email search.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead className="bg-[#fbfcfd] text-[10px] font-bold uppercase tracking-wide text-slate-400"><tr><th className="px-6 py-3">User</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Created</th><th className="px-6 py-3">Status</th><th className="px-6 py-3"><span className="sr-only">Actions</span></th></tr></thead><tbody className="divide-y divide-slate-100">{users.map((user) => <tr key={user.id} className="transition hover:bg-[#fbfcfd]"><td className="px-6 py-4"><button type="button" onClick={() => void handleSelectUser(user)} className="flex items-center gap-3 text-left"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange/10 text-xs font-extrabold text-orange">{user.name.slice(0, 1).toUpperCase()}</span><span className="text-sm font-bold text-navy hover:text-orange">{user.name}</span></button></td><td className="px-6 py-4 text-sm text-slate-600">{user.email}</td><td className="px-6 py-4 text-xs text-slate-500">{formatDate(user.createdAt)}</td><td className="px-6 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${user.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{user.status}</span></td><td className="px-6 py-4 text-right"><button type="button" onClick={() => void handleSelectUser(user)} className="text-xs font-bold text-navy transition hover:text-orange">View details</button></td></tr>)}</tbody></table></div>}
      </div>

      {selectedUser && <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/45 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="User details" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedUser(null); }}><section className="w-full max-w-lg rounded-t-xl bg-white p-6 shadow-2xl sm:rounded-xl sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange">Account details</p><h3 className="mt-2 text-xl font-extrabold text-navy">{selectedUser.name}</h3></div><button type="button" onClick={() => setSelectedUser(null)} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-navy" aria-label="Close user details"><X size={18} /></button></div><dl className="mt-6 divide-y divide-slate-100 rounded-lg border border-slate-200"><div className="flex justify-between gap-5 px-4 py-3 text-sm"><dt className="text-slate-500">Email</dt><dd className="text-right font-semibold text-navy">{selectedUser.email}</dd></div><div className="flex justify-between gap-5 px-4 py-3 text-sm"><dt className="text-slate-500">Account created</dt><dd className="font-semibold text-navy">{formatDate(selectedUser.createdAt)}</dd></div><div className="flex justify-between gap-5 px-4 py-3 text-sm"><dt className="text-slate-500">Last sign in</dt><dd className="font-semibold text-navy">{formatDate(selectedUser.lastSignInAt)}</dd></div><div className="flex items-center justify-between gap-5 px-4 py-3 text-sm"><dt className="text-slate-500">Account status</dt><dd><select value={selectedUser.status} disabled={isUpdating} onChange={(event) => void handleStatusChange(event.target.value as AdminUserStatus)} className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-navy outline-none focus:border-orange"><option>Active</option><option>Suspended</option></select></dd></div></dl><p className="mt-4 text-xs leading-5 text-slate-500">Only account status can be changed here. Passwords, tokens, and secret credentials are never displayed.</p></section></div>}
    </>
  );
}
