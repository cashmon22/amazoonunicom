import { useEffect, useState, type ReactNode } from "react";
import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  Bell,
  BriefcaseBusiness,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Monitor,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getAdminDashboardStats } from "@/lib/admin-dashboard";

const navigation = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, end: true },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Applications", href: "/admin/applications", icon: BriefcaseBusiness },
  { label: "Device Requests", href: "/admin/device-requests", icon: ClipboardList },
  { label: "Devices", href: "/admin/devices", icon: Monitor },
];

const sectionDetails: Record<string, { eyebrow: string; title: string; description: string }> = {
  users: {
    eyebrow: "People",
    title: "Users",
    description: "Manage contributors and review account activity from one place.",
  },
  applications: {
    eyebrow: "Onboarding",
    title: "Applications",
    description: "Review and organize incoming contributor applications.",
  },
  "device-requests": {
    eyebrow: "Operations",
    title: "Device Requests",
    description: "Keep track of device authorization requests and their status.",
  },
  devices: {
    eyebrow: "Inventory",
    title: "Devices",
    description: "Monitor authorized devices across the contributor network.",
  },
};

function initialsFor(name: string) {
  return name.split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "AD";
}

export default function AdminPanel() {
  const { session, isLoading, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa] text-sm font-semibold text-navy">Checking your secure session...</div>;
  }

  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  const isAdmin = session.user.app_metadata?.role === "admin";
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const displayName = session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Administrator";
  const initials = initialsFor(displayName);

  const handleLogout = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-ink">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col bg-navy text-white transition-transform duration-200 lg:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-6">
          <Link to="/admin" className="flex items-center gap-3" onClick={() => setMobileNavOpen(false)}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange text-navy"><ShieldCheck size={20} strokeWidth={2.4} /></span>
            <span><span className="block text-sm font-extrabold tracking-tight">Admin Portal</span><span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">Contributor program</span></span>
          </Link>
          <button type="button" className="rounded-md p-2 text-white/60 hover:bg-white/10 hover:text-white lg:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation"><X size={19} /></button>
        </div>
        <div className="px-4 py-7">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">Workspace</p>
          <nav className="mt-3 space-y-1" aria-label="Admin navigation">
            {navigation.map(({ label, href, icon: Icon, end }) => (
              <NavLink key={label} to={href} end={end} onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${isActive ? "bg-orange text-navy shadow-[0_6px_18px_rgba(255,153,0,0.18)]" : "text-white/65 hover:bg-white/[0.07] hover:text-white"}`}>
                <Icon size={18} strokeWidth={1.9} /><span>{label}</span><ChevronRight size={15} className="ml-auto opacity-0 transition group-[.bg-orange]:opacity-60" />
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="mt-auto border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-white/[0.06] p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange/15 text-xs font-extrabold text-orange">{initials}</span>
            <div className="min-w-0"><p className="truncate text-xs font-bold text-white">{displayName}</p><p className="truncate text-[10px] text-white/45">{session.user.email}</p></div>
          </div>
          <button type="button" onClick={handleLogout} disabled={isSigningOut} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold text-white/55 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-50"><LogOut size={16} /> {isSigningOut ? "Signing out..." : "Sign out"}</button>
        </div>
      </aside>

      {mobileNavOpen && <button type="button" className="fixed inset-0 z-30 bg-navy/50 lg:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation overlay" />}

      <div className="min-h-screen lg:pl-[264px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7 lg:px-10">
          <div className="flex items-center gap-3"><button type="button" className="rounded-lg border border-slate-200 p-2 text-navy lg:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Menu size={19} /></button><div><p className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-orange sm:block">Administrator workspace</p><h1 className="text-lg font-extrabold text-navy sm:mt-0.5 sm:text-xl">{location.pathname === "/admin" ? "Dashboard" : navigation.find((item) => item.href === location.pathname)?.label || "Admin Portal"}</h1></div></div>
          <div className="flex items-center gap-2 sm:gap-4"><button type="button" className="hidden rounded-lg border border-slate-200 p-2.5 text-slate-400 transition hover:border-orange/40 hover:text-orange sm:block" aria-label="Search"><Search size={17} /></button><button type="button" className="relative rounded-lg border border-slate-200 p-2.5 text-slate-400 transition hover:border-orange/40 hover:text-orange" aria-label="Notifications"><Bell size={17} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-orange" /></button><span className="hidden h-7 w-px bg-slate-200 sm:block" /><span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-extrabold text-white">{initials}</span></div>
        </header>
        <main className="mx-auto max-w-[1440px] px-4 py-7 sm:px-7 sm:py-9 lg:px-10 lg:py-11"><Outlet /></main>
      </div>
    </div>
  );
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange">{eyebrow}</p><h2 className="mt-2 text-[32px] font-extrabold tracking-[-0.04em] text-navy sm:text-[40px]">{title}</h2><p className="mt-3 max-w-[580px] text-sm leading-6 text-slate-500">{description}</p></div>{action}</div>;
}

function PlaceholderPage({ section }: { section: keyof typeof sectionDetails }) {
  const details = sectionDetails[section];
  return <><PageHeading {...details} action={<button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange px-4 py-3 text-xs font-extrabold text-navy shadow-[0_6px_18px_rgba(255,153,0,0.16)] transition hover:bg-orange-light"><Activity size={15} /> Coming soon</button>} /><div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-[0_3px_16px_rgba(20,36,52,0.04)] sm:p-14"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange/10 text-orange"><Settings size={24} /></div><h3 className="mt-5 text-base font-extrabold text-navy">{details.title} workspace</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">This section is ready for data and workflows. Records will appear here once the admin tools are connected.</p></div></>;
}

export function AdminDashboard() {
  const [counts, setCounts] = useState<{ users: number | null; applications: number | null; deviceRequests: number | null; availableDevices: number | null }>({ users: null, applications: null, deviceRequests: null, availableDevices: null });

  useEffect(() => {
    void getAdminDashboardStats().then((stats) => {
      setCounts(stats);
    }).catch(() => {});
  }, []);

  const stats = [
    { label: "Total Users", value: counts.users ?? "—", icon: Users },
    { label: "Total Applications", value: counts.applications ?? "—", icon: BriefcaseBusiness },
    { label: "Total Device Requests", value: counts.deviceRequests ?? "—", icon: ClipboardList },
    { label: "Available Devices", value: counts.availableDevices ?? "—", icon: Monitor },
  ];
  return <><PageHeading eyebrow="Command center" title="Dashboard" description="A clear view of contributor activity and operational priorities." /><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_3px_16px_rgba(20,36,52,0.04)]"><div className="flex items-start justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange/10 text-orange"><Icon size={19} /></span><span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Placeholder</span></div><p className="mt-6 text-3xl font-extrabold tracking-tight text-navy">{value}</p><p className="mt-1 text-xs font-semibold text-slate-500">{label}</p></div>)}</div><div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]"><div className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_3px_16px_rgba(20,36,52,0.04)] sm:p-7"><div className="flex items-center justify-between"><div><h3 className="text-sm font-extrabold text-navy">Recent Activity</h3><p className="mt-1 text-xs text-slate-500">The latest administrative activity will appear here.</p></div><Activity size={19} className="text-orange" /></div><div className="mt-8 rounded-lg border border-dashed border-slate-200 px-5 py-10 text-center text-xs text-slate-400">No activity to display yet.</div></div><div className="rounded-xl border border-slate-200 bg-navy p-6 text-white shadow-[0_3px_16px_rgba(20,36,52,0.04)] sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange">Quick start</p><h3 className="mt-3 text-xl font-extrabold leading-tight">Your admin workspace is ready.</h3><p className="mt-3 text-xs leading-5 text-white/60">Use the navigation to access each operational area as workflows are added.</p><div className="mt-7 flex items-center gap-2 text-xs font-bold text-white/80"><ShieldCheck size={15} className="text-orange" /> Secure admin access</div></div></div></>;
}

export function AdminPlaceholder({ section }: { section: keyof typeof sectionDetails }) {
  return <PlaceholderPage section={section} />;
}
