import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  CheckCircle,
  ChevronDown,
  CircleDollarSign,
  CircleDashed,
  ClipboardList,
  Clock3,
  CreditCard,
  FileCheck2,
  Grid2x2,
  LayoutDashboard,
  ListChecks,
  MoreHorizontal,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  UserCheck,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { assignmentCategories } from "@/assignment-data";

const journeySteps = [
  { number: "1", title: "Apply", description: "Submit your application and provide the necessary information to get started.", icon: FileCheck2 },
  { number: "2", title: "Qualification Review", description: "We review your application to ensure a great fit for available opportunities.", icon: UserCheck },
  { number: "3", title: "Access Assignments", description: "Once approved, you'll gain access to assignments that match your profile.", icon: Grid2x2 },
  { number: "4", title: "Complete Tasks", description: "Follow instructions carefully and submit high-quality work on time.", icon: CheckCircle },
  { number: "5", title: "Receive Compensation", description: "Approved work is credited to your account and ready for withdrawal.", icon: CircleDollarSign },
];

const workflowSteps = [
  { label: "Available Assignments", helper: "Browse work that matches your profile", icon: Grid2x2, tone: "blue" },
  { label: "Accepted Assignment", helper: "You reserved a new opportunity", icon: ClipboardList, tone: "orange" },
  { label: "Work In Progress", helper: "Your task is currently underway", icon: Clock3, tone: "violet" },
  { label: "Submitted For Review", helper: "Your work is being checked", icon: Send, tone: "teal" },
  { label: "Approved", helper: "Quality review is complete", icon: CheckCircle, tone: "green" },
  { label: "Reward Added", helper: "Compensation is in your wallet", icon: WalletCards, tone: "gold" },
];

const faqs = [
  { question: "Who can join the Contributor Program?", answer: "The program is open to qualified participants who meet the requirements for available assignments in their region. Each opportunity lists any specific qualifications before you apply." },
  { question: "How are assignments matched to me?", answer: "Assignments are surfaced based on your profile, qualifications, location, and the requirements of each opportunity. You can review the details before accepting any work." },
  { question: "How and when do I get paid?", answer: "Once approved, compensation is added to your contributor wallet. You can view payment status and use the available withdrawal options from your dashboard." },
  { question: "What devices can I use?", answer: "Most assignments can be completed on a laptop or desktop computer. The assignment details will tell you if a specific device or browser is required." },
  { question: "How long are assignments reviewed?", answer: "Review timing varies by assignment. Your dashboard keeps the status visible so you always know when work has moved to the next stage." },
];

function SectionEyebrow({ children }: { children: string }) {
  return <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange">{children}</p>;
}

function DashboardTopbar({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center justify-between border-b border-slate-200 bg-white ${compact ? "px-3 py-2" : "px-4 py-3"}`}>
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-200" /><span className="h-2 w-2 rounded-full bg-slate-200" /><span className="h-2 w-2 rounded-full bg-slate-200" /></div>
        <div className="ml-2 hidden h-5 w-28 items-center rounded bg-slate-50 px-2 text-[8px] text-slate-400 sm:flex">contributor.amazon.com</div>
      </div>
      <div className="flex items-center gap-3 text-slate-400"><Search size={13} /><Bell size={13} /><span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[8px] font-bold text-white">AS</span></div>
    </div>
  );
}

function DashboardSidebar() {
  return (
    <aside className="hidden w-[126px] shrink-0 border-r border-slate-200 bg-[#fbfcfd] px-3 py-4 sm:block">
      <div className="mb-5 flex items-center gap-1.5 px-1 text-[9px] font-bold text-navy"><span className="flex h-4 w-4 items-center justify-center rounded bg-orange text-[8px]">a</span> contributor</div>
      <div className="space-y-1 text-[9px] font-medium text-slate-500">
        {[[LayoutDashboard, "Overview"], [ListChecks, "Assignments"], [WalletCards, "Earnings"], [CreditCard, "Payments"], [UserCheck, "Profile"]].map(([Icon, label], index) => {
          const ItemIcon = Icon as typeof LayoutDashboard;
          return <div key={label as string} className={`flex items-center gap-2 rounded px-2 py-2 ${index === 0 ? "bg-orange/10 font-bold text-orange" : ""}`}><ItemIcon size={11} />{label as string}</div>;
        })}
      </div>
      <div className="mt-8 border-t border-slate-200 pt-3 text-[8px] text-slate-400"><ShieldCheck size={11} className="mb-1 text-slate-500" />Help & Support</div>
    </aside>
  );
}

function MiniChart() {
  return (
    <div className="relative h-20 overflow-hidden pt-2">
      <div className="absolute inset-x-0 top-5 border-t border-dashed border-slate-200" />
      <div className="absolute inset-x-0 top-11 border-t border-dashed border-slate-200" />
      <svg viewBox="0 0 240 74" preserveAspectRatio="none" className="relative h-full w-full">
        <path d="M0 60 C18 56, 22 40, 39 48 S59 52, 72 37 S93 45, 106 34 S125 42, 141 25 S158 35, 174 28 S191 31, 207 12 S226 22, 240 4" fill="none" stroke="#2f6da5" strokeWidth="2.5" />
        <path d="M0 60 C18 56, 22 40, 39 48 S59 52, 72 37 S93 45, 106 34 S125 42, 141 25 S158 35, 174 28 S191 31, 207 12 S226 22, 240 4 V74 H0Z" fill="url(#chartFill)" opacity=".16" />
        <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#2f6da5" /><stop offset="1" stopColor="#2f6da5" stopOpacity="0" /></linearGradient></defs>
      </svg>
    </div>
  );
}

function HeroDashboard() {
  return (
    <div className="relative mx-auto w-full max-w-[590px] rounded-xl border border-white/15 bg-[#f7f9fb] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-3">
      <div className="absolute -right-3 top-12 z-20 hidden items-center gap-2 rounded-md border border-white/15 bg-[#152638] px-3 py-2 text-[9px] font-semibold text-white shadow-xl sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Account verified</div>
      <DashboardTopbar />
      <div className="flex min-h-[275px] sm:min-h-[330px]">
        <DashboardSidebar />
        <div className="min-w-0 flex-1 p-3 sm:p-4">
          <div className="flex items-center justify-between"><div><p className="text-[8px] text-slate-400">Tuesday, June 11, 2024</p><p className="mt-1 text-sm font-extrabold text-navy sm:text-base">Good morning, Alex</p></div><div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange/15 text-orange"><Bell size={13} /></div></div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {["Available Assignments", "In Progress", "Pending Review", "Completed"].map((label, index) => <div key={label} className="rounded-md border border-slate-200 bg-white p-2.5"><p className="text-[7px] text-slate-400">{label}</p><p className="mt-1 text-base font-extrabold text-navy sm:text-lg">{[12, 3, 2, 28][index]}</p><p className={`mt-1 text-[7px] ${index === 0 ? "text-orange" : "text-emerald-600"}`}>{index === 0 ? "View all →" : index === 1 ? "View all →" : index === 2 ? "View all →" : "View all →"}</p></div>)}
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-md border border-slate-200 bg-white p-3"><div className="flex items-center justify-between"><p className="text-[8px] font-bold text-navy">Earnings Summary</p><p className="text-[7px] text-slate-400">This month</p></div><p className="mt-3 text-lg font-extrabold text-navy">$3,850.00</p><p className="mt-1 text-[7px] text-emerald-600">↑ 12% vs last month</p><div className="mt-2 h-1.5 rounded-full bg-slate-100"><div className="h-1.5 w-[64%] rounded-full bg-orange" /></div></div>
            <div className="rounded-md border border-slate-200 bg-white p-3"><div className="flex items-center justify-between"><p className="text-[8px] font-bold text-navy">Recent activity</p><p className="text-[7px] text-blue-600">View all</p></div><div className="mt-2 space-y-2">{[["Product Research Approved", "+$45.00"], ["Marketplace Evaluation Approved", "+$95.00"], ["Content Quality Assessment Approved", "+$60.00"]].map(([name, value]) => <div key={name} className="flex items-center justify-between border-b border-slate-100 pb-1.5 text-[7px]"><span className="flex items-center gap-1.5 text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-orange" />{name}</span><span className="font-bold text-emerald-600">{value}</span></div>)}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_48px_rgba(20,36,52,0.10)]">
      <DashboardTopbar />
      <div className="flex min-h-[470px]">
        <DashboardSidebar />
        <div className="min-w-0 flex-1 bg-[#f8fafc] p-4 sm:p-6">
          <div className="flex items-center justify-between"><div><p className="text-[9px] text-slate-400">Tuesday, June 11, 2024</p><h3 className="mt-1 text-base font-extrabold text-navy sm:text-lg">Overview</h3></div><button type="button" className="hidden items-center gap-2 rounded border border-slate-200 bg-white px-3 py-2 text-[9px] font-bold text-slate-500 sm:flex"><SlidersHorizontal size={12} /> Customize</button></div>
          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[{ label: "Available Assignments", value: "12", hint: "8 new this week", icon: Grid2x2 }, { label: "Assignment Status", value: "43", hint: "Total assignments", icon: ClipboardList }, { label: "Earnings Summary", value: "$3,850.00", hint: "↑ 12% this month", icon: BarChart3 }, { label: "Pending Reviews", value: "2", hint: "Average 2 days", icon: FileCheck2 }].map(({ label, value, hint, icon: Icon }) => <div key={label} className="rounded-lg border border-slate-200 bg-white p-3 sm:p-4"><div className="flex items-center justify-between"><p className="text-[9px] font-bold text-slate-600">{label}</p><Icon size={14} className="text-orange" /></div><p className="mt-4 text-xl font-extrabold tracking-[-0.04em] text-navy">{value}</p><p className="mt-1 text-[9px] text-emerald-600">{hint}</p></div>)}
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-lg border border-slate-200 bg-white p-4"><div className="flex items-center justify-between"><div><p className="text-[9px] font-bold text-navy">Wallet balance</p><p className="mt-1 text-[8px] text-slate-400">Available to withdraw</p></div><button type="button" className="rounded bg-orange px-2.5 py-1.5 text-[8px] font-bold text-navy">Withdraw funds</button></div><p className="mt-4 text-2xl font-extrabold text-navy">$1,245.00</p><div className="mt-3 border-t border-slate-100 pt-3"><div className="flex justify-between text-[8px] text-slate-400"><span>Monthly earnings</span><span>May 2024</span></div><MiniChart /><div className="flex justify-between text-[7px] text-slate-400"><span>May 1</span><span>May 8</span><span>May 15</span><span>May 22</span><span>May 29</span></div></div></div>
            <div className="rounded-lg border border-slate-200 bg-white p-4"><div className="flex items-center justify-between"><p className="text-[9px] font-bold text-navy">Assignment status</p><button type="button" className="text-[8px] font-semibold text-blue-600">View all</button></div><div className="mt-4 flex items-center gap-5"><div className="relative flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded-full" style={{ background: "conic-gradient(#2f6da5 0deg 164deg, #ff9900 164deg 250deg, #8ec5ad 250deg 314deg, #d9e0e7 314deg 360deg)" }}><div className="flex h-[70px] w-[70px] flex-col items-center justify-center rounded-full bg-white"><span className="text-xl font-extrabold text-navy">43</span><span className="text-[7px] text-slate-400">Total</span></div></div><div className="space-y-2 text-[8px] text-slate-500"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#2f6da5]" />12 Available</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-orange" />3 In Progress</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#8ec5ad]" />18 Completed</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-slate-300" />2 Pending Review</span></div></div></div>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]"><div className="rounded-lg border border-slate-200 bg-white p-4"><div className="flex items-center justify-between"><p className="text-[9px] font-bold text-navy">Recent notifications</p><Bell size={13} className="text-slate-400" /></div><div className="mt-3 space-y-2.5">{[["New assignment available", "Product Research", "2h ago", "orange"], ["Assignment approved", "Marketplace Evaluation", "1d ago", "green"], ["Payment sent", "May 29, 2024", "4d ago", "blue"]].map(([title, subtitle, time, tone]) => <div key={title} className="flex items-center gap-2 border-b border-slate-100 pb-2"><span className={`flex h-6 w-6 items-center justify-center rounded-full ${tone === "orange" ? "bg-orange/15 text-orange" : tone === "green" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}><Check size={11} /></span><div className="min-w-0 flex-1"><p className="truncate text-[8px] font-bold text-slate-600">{title}</p><p className="mt-0.5 text-[7px] text-slate-400">{subtitle}</p></div><span className="text-[7px] text-slate-400">{time}</span></div>)}</div></div><div className="rounded-lg border border-slate-200 bg-white p-4"><div className="flex items-center justify-between"><p className="text-[9px] font-bold text-navy">Payment history</p><MoreHorizontal size={14} className="text-slate-400" /></div><div className="mt-3 space-y-2">{[["Jun 11, 2024", "+$350.00", "Premium Research Project Approved"], ["Jun 8, 2024", "+$175.00", "Customer Experience Testing Approved"], ["Jun 5, 2024", "+$95.00", "Marketplace Evaluation Approved"], ["May 30, 2024", "+$60.00", "Content Quality Assessment Approved"], ["May 24, 2024", "+$45.00", "Product Research Approved"]].map(([date, amount, status]) => <div key={date} className="flex justify-between border-b border-slate-100 pb-2 text-[8px]"><span className="text-slate-500">{date}<span className="block truncate pt-0.5 text-[7px] text-slate-400">{status}</span></span><span className="font-bold text-emerald-600">{amount}</span></div>)}</div></div></div>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8f9fa] text-ink">
      <SiteHeader active="how-it-works" />

      <main>
        <section className="relative overflow-hidden bg-navy text-white">
          <div className="absolute -right-40 -top-48 h-[520px] w-[520px] rounded-full border border-white/[0.05]" />
          <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-orange/[0.07] blur-3xl" />
          <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14 lg:px-8 lg:py-24">
            <div className="relative z-10 max-w-[500px]"><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/70"><LayoutDashboard size={13} className="text-orange" /> Contributor workspace</div><h1 className="text-[40px] font-extrabold leading-[1.07] tracking-[-0.045em] sm:text-[52px]">How the Contributor Program Works</h1><p className="mt-6 max-w-[450px] text-base leading-7 text-white/65">Learn how contributors apply, access assignments, complete tasks, track earnings, and receive compensation through a transparent workflow.</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/apply" className="inline-flex items-center gap-2 rounded-md bg-orange px-6 py-3.5 text-sm font-extrabold text-navy transition hover:-translate-y-0.5 hover:bg-orange-light">Apply now <ArrowRight size={16} /></Link><Link to="#program-overview" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition hover:border-orange hover:text-orange">Learn more <ArrowDown size={15} /></Link></div></div>
            <HeroDashboard />
          </div>
        </section>

        <section id="program-overview" className="scroll-mt-20 bg-white px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div><SectionEyebrow>Program overview</SectionEyebrow><h2 className="section-title">A clear path to meaningful work</h2><p className="mt-5 max-w-[490px] text-sm leading-7 text-slate-500">The Contributor Program connects qualified participants with assignments that help improve product information, marketplace quality, customer experience, and research initiatives.</p><div className="mt-7 flex items-center gap-3 text-xs font-semibold text-navy"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange/15 text-orange"><ShieldCheck size={17} /></span>Every step is visible in your contributor dashboard</div></div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[["Flexible participation", "Choose when you contribute", Clock3], ["Assignment rewards", "Earn for approved work", CircleDollarSign], ["Progress tracking", "See every status update", BarChart3], ["Secure compensation", "Reliable payment history", CreditCard]].map(([title, description, Icon]) => { const ItemIcon = Icon as typeof Clock3; return <div key={title as string} className="rounded-lg border border-slate-200 bg-[#fbfcfd] p-4 transition hover:-translate-y-0.5 hover:border-orange/40 hover:shadow-card"><span className="flex h-9 w-9 items-center justify-center rounded-md bg-orange/10 text-orange"><ItemIcon size={17} /></span><p className="mt-4 text-xs font-extrabold leading-4 text-navy">{title as string}</p><p className="mt-2 text-[10px] leading-4 text-slate-500">{description as string}</p></div> })}</div>
          </div>
        </section>

        <section className="bg-[#f8f9fa] px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-[1200px]"><div className="text-center"><SectionEyebrow>From application to payout</SectionEyebrow><h2 className="section-title">Your journey as a contributor</h2><p className="mx-auto mt-3 max-w-[540px] text-sm leading-6 text-slate-500">A simple process designed for transparency and flexibility.</p></div><div className="relative mt-14 grid gap-9 md:grid-cols-5 md:gap-3"><div className="absolute left-[9%] right-[9%] top-[38px] hidden border-t border-dashed border-slate-300 md:block" />{journeySteps.map(({ number, title, description, icon: Icon }) => <div key={number} className="relative z-10 flex items-start gap-4 md:block md:text-center"><div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full border-[6px] border-[#f8f9fa] bg-white text-navy shadow-card ring-1 ring-slate-200 md:mx-auto"><Icon size={27} strokeWidth={1.6} /><span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange text-xs font-extrabold text-navy">{number}</span></div><div className="md:mt-5"><h3 className="text-xs font-extrabold text-navy sm:text-sm">{title}</h3><p className="mt-2 max-w-[180px] text-[10px] leading-4 text-slate-500 md:mx-auto">{description}</p></div></div>)}</div></div>
        </section>

        <section className="bg-white px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><SectionEyebrow>One status at a time</SectionEyebrow><h2 className="section-title">Assignment workflow</h2><p className="mt-3 max-w-[560px] text-sm leading-6 text-slate-500">Move through a consistent review process with a status for every stage of your work.</p></div><div className="hidden items-center gap-2 text-[10px] font-semibold text-slate-400 sm:flex"><CircleDashed size={14} /> Your progress is always visible</div></div><div className="mt-10 grid gap-3 md:grid-cols-3 xl:grid-cols-6">{workflowSteps.map(({ label, helper, icon: Icon, tone }, index) => { const toneClasses: Record<string, string> = { blue: "bg-blue-50 text-blue-700", orange: "bg-orange/10 text-orange", violet: "bg-violet-50 text-violet-700", teal: "bg-teal-50 text-teal-700", green: "bg-emerald-50 text-emerald-700", gold: "bg-amber-50 text-amber-700" }; return <div key={label} className="relative rounded-lg border border-slate-200 bg-white p-4 shadow-card transition hover:-translate-y-1 hover:shadow-elevated"><div className={`flex h-10 w-10 items-center justify-center rounded-md ${toneClasses[tone]}`}><Icon size={19} /></div><p className="mt-4 min-h-[32px] text-xs font-extrabold leading-4 text-navy">{label}</p><p className="mt-2 min-h-[32px] text-[10px] leading-4 text-slate-500">{helper}</p>{index < workflowSteps.length - 1 && <span className="absolute -right-3 top-1/2 z-20 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 xl:flex"><ArrowRight size={12} /></span>}</div> })}</div></div></section>

        <section className="bg-[#f8f9fa] px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><SectionEyebrow>See it at a glance</SectionEyebrow><h2 className="section-title">Everything in one dashboard</h2><p className="mt-3 max-w-[560px] text-sm leading-6 text-slate-500">Track assignments, earnings, reviews, notifications, and payments from one secure workspace.</p></div><div className="hidden items-center gap-2 text-xs font-semibold text-slate-400 sm:flex"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Live account preview</div></div><div className="mt-10"><DashboardPreview /></div></div></section>

        <section className="bg-white px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="text-center"><SectionEyebrow>Find the right assignment</SectionEyebrow><h2 className="section-title">Types of assignments you may receive</h2><p className="mx-auto mt-3 max-w-[550px] text-sm leading-6 text-slate-500">Opportunities are designed to fit different skills, interests, and schedules.</p></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{assignmentCategories.map(({ title, difficulty, description, time, reward, icon: Icon }) => <article key={title} className="group rounded-lg border border-slate-200 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-orange/40 hover:shadow-elevated"><div className="flex h-11 w-11 items-center justify-center rounded-md bg-orange/10 text-orange transition group-hover:bg-orange group-hover:text-navy"><Icon size={20} /></div><h3 className="mt-5 min-h-[32px] text-xs font-extrabold leading-4 text-navy">{title}</h3><div className="mt-3 grid grid-cols-2 gap-3 border-y border-slate-100 py-3"><div><p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Difficulty</p><p className="mt-1 text-[10px] font-semibold leading-4 text-navy">{difficulty}</p></div><div><p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Estimated time</p><p className="mt-1 text-[10px] font-semibold leading-4 text-navy">{time}</p></div></div><p className="mt-4 min-h-[64px] text-[10px] leading-4 text-slate-500">{description}</p><div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4"><div><p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Reward range</p><p className="mt-1 text-sm font-extrabold text-navy">{reward}</p></div><CircleDollarSign size={17} className="mb-0.5 text-orange" /></div></article>)}</div></div></section>

        <section className="bg-[#f8f9fa] px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="overflow-hidden rounded-xl bg-navy p-6 text-white shadow-[0_16px_42px_rgba(9,22,35,0.16)] sm:p-9"><div className="relative z-10 text-center"><SectionEyebrow>Built on trust and transparency</SectionEyebrow><h2 className="text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">Progress you can measure</h2><p className="mt-3 text-xs text-white/55">We are committed to creating meaningful opportunities with clarity and accountability.</p></div><div className="relative z-10 mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["250K+", "Active contributors", "Global community", UsersRound], ["12M+", "Completed assignments", "And counting", ClipboardList], ["96%", "Approval rate", "Quality-focused reviews", ShieldCheck], ["$50M+", "Compensation distributed", "Paid securely worldwide", CircleDollarSign]].map(([value, label, helper, Icon]) => { const ItemIcon = Icon as typeof UsersRound; return <div key={label as string} className="rounded-lg border border-white/10 bg-white/[0.05] p-4 text-center sm:text-left"><ItemIcon size={20} className="mx-auto text-orange sm:mx-0" /><p className="mt-3 text-2xl font-extrabold tracking-[-0.04em] text-orange">{value as string}</p><p className="mt-1 text-xs font-bold text-white">{label as string}</p><p className="mt-1 text-[9px] text-white/45">{helper as string}</p></div> })}</div></div></div></section>

        <section id="faq" className="bg-white px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto grid max-w-[1020px] gap-10 md:grid-cols-[0.72fr_1.28fr] md:gap-16"><div><SectionEyebrow>Need help?</SectionEyebrow><h2 className="section-title">Frequently asked questions</h2><p className="mt-4 text-sm leading-6 text-slate-500">Find quick answers about applying, assignments, reviews, and compensation.</p><Link to="/contact" className="mt-7 inline-flex items-center gap-2 text-xs font-bold text-navy transition hover:text-orange">Contact contributor support <ArrowRight size={14} /></Link></div><div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white px-5 shadow-card">{faqs.map(({ question, answer }, index) => { const isOpen = openFaq === index; return <div key={question}><button type="button" onClick={() => setOpenFaq(isOpen ? null : index)} className="flex w-full items-center justify-between gap-4 py-5 text-left text-xs font-bold text-navy sm:text-sm">{question}<ChevronDown size={17} className={`shrink-0 text-slate-400 transition ${isOpen ? "rotate-180 text-orange" : ""}`} /></button>{isOpen && <p className="-mt-1 pb-5 pr-8 text-xs leading-5 text-slate-500">{answer}</p>}</div> })}</div></div></section>

        <section id="apply" className="scroll-mt-20 bg-navy px-5 py-14 text-white sm:px-8 lg:py-16"><div className="mx-auto flex max-w-[1020px] flex-col items-center justify-between gap-7 text-center sm:flex-row sm:text-left"><div><SectionEyebrow>Take the next step</SectionEyebrow><h2 className="text-[28px] font-extrabold tracking-[-0.035em] sm:text-[34px]">Ready to begin?</h2><p className="mt-2 text-sm text-white/60">Apply today and gain access to assignment opportunities.</p></div><Link to="/contact" className="inline-flex shrink-0 items-center gap-2 rounded-md bg-orange px-9 py-3.5 text-sm font-extrabold text-navy transition hover:-translate-y-0.5 hover:bg-orange-light">Apply now <ArrowRight size={16} /></Link></div></section>
      </main>

      <SiteFooter />
    </div>
  );
}
