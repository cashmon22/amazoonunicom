import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  FileCheck2,
  FileSearch,
  Grid2x2,
  Headphones,
  HelpCircle,
  LayoutDashboard,
  LockKeyhole,
  MessageSquare,
  MoreHorizontal,
  Search,
  ShieldCheck,
  UserCheck,
  WalletCards,
  Wrench,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

const categories = [
  { title: "Getting Started", description: "Account setup and eligibility.", icon: HelpCircle },
  { title: "Assignments", description: "How assignments work.", icon: ClipboardList },
  { title: "Payments & Rewards", description: "Compensation and withdrawals.", icon: CircleDollarSign },
  { title: "Account & Security", description: "Account protection and verification.", icon: LockKeyhole },
  { title: "Support", description: "Getting assistance.", icon: Headphones },
];

const faqGroups = [
  {
    title: "Getting Started",
    icon: HelpCircle,
    items: [
      ["Who can participate in the Contributor Program?", "The program is open to qualified participants who meet the requirements for available assignments in their region. Each opportunity lists any specific qualifications before you apply."],
      ["Is registration free?", "Yes. Creating a contributor account is free. You can review available opportunities and their requirements before accepting any assignment."],
      ["How do I create an account?", "Select Apply now, provide your account details, and complete the profile information requested. Once your profile is ready, you can begin the qualification process."],
      ["Do I need previous experience?", "No. Many assignments include clear instructions and are designed for contributors at different experience levels."],
    ],
  },
  {
    title: "Assignments",
    icon: ClipboardList,
    items: [
      ["How do I access assignments?", "After your account is approved, available assignments appear in your contributor workspace based on your profile and eligibility."],
      ["How are assignments matched to me?", "Assignments are surfaced based on your profile, qualifications, location, and the requirements of each opportunity."],
      ["Can I choose which assignments to complete?", "Yes. You can review the scope, estimated time, and reward before choosing which available assignments to accept."],
      ["How long do assignments take?", "Completion times vary by assignment. Each opportunity displays an estimated time before you begin."],
    ],
  },
  {
    title: "Payments & Rewards",
    icon: CircleDollarSign,
    items: [
      ["How do I earn rewards?", "You earn the displayed reward when you complete an assignment according to its requirements and the work is approved through quality review."],
      ["When are rewards added to my account?", "Approved rewards are added to your contributor wallet after the assignment completes the review process."],
      ["How can I track my earnings?", "Your dashboard shows available balance, pending earnings, total earnings, withdrawals, and recent payment activity."],
      ["What payment methods are supported?", "Available methods can include bank transfer, PayPal, Payoneer, and direct deposit depending on your region and account eligibility."],
      ["Is there a minimum withdrawal amount?", "Withdrawal eligibility depends on your available balance and selected payment method. The withdrawal screen shows the current requirements."],
    ],
  },
  {
    title: "Account & Security",
    icon: LockKeyhole,
    items: [
      ["How is my information protected?", "Your account details and financial information are handled through secure account and payment processes with access controls in place."],
      ["How do I verify my account?", "Follow the verification steps shown in your profile. You may be asked to confirm details before accessing certain opportunities or payment features."],
      ["Can I update my profile information?", "Yes. Open your profile settings to update eligible account information and keep your contributor details current."],
      ["What happens if I forget my password?", "Use the password recovery option on the sign-in screen to securely reset your password and regain access to your account."],
    ],
  },
  {
    title: "Support",
    icon: Headphones,
    items: [
      ["How do I contact support?", "Use the Contact Support option in the Help Center or the support link in the footer to request assistance."],
      ["How quickly does support respond?", "Response times vary by request type. Your support request will include the next steps and any information needed to help resolve it."],
      ["Where can I report an issue?", "Open a support request and select the category that best matches the issue so it can be directed to the right team."],
      ["How do I submit feedback?", "Contact support with your feedback, assignment reference, and any relevant details so the team can review it."],
    ],
  },
];

const helpCards = [
  ["Account Assistance", "Profile, eligibility, and verification help.", UserCheck],
  ["Payment Support", "Wallets, rewards, and withdrawals.", WalletCards],
  ["Assignment Support", "Assignment instructions and reviews.", ClipboardList],
  ["Technical Support", "Workspace and access troubleshooting.", Wrench],
] as const;

const resources = [
  ["Contributor Guide", "Start here for account and program basics.", BookOpen],
  ["Payment Guide", "Understand balances, rewards, and withdrawals.", CreditCard],
  ["Assignment Standards", "Review expectations before submitting work.", FileCheck2],
  ["Community Guidelines", "Learn how contributors work together.", ShieldCheck],
] as const;

function SectionEyebrow({ children }: { children: string }) {
  return <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange">{children}</p>;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/ /g, "-").replace(/&/g, "and");
}

function SupportTopbar() {
  return <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3"><div className="flex items-center gap-2"><div className="flex gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-200" /><span className="h-2 w-2 rounded-full bg-slate-200" /><span className="h-2 w-2 rounded-full bg-slate-200" /></div><div className="ml-2 hidden h-5 w-32 items-center rounded bg-slate-50 px-2 text-[8px] text-slate-400 sm:flex">help.amazon.com</div></div><div className="flex items-center gap-3 text-slate-400"><Search size={13} /><Bell size={13} /><span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[8px] font-bold text-white">AS</span></div></div>;
}

function SupportSidebar() {
  return <aside className="hidden w-[130px] shrink-0 border-r border-slate-200 bg-[#fbfcfd] px-3 py-4 sm:block"><div className="mb-5 flex items-center gap-1.5 px-1 text-[9px] font-bold text-navy"><span className="flex h-4 w-4 items-center justify-center rounded bg-orange text-[8px]">a</span> help center</div><div className="space-y-1 text-[9px] font-medium text-slate-500">{[[LayoutDashboard, "Overview"], [HelpCircle, "Getting Started"], [ClipboardList, "Assignments"], [CircleDollarSign, "Payments"], [LockKeyhole, "Account Security"]].map(([Icon, label], index) => { const ItemIcon = Icon as typeof LayoutDashboard; return <div key={label as string} className={`flex items-center gap-2 rounded px-2 py-2 ${index === 0 ? "bg-orange/10 font-bold text-orange" : ""}`}><ItemIcon size={11} />{label as string}</div>; })}</div><div className="mt-8 border-t border-slate-200 pt-3 text-[8px] text-slate-400"><MessageSquare size={11} className="mb-1 text-slate-500" />Contact support</div></aside>;
}

function SupportDashboard() {
  return <div className="relative mx-auto w-full max-w-[610px] overflow-hidden rounded-xl border border-white/15 bg-[#f7f9fb] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-3"><div className="absolute -right-3 top-12 z-20 hidden items-center gap-2 rounded-md border border-white/15 bg-[#152638] px-3 py-2 text-[9px] font-semibold text-white shadow-xl sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Support available</div><SupportTopbar /><div className="flex min-h-[325px]"><SupportSidebar /><div className="min-w-0 flex-1 bg-[#f8fafc] p-3 sm:p-4"><div className="flex items-center justify-between"><div><p className="text-[8px] text-slate-400">Contributor Help Center</p><p className="mt-1 text-sm font-extrabold text-navy sm:text-base">How can we help?</p></div><span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange/10 text-orange"><Bell size={13} /></span></div><div className="mt-4 flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2.5 text-[9px] text-slate-400"><Search size={12} className="text-orange" /> Search support articles, guides, and resources</div><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{[["Support Articles", "128", FileSearch], ["Contributor Resources", "24", BookOpen], ["Help Center", "Always open", HelpCircle], ["Account Assistance", "Get help", UserCheck]].map(([label, value, Icon]) => { const ItemIcon = Icon as typeof FileSearch; return <div key={label as string} className="rounded-md border border-slate-200 bg-white p-2.5"><ItemIcon size={14} className="text-orange" /><p className="mt-2 text-[7px] font-bold text-slate-500">{label as string}</p><p className="mt-1 truncate text-[9px] font-extrabold text-navy">{value as string}</p></div>; })}</div><div className="mt-3 rounded-md border border-slate-200 bg-white p-3"><div className="flex items-center justify-between"><p className="text-[8px] font-bold text-navy">Popular help topics</p><MoreHorizontal size={13} className="text-slate-400" /></div><div className="mt-2 grid gap-2 sm:grid-cols-2">{[["How to access assignments", "Assignments", ClipboardList], ["Understanding your rewards", "Payments & Rewards", CircleDollarSign], ["Verify your contributor account", "Account & Security", ShieldCheck], ["Contact contributor support", "Support", Headphones]].map(([title, category, Icon]) => { const ItemIcon = Icon as typeof ClipboardList; return <div key={title as string} className="flex items-center gap-2 rounded bg-[#fbfcfd] p-2"><ItemIcon size={12} className="text-orange" /><div><p className="text-[8px] font-bold text-navy">{title as string}</p><p className="mt-0.5 text-[7px] text-slate-400">{category as string}</p></div></div>; })}</div></div></div></div></div>;
}

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return <div className="min-h-screen overflow-x-hidden bg-[#f8f9fa] text-ink"><SiteHeader active="faq" /><main>
    <section className="relative overflow-hidden bg-navy text-white"><div className="absolute -right-40 -top-48 h-[520px] w-[520px] rounded-full border border-white/[0.05]" /><div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-orange/[0.07] blur-3xl" /><div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12 lg:px-8 lg:py-20"><div className="relative z-10 max-w-[480px]"><SectionEyebrow>FAQ</SectionEyebrow><h1 className="text-[42px] font-extrabold leading-[1.06] tracking-[-0.045em] sm:text-[56px]">Frequently Asked Questions</h1><p className="mt-6 max-w-[450px] text-base leading-7 text-white/65">Find answers to common questions about assignments, payments, contributor accounts, eligibility, rewards, and participation in the Contributor Program.</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/apply" className="inline-flex items-center gap-2 rounded-md bg-orange px-6 py-3.5 text-sm font-extrabold text-navy transition hover:-translate-y-0.5 hover:bg-orange-light">Apply now <ArrowRight size={16} /></Link><Link to="/contact" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition hover:border-orange hover:text-orange">Contact support <ArrowRight size={15} /></Link></div><div className="mt-8 flex items-center gap-2 text-xs font-medium text-white/60"><ShieldCheck size={16} className="text-orange" /> Clear answers from a trusted contributor workspace</div></div><SupportDashboard /></div></section>

    <section className="bg-white px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="text-center"><SectionEyebrow>Browse by topic</SectionEyebrow><h2 className="section-title">How can we help?</h2><p className="mx-auto mt-3 max-w-[560px] text-sm leading-6 text-slate-500">Find the right information quickly with support organized around your contributor journey.</p></div><div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{categories.map(({ title, description, icon: Icon }) => <Link key={title} to={`#${slugify(title)}`} className="group rounded-lg border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-orange/40 hover:shadow-elevated"><span className="flex h-10 w-10 items-center justify-center rounded-md bg-orange/10 text-orange transition group-hover:bg-orange group-hover:text-navy"><Icon size={19} /></span><h3 className="mt-5 text-sm font-extrabold text-navy">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{description}</p><span className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold text-navy transition group-hover:text-orange">View questions <ArrowRight size={12} /></span></Link>)}</div></div></section>

    <section id="questions" className="bg-[#f8f9fa] px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-[1020px]"><div className="text-center"><SectionEyebrow>Support library</SectionEyebrow><h2 className="section-title">Frequently asked questions</h2><p className="mx-auto mt-3 max-w-[550px] text-sm leading-6 text-slate-500">Everything you need to understand the program, complete assignments, and manage your account.</p></div><div className="mt-10 space-y-4">{faqGroups.map(({ title, icon: Icon, items }) => { const groupId = slugify(title); return <section id={groupId} key={title} className="rounded-xl border border-slate-200 bg-white shadow-card"><div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4"><span className="flex h-8 w-8 items-center justify-center rounded-md bg-orange/10 text-orange"><Icon size={16} /></span><h3 className="text-sm font-extrabold text-navy">{title}</h3><span className="ml-auto text-[10px] font-semibold text-slate-400">{items.length} questions</span></div><div className="divide-y divide-slate-100 px-5">{items.map(([question, answer], index) => { const faqId = `${groupId}-${index}`; const isOpen = openFaq === faqId; return <div key={question}><button type="button" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? null : faqId)} className="flex w-full items-center justify-between gap-4 py-5 text-left text-xs font-bold text-navy sm:text-sm">{question}<ChevronDown size={17} className={`shrink-0 text-slate-400 transition ${isOpen ? "rotate-180 text-orange" : ""}`} /></button>{isOpen && <p className="-mt-1 max-w-[860px] pb-5 pr-8 text-xs leading-6 text-slate-500">{answer}</p>}</div>; })}</div></section>; })}</div></div></section>

    <section className="bg-white px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="text-center"><SectionEyebrow>Direct support</SectionEyebrow><h2 className="section-title">Still need help?</h2><p className="mx-auto mt-3 max-w-[560px] text-sm leading-6 text-slate-500">Choose the support path that best matches what you need today.</p></div><div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{helpCards.map(([title, description, Icon]) => <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-orange/40 hover:shadow-elevated"><span className="flex h-10 w-10 items-center justify-center rounded-md bg-orange/10 text-orange"><Icon size={19} /></span><h3 className="mt-5 text-sm font-extrabold text-navy">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{description}</p><Link to="/contact" className="mt-5 inline-flex items-center gap-1 text-[10px] font-bold text-navy transition hover:text-orange">Contact support <ArrowRight size={12} /></Link></div>)}</div></div></section>

    <section className="bg-[#f8f9fa] px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><SectionEyebrow>Keep learning</SectionEyebrow><h2 className="section-title">Helpful resources</h2><p className="mt-3 max-w-[560px] text-sm leading-6 text-slate-500">Practical guides to help you work confidently and make the most of your contributor account.</p></div><Link to="/how-it-works" className="inline-flex items-center gap-1 text-xs font-bold text-navy transition hover:text-orange">See how it works <ArrowRight size={14} /></Link></div><div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{resources.map(([title, description, Icon]) => <Link key={title} to="/contact" className="group rounded-lg border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-orange/40 hover:shadow-elevated"><span className="flex h-10 w-10 items-center justify-center rounded-md bg-navy/5 text-navy transition group-hover:bg-orange/10 group-hover:text-orange"><Icon size={19} /></span><h3 className="mt-5 text-sm font-extrabold text-navy">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{description}</p><span className="mt-5 inline-flex items-center gap-1 text-[10px] font-bold text-navy transition group-hover:text-orange">Read resource <ArrowRight size={12} /></span></Link>)}</div></div></section>

    <section id="apply" className="bg-gradient-to-r from-navy to-[#1b3247] px-5 py-14 text-white sm:px-8 lg:py-16"><div className="mx-auto flex max-w-[1020px] flex-col items-center justify-between gap-7 text-center sm:flex-row sm:text-left"><div><SectionEyebrow>We are here to help</SectionEyebrow><h2 className="max-w-[650px] text-[28px] font-extrabold tracking-[-0.035em] sm:text-[34px]">Need additional assistance?</h2><p className="mt-2 max-w-[540px] text-sm text-white/60">Our support team is available to help you with your account, assignments, and payment questions.</p></div><div className="flex flex-wrap justify-center gap-3"><Link to="/contact" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition hover:border-orange hover:text-orange">Contact support <ArrowRight size={15} /></Link><Link to="/apply" className="inline-flex items-center gap-2 rounded-md bg-orange px-7 py-3.5 text-sm font-extrabold text-navy transition hover:-translate-y-0.5 hover:bg-orange-light">Apply now <ArrowRight size={16} /></Link></div></div></section>
  </main><SiteFooter /></div>;
}
