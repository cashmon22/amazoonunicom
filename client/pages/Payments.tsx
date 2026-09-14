import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Banknote,
  BarChart3,
  Bell,
  Check,
  CheckCircle,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  CreditCard,
  FileCheck2,
  Grid2x2,
  LayoutDashboard,
  LockKeyhole,
  MoreHorizontal,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  UserCheck,
  WalletCards,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { assignmentCategories } from "@/assignment-data";

const paymentSteps = [
  { number: "1", title: "Complete Assignment", description: "Submit your completed work according to the assignment requirements.", icon: ClipboardList },
  { number: "2", title: "Review & Verification", description: "Our team reviews your submission to ensure it meets quality standards.", icon: FileCheck2 },
  { number: "3", title: "Approval", description: "Once approved, the assignment is marked complete and the reward is released.", icon: CheckCircle },
  { number: "4", title: "Funds Added", description: "The reward is added to your contributor wallet automatically.", icon: WalletCards },
  { number: "5", title: "Withdrawal Request", description: "Request a withdrawal once eligibility requirements are met.", icon: CreditCard },
];

const transactions = [
  { date: "Jun 18, 2024", description: "Customer Experience Testing", status: "Approved", amount: "+$175.00", positive: true },
  { date: "Jun 15, 2024", description: "Withdrawal to Bank **** 4567", status: "Completed", amount: "-$500.00", positive: false },
  { date: "Jun 12, 2024", description: "Marketplace Evaluation", status: "Approved", amount: "+$95.00", positive: true },
  { date: "Jun 10, 2024", description: "Product Research", status: "Approved", amount: "+$45.00", positive: true },
  { date: "Jun 8, 2024", description: "Content Quality Assessment", status: "Approved", amount: "+$60.00", positive: true },
];

const paymentMethods = [
  { name: "Bank Transfer", detail: "**** 4567", icon: "bank", primary: true },
  { name: "PayPal", detail: "alex@example.com", icon: "paypal", primary: false },
  { name: "Payoneer", detail: "alex@example.com", icon: "payoneer", primary: false },
  { name: "Direct Deposit", detail: "**** 9601", icon: "deposit", primary: false },
];

const securityCards = [
  { title: "Secure Transactions", description: "Industry-leading security measures protect your earnings and personal information.", icon: LockKeyhole },
  { title: "Account Verification", description: "All payments are linked to your verified contributor account.", icon: UserCheck },
  { title: "Fraud Prevention", description: "Automated systems monitor activity and help keep every payment safe.", icon: ShieldCheck },
  { title: "Activity Monitoring", description: "Real-time monitoring keeps your account activity transparent.", icon: BarChart3 },
  { title: "Payment Notifications", description: "Get notified for approvals, payouts, and available withdrawals.", icon: Bell },
  { title: "Data Protection", description: "Your financial details are handled with care and privacy at every step.", icon: CheckCircle },
];

const faqs = [
  { question: "How long does payment approval take?", answer: "Approval timing varies by assignment. Your dashboard shows the current status, and compensation is added after the work passes quality review." },
  { question: "How can I track my earnings?", answer: "Use Earnings Overview and the transaction history in your contributor dashboard to follow balances, approvals, withdrawals, and payment activity." },
  { question: "Is there a minimum withdrawal amount?", answer: "Withdrawal eligibility depends on your available balance and the payment method you select. The withdrawal screen shows the current requirements." },
  { question: "Can I see pending earnings?", answer: "Yes. Pending earnings are displayed separately from your available balance so you can see what is still in review." },
  { question: "Are payment notifications sent automatically?", answer: "Yes. Notifications appear in your dashboard when assignments are approved, funds are added, or payments are sent." },
];

function SectionEyebrow({ children }: { children: string }) {
  return <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange">{children}</p>;
}

function PaymentTopbar() {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3">
      <div className="flex items-center gap-2"><div className="flex gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-200" /><span className="h-2 w-2 rounded-full bg-slate-200" /><span className="h-2 w-2 rounded-full bg-slate-200" /></div><div className="ml-2 hidden h-5 w-32 items-center rounded bg-slate-50 px-2 text-[8px] text-slate-400 sm:flex">contributor.amazon.com</div></div>
      <div className="flex items-center gap-3 text-slate-400"><Search size={13} /><Bell size={13} /><span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[8px] font-bold text-white">AS</span></div>
    </div>
  );
}

function PaymentSidebar() {
  return (
    <aside className="hidden w-[132px] shrink-0 border-r border-slate-200 bg-[#fbfcfd] px-3 py-4 sm:block">
      <div className="mb-5 flex items-center gap-1.5 px-1 text-[9px] font-bold text-navy"><span className="flex h-4 w-4 items-center justify-center rounded bg-orange text-[8px]">a</span> contributor</div>
      <div className="space-y-1 text-[9px] font-medium text-slate-500">
        {[[LayoutDashboard, "Overview"], [ClipboardList, "Assignments"], [WalletCards, "Earnings"], [CreditCard, "Payments"], [UserCheck, "Profile"]].map(([Icon, label], index) => { const ItemIcon = Icon as typeof LayoutDashboard; return <div key={label as string} className={`flex items-center gap-2 rounded px-2 py-2 ${index === 3 ? "bg-orange/10 font-bold text-orange" : ""}`}><ItemIcon size={11} />{label as string}</div>; })}
      </div>
      <div className="mt-8 border-t border-slate-200 pt-3 text-[8px] text-slate-400"><ShieldCheck size={11} className="mb-1 text-slate-500" />Help & Support</div>
    </aside>
  );
}

function EarningsChart() {
  return (
    <div className="relative h-[104px] overflow-hidden pt-2">
      <div className="absolute inset-x-0 top-5 border-t border-dashed border-slate-200" /><div className="absolute inset-x-0 top-11 border-t border-dashed border-slate-200" /><div className="absolute inset-x-0 top-[68px] border-t border-dashed border-slate-200" />
      <svg viewBox="0 0 430 96" preserveAspectRatio="none" className="relative h-full w-full"><path d="M0 80 C22 73, 33 48, 55 62 S91 74, 112 47 S138 59, 160 42 S190 61, 210 33 S245 49, 267 28 S296 45, 319 20 S347 42, 369 24 S396 31, 430 3" fill="none" stroke="#2f6da5" strokeWidth="2.5" /><path d="M0 80 C22 73, 33 48, 55 62 S91 74, 112 47 S138 59, 160 42 S190 61, 210 33 S245 49, 267 28 S296 45, 319 20 S347 42, 369 24 S396 31, 430 3 V96 H0Z" fill="url(#earningsFill)" opacity=".13" /><defs><linearGradient id="earningsFill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#2f6da5" /><stop offset="1" stopColor="#2f6da5" stopOpacity="0" /></linearGradient></defs></svg>
    </div>
  );
}

function StatusDonut() {
  return <div className="relative flex h-[104px] w-[104px] shrink-0 items-center justify-center rounded-full" style={{ background: "conic-gradient(#2f6da5 0deg 220deg, #ff9900 220deg 294deg, #8ec5ad 294deg 335deg, #d9e0e7 335deg 360deg)" }}><div className="flex h-[73px] w-[73px] flex-col items-center justify-center rounded-full bg-white"><span className="text-xl font-extrabold text-navy">$3,850</span><span className="text-[7px] text-slate-400">This month</span></div></div>;
}

function EarningsDashboard({ preview = false }: { preview?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-xl ${preview ? "border border-slate-200" : "border border-white/15"} bg-[#f7f9fb] shadow-[0_20px_50px_rgba(9,22,35,0.20)]`}>
      <PaymentTopbar />
      <div className={`flex ${preview ? "min-h-[500px]" : "min-h-[335px]"}`}>
        <PaymentSidebar />
        <div className="min-w-0 flex-1 bg-[#f8fafc] p-3 sm:p-5">
          <div className="flex items-center justify-between"><div><p className="text-[8px] text-slate-400">Tuesday, June 18, 2024</p><h3 className="mt-1 text-sm font-extrabold text-navy sm:text-base">Payments Overview</h3></div><button type="button" className="hidden items-center gap-2 rounded border border-slate-200 bg-white px-3 py-1.5 text-[8px] font-bold text-slate-500 sm:flex"><SlidersHorizontal size={11} /> This month</button></div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[["Available Balance", "$1,245.00", "Ready to withdraw"], ["Pending Earnings", "$385.00", "In review"], ["Total Earnings", "$8,750.00", "All time"], ["Total Withdrawn", "$7,120.00", "All time"], ["Approved Assignments", "127", "Completed"], ["Pending Reviews", "6", "Awaiting review"]].map(([label, value, hint], index) => <div key={label} className={`rounded-md border border-slate-200 bg-white p-2.5 ${preview ? "sm:p-3" : ""}`}><p className="text-[7px] text-slate-400">{label}</p><p className="mt-1 text-sm font-extrabold text-navy sm:text-base">{value}</p><p className={`mt-1 text-[7px] ${index === 1 || index === 5 ? "text-orange" : "text-emerald-600"}`}>{hint}</p></div>)}
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-md border border-slate-200 bg-white p-3"><div className="flex items-center justify-between"><div><p className="text-[8px] font-bold text-navy">Earnings Overview</p><p className="mt-1 text-[7px] text-slate-400">Total earnings over time</p></div><p className="text-[7px] font-semibold text-slate-400">This month⌄</p></div><EarningsChart /><div className="flex justify-between text-[7px] text-slate-400"><span>May 20</span><span>May 28</span><span>Jun 5</span><span>Jun 13</span><span>Jun 17</span></div></div>
            <div className="rounded-md border border-slate-200 bg-white p-3"><div className="flex items-center justify-between"><p className="text-[8px] font-bold text-navy">Earnings by status</p><MoreHorizontal size={13} className="text-slate-400" /></div><div className="mt-3 flex items-center gap-3"><StatusDonut /><div className="space-y-2 text-[7px] text-slate-500"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#2f6da5]" />Approved <b className="ml-1 text-navy">$2,950.00</b></span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-orange" />Pending <b className="ml-1 text-navy">$885.00</b></span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#8ec5ad]" />To Review <b className="ml-1 text-navy">$115.00</b></span></div></div></div>
          </div>
          {preview && <div className="mt-3 grid gap-3 lg:grid-cols-2"><div className="rounded-md border border-slate-200 bg-white p-3"><div className="flex items-center justify-between"><p className="text-[8px] font-bold text-navy">Recent notifications</p><Bell size={12} className="text-slate-400" /></div><div className="mt-2 space-y-2">{[["Product Research approved", "+$45.00", "2h ago"], ["Withdrawal request processed", "-$500.00", "1d ago"], ["New assignment available", "Marketplace Evaluation", "2d ago"]].map(([title, amount, time]) => <div key={title} className="flex items-center gap-2 border-b border-slate-100 pb-1.5"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange/10 text-orange"><Check size={10} /></span><div className="min-w-0 flex-1"><p className="truncate text-[7px] font-bold text-slate-600">{title}</p><p className="mt-0.5 text-[7px] text-slate-400">{amount}</p></div><span className="text-[7px] text-slate-400">{time}</span></div>)}</div></div><div className="rounded-md border border-slate-200 bg-white p-3"><div className="flex items-center justify-between"><p className="text-[8px] font-bold text-navy">Payment activity</p><CreditCard size={12} className="text-slate-400" /></div><div className="mt-2 space-y-2">{[["Bank Transfer", "+$500.00", "Jun 15"], ["Bank Transfer", "+$275.00", "Jun 3"], ["PayPal", "+$150.00", "May 22"]].map(([method, amount, date]) => <div key={date} className="flex items-center justify-between border-b border-slate-100 pb-1.5 text-[7px]"><span className="text-slate-500">{method}<span className="block pt-0.5 text-slate-400">{date}</span></span><span className="font-bold text-emerald-600">{amount}</span></div>)}</div></div></div>}
        </div>
      </div>
    </div>
  );
}

function PaymentMethodIcon({ type }: { type: string }) {
  if (type === "bank") return <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-700"><Banknote size={16} /></span>;
  if (type === "paypal") return <span className="flex h-8 w-8 items-center justify-center rounded-md bg-sky-50 text-sky-700 text-xs font-extrabold">P</span>;
  if (type === "payoneer") return <span className="flex h-8 w-8 items-center justify-center rounded-md bg-orange/10 text-orange"><CircleDollarSign size={16} /></span>;
  return <span className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-700"><CreditCard size={16} /></span>;
}

function AssignmentRewardCard({ category }: { category: (typeof assignmentCategories)[number] }) {
  const { icon: Icon, title, reward, time } = category;
  const shortTime = time.replace(" Minutes", " mins").replace(" Hours", " hrs");
  return <article className="group rounded-lg border border-slate-200 bg-white p-4 shadow-card transition duration-300 hover:-translate-y-1 hover:border-orange/40 hover:shadow-elevated sm:p-5"><div className="flex h-10 w-10 items-center justify-center rounded-md bg-orange/10 text-orange transition group-hover:bg-orange group-hover:text-navy"><Icon size={19} /></div><h3 className="mt-4 min-h-[30px] text-xs font-extrabold leading-4 text-navy">{title}</h3><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3"><span className="flex items-center gap-1 text-[9px] text-slate-400"><Clock3 size={11} /> {shortTime}</span><span className="text-xs font-extrabold text-navy">{reward}</span></div><p className="mt-1 text-right text-[9px] text-slate-400">estimated reward</p></article>;
}

export default function Payments() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return <div className="min-h-screen overflow-x-hidden bg-[#f8f9fa] text-ink">
    <SiteHeader active="payments" />
    <main>
      <section className="relative overflow-hidden bg-navy text-white"><div className="absolute -right-40 -top-48 h-[520px] w-[520px] rounded-full border border-white/[0.05]" /><div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-orange/[0.07] blur-3xl" /><div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12 lg:px-8 lg:py-20"><div className="relative z-10 max-w-[475px]"><SectionEyebrow>Payments</SectionEyebrow><h1 className="text-[42px] font-extrabold leading-[1.06] tracking-[-0.045em] sm:text-[56px]">Transparent Earnings.<span className="block text-orange">Secure Payments.</span></h1><p className="mt-6 max-w-[450px] text-base leading-7 text-white/65">Track your earnings, monitor payment activity, and receive compensation securely through the Contributor Program.</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/apply" className="inline-flex items-center gap-2 rounded-md bg-orange px-6 py-3.5 text-sm font-extrabold text-navy transition hover:-translate-y-0.5 hover:bg-orange-light">Apply now <ArrowRight size={16} /></Link><Link to="/how-it-works" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition hover:border-orange hover:text-orange">Learn how it works <ArrowRight size={15} /></Link></div><div className="mt-8 flex items-center gap-2 text-xs font-medium text-white/60"><ShieldCheck size={16} className="text-orange" /> Secure contributor payment workspace</div></div><EarningsDashboard /></div></section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto grid max-w-[1200px] gap-9 lg:grid-cols-[0.45fr_1.55fr] lg:items-center"><div><SectionEyebrow>Clear by design</SectionEyebrow><h2 className="section-title">How contributors earn</h2><p className="mt-4 text-sm leading-6 text-slate-500">Contributors receive compensation for approved assignments. Reward amounts vary depending on assignment complexity, estimated completion time, and project requirements.</p><p className="mt-4 text-sm leading-6 text-slate-500">All rewards are shown before work begins, ensuring complete transparency throughout the process.</p></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">{assignmentCategories.map((category) => <AssignmentRewardCard key={category.title} category={category} />)}</div></div></section>

      <section className="bg-[#f8f9fa] px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="text-center"><SectionEyebrow>From completed work to payout</SectionEyebrow><h2 className="section-title">Payment process</h2><p className="mx-auto mt-3 max-w-[540px] text-sm leading-6 text-slate-500">A simple, visible process keeps every reward easy to follow.</p></div><div className="relative mt-14 grid gap-9 md:grid-cols-5 md:gap-3"><div className="absolute left-[9%] right-[9%] top-[38px] hidden border-t border-dashed border-slate-300 md:block" />{paymentSteps.map(({ number, title, description, icon: Icon }) => <div key={number} className="relative z-10 flex items-start gap-4 md:block md:text-center"><div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full border-[6px] border-[#f8f9fa] bg-white text-navy shadow-card ring-1 ring-slate-200 md:mx-auto"><Icon size={27} strokeWidth={1.6} /><span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange text-xs font-extrabold text-navy">{number}</span></div><div className="md:mt-5"><h3 className="text-xs font-extrabold text-navy sm:text-sm">{title}</h3><p className="mt-2 max-w-[180px] text-[10px] leading-4 text-slate-500 md:mx-auto">{description}</p></div></div>)}</div></div></section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="grid gap-8 lg:grid-cols-[0.45fr_1.55fr] lg:items-center"><div><SectionEyebrow>One source of truth</SectionEyebrow><h2 className="section-title">Track everything in one place</h2><p className="mt-4 text-sm leading-6 text-slate-500">Your dashboard provides real-time visibility into your earnings, payment status, and transaction history.</p><ul className="mt-6 space-y-3 text-xs text-slate-600">{["Real-time wallet balance", "Earnings and payout tracking", "Payment history and reports", "Notifications and updates"].map((item) => <li key={item} className="flex items-center gap-2"><Check size={14} className="text-orange" />{item}</li>)}</ul></div><EarningsDashboard preview /></div></div></section>

      <section className="bg-[#f8f9fa] px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto grid max-w-[1200px] gap-5 lg:grid-cols-[1.1fr_0.9fr]"><div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card sm:p-6"><div className="flex items-end justify-between"><div><SectionEyebrow>Financial activity</SectionEyebrow><h2 className="text-2xl font-extrabold tracking-[-0.03em] text-navy">Recent transactions</h2></div><button type="button" className="hidden items-center gap-1 text-[10px] font-bold text-blue-700 sm:flex">View all <ArrowRight size={12} /></button></div><div className="mt-6 overflow-x-auto"><table className="w-full min-w-[590px] text-left text-[10px]"><thead className="border-y border-slate-100 text-[9px] font-bold uppercase tracking-wide text-slate-400"><tr><th className="py-3 pr-4">Date</th><th className="py-3 pr-4">Description</th><th className="py-3 pr-4">Status</th><th className="py-3 text-right">Amount</th></tr></thead><tbody>{transactions.map(({ date, description, status, amount, positive }) => <tr key={`${date}-${description}`} className="border-b border-slate-100 text-slate-500 last:border-0"><td className="whitespace-nowrap py-3 pr-4">{date}</td><td className="whitespace-nowrap py-3 pr-4 font-semibold text-navy">{description}</td><td className="py-3 pr-4"><span className={`rounded-full px-2 py-1 text-[8px] font-bold ${positive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{status}</span></td><td className={`py-3 text-right font-extrabold ${positive ? "text-emerald-600" : "text-rose-500"}`}>{amount}</td></tr>)}</tbody></table></div></div><div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card sm:p-6"><div className="flex items-end justify-between"><div><SectionEyebrow>Manage your payout options</SectionEyebrow><h2 className="text-2xl font-extrabold tracking-[-0.03em] text-navy">Payment methods</h2></div><button type="button" className="flex items-center gap-1 text-[10px] font-bold text-blue-700">+ Add method</button></div><div className="mt-6 divide-y divide-slate-100">{paymentMethods.map(({ name, detail, icon, primary }) => <div key={name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"><PaymentMethodIcon type={icon} /><div className="min-w-0 flex-1"><p className="text-xs font-bold text-navy">{name}</p><p className="mt-0.5 text-[10px] text-slate-400">{detail}</p></div>{primary && <span className="rounded-full bg-orange/10 px-2 py-1 text-[8px] font-bold text-orange">Primary</span>}<ArrowRight size={13} className="text-slate-300" /></div>)}</div></div></div></section>

      <section className="bg-navy px-5 py-16 text-white sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="text-center"><SectionEyebrow>Protection built in</SectionEyebrow><h2 className="text-[30px] font-extrabold tracking-[-0.035em] sm:text-[36px]">Secure payments you can trust</h2><p className="mx-auto mt-3 max-w-[560px] text-sm leading-6 text-white/55">Your earnings and payment information are supported by transparent processes and enterprise-grade safeguards.</p></div><div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">{securityCards.map(({ title, description, icon: Icon }) => <div key={title} className="rounded-lg border border-white/10 bg-white/[0.05] p-4 transition hover:-translate-y-1 hover:border-orange/40"><Icon size={21} className="text-orange" /><h3 className="mt-4 text-xs font-bold text-white">{title}</h3><p className="mt-2 text-[10px] leading-4 text-white/50">{description}</p></div>)}</div></div></section>

      <section id="faq" className="bg-white px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto grid max-w-[1020px] gap-10 md:grid-cols-[0.7fr_1.3fr] md:gap-16"><div><SectionEyebrow>Need help?</SectionEyebrow><h2 className="section-title">Frequently asked questions</h2><p className="mt-4 text-sm leading-6 text-slate-500">Find quick answers about approval, balances, withdrawals, and payment activity.</p></div><div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white px-5 shadow-card">{faqs.map(({ question, answer }, index) => { const isOpen = openFaq === index; return <div key={question}><button type="button" onClick={() => setOpenFaq(isOpen ? null : index)} className="flex w-full items-center justify-between gap-4 py-5 text-left text-xs font-bold text-navy sm:text-sm">{question}<ChevronDown size={17} className={`shrink-0 text-slate-400 transition ${isOpen ? "rotate-180 text-orange" : ""}`} /></button>{isOpen && <p className="-mt-1 pb-5 pr-8 text-xs leading-5 text-slate-500">{answer}</p>}</div>; })}</div></div></section>

      <section id="apply" className="scroll-mt-20 bg-gradient-to-r from-navy to-[#1b3247] px-5 py-14 text-white sm:px-8 lg:py-16"><div className="mx-auto flex max-w-[1020px] flex-col items-center justify-between gap-7 text-center sm:flex-row sm:text-left"><div><SectionEyebrow>Start earning with confidence</SectionEyebrow><h2 className="max-w-[650px] text-[28px] font-extrabold tracking-[-0.035em] sm:text-[34px]">Get rewarded for your contributions</h2><p className="mt-2 max-w-[540px] text-sm text-white/60">Join the Contributor Program and start earning through flexible opportunities, transparent payments, and secure withdrawals.</p></div><Link to="/contact" className="inline-flex shrink-0 items-center gap-2 rounded-md bg-orange px-9 py-3.5 text-sm font-extrabold text-navy transition hover:-translate-y-0.5 hover:bg-orange-light">Apply now <ArrowRight size={16} /></Link></div></section>
    </main>
    <SiteFooter />
  </div>;
}
