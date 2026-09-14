import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  Bell,
  CheckCircle,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Eye,
  FileCheck2,
  FileSearch,
  Globe2,
  Grid2x2,
  LayoutDashboard,
  Medal,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Trophy,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

const featuredStories = [
  { initials: "SM", name: "Sarah M.", location: "United States", since: "2024", assignments: "247", earnings: "$14,850", level: "Gold Contributor", accent: "orange" },
  { initials: "MT", name: "Michael T.", location: "Canada", since: "2023", assignments: "386", earnings: "$21,450", level: "Platinum Contributor", accent: "blue" },
  { initials: "ER", name: "Emily R.", location: "United Kingdom", since: "2024", assignments: "193", earnings: "$12,375", level: "Silver Contributor", accent: "violet" },
];

const milestones = [
  { title: "Bronze Contributor", target: "25 Assignments Completed", icon: Medal, tone: "bronze", progress: "25%" },
  { title: "Silver Contributor", target: "100 Assignments Completed", icon: Award, tone: "silver", progress: "42%" },
  { title: "Gold Contributor", target: "250 Assignments Completed", icon: Trophy, tone: "gold", progress: "68%" },
  { title: "Platinum Contributor", target: "500 Assignments Completed", icon: ShieldCheck, tone: "platinum", progress: "84%" },
  { title: "Elite Contributor", target: "1000+ Assignments Completed", icon: Sparkles, tone: "elite", progress: "100%" },
];

const impactStats = [
  { value: "250K+", label: "Active Contributors", icon: UsersRound },
  { value: "12M+", label: "Assignments Completed", icon: CheckCircle },
  { value: "96%", label: "Approval Rate", icon: ShieldCheck },
  { value: "$50M+", label: "Compensation Distributed", icon: CircleDollarSign },
  { value: "100+", label: "Countries Represented", icon: Globe2 },
];

const growthStories = [
  { initials: "SM", name: "Sarah M.", level: "Gold Contributor", monthOne: "$450", monthSix: "$2,300", monthTwelve: "$5,800", approval: "98.4%", color: "#ff9900", points: "M0 68 C24 65, 34 52, 57 58 S93 57, 113 43 S145 46, 164 37 S197 39, 220 14" },
  { initials: "MT", name: "Michael T.", level: "Platinum Contributor", monthOne: "$600", monthSix: "$3,200", monthTwelve: "$7,200", approval: "99.1%", color: "#4e8bc1", points: "M0 70 C25 68, 34 55, 58 57 S89 49, 112 43 S146 28, 165 32 S195 16, 220 5" },
  { initials: "ER", name: "Emily R.", level: "Silver Contributor", monthOne: "$350", monthSix: "$1,800", monthTwelve: "$5,100", approval: "97.6%", color: "#8b6bc9", points: "M0 72 C22 72, 37 59, 56 62 S91 54, 112 52 S141 44, 162 31 S192 28, 220 12" },
];

const benefits = [
  ["Flexible Schedule", "Choose when and how often you contribute.", Clock3],
  ["Remote Participation", "Access opportunities wherever you work.", Globe2],
  ["Competitive Rewards", "Earn more as your experience grows.", CircleDollarSign],
  ["Transparent Tracking", "See progress, status, and milestones clearly.", BarChart3],
  ["Secure Payments", "Receive compensation through trusted methods.", WalletCards],
  ["Regular Opportunities", "Find new assignments that fit your profile.", Grid2x2],
  ["Professional Growth", "Build skills through meaningful work.", TrendingUp],
  ["Dedicated Support", "Get help whenever you need it.", MessageSquare],
] as const;

const achievements = [
  ["Top Product Research Contributor", "Consistent insight across 120 research assignments", FileSearch],
  ["Top Marketplace Evaluator", "Recognized for accurate, actionable recommendations", BarChart3],
  ["Top Customer Experience Tester", "Outstanding end-to-end experience reporting", Eye],
  ["Top Content Quality Reviewer", "Trusted quality across high-volume reviews", FileCheck2],
  ["Highest Approval Rate", "A 99.8% approval rate across the last 12 months", ShieldCheck],
  ["Most Improved Contributor", "Fastest growth from beginner to advanced work", ArrowUpRight],
] as const;

const faqs = [
  { question: "How do contributors progress through the program?", answer: "Contributors build experience by completing quality assignments, maintaining a strong approval rate, and taking on opportunities with increasing scope and complexity." },
  { question: "How are contributor achievements tracked?", answer: "Assignments completed, approval rates, earnings, and milestone progress are recorded in your contributor dashboard and updated as work is approved." },
  { question: "Can contributors qualify for premium assignments?", answer: "Yes. Consistent quality, relevant experience, and a strong track record can unlock opportunities with higher complexity and reward ranges." },
  { question: "How are milestone levels earned?", answer: "Milestone levels are based primarily on completed approved assignments, with quality and account standing helping keep your progress meaningful." },
  { question: "Are there opportunities for long-term participation?", answer: "Yes. Contributors can continue to browse available assignments, deepen their expertise, and grow into more advanced program opportunities over time." },
];

function SectionEyebrow({ children }: { children: string }) {
  return <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange">{children}</p>;
}

function AnalyticsTopbar() {
  return <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3"><div className="flex items-center gap-2"><div className="flex gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-200" /><span className="h-2 w-2 rounded-full bg-slate-200" /><span className="h-2 w-2 rounded-full bg-slate-200" /></div><div className="ml-2 hidden h-5 w-32 items-center rounded bg-slate-50 px-2 text-[8px] text-slate-400 sm:flex">contributor.amazon.com</div></div><div className="flex items-center gap-3 text-slate-400"><Search size={13} /><Bell size={13} /><span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[8px] font-bold text-white">AS</span></div></div>;
}

function AnalyticsSidebar() {
  return <aside className="hidden w-[128px] shrink-0 border-r border-slate-200 bg-[#fbfcfd] px-3 py-4 sm:block"><div className="mb-5 flex items-center gap-1.5 px-1 text-[9px] font-bold text-navy"><span className="flex h-4 w-4 items-center justify-center rounded bg-orange text-[8px]">a</span> contributor</div><div className="space-y-1 text-[9px] font-medium text-slate-500">{[[LayoutDashboard, "Overview"], [Grid2x2, "Assignments"], [WalletCards, "Earnings"], [Trophy, "Achievements"], [UsersRound, "Profile"]].map(([Icon, label], index) => { const ItemIcon = Icon as typeof LayoutDashboard; return <div key={label as string} className={`flex items-center gap-2 rounded px-2 py-2 ${index === 3 ? "bg-orange/10 font-bold text-orange" : ""}`}><ItemIcon size={11} />{label as string}</div>; })}</div><div className="mt-8 border-t border-slate-200 pt-3 text-[8px] text-slate-400"><ShieldCheck size={11} className="mb-1 text-slate-500" />Help & Support</div></aside>;
}

function HeroGrowthChart() {
  return <div className="relative h-[96px] overflow-hidden pt-2"><div className="absolute inset-x-0 top-5 border-t border-dashed border-slate-200" /><div className="absolute inset-x-0 top-11 border-t border-dashed border-slate-200" /><div className="absolute inset-x-0 top-[68px] border-t border-dashed border-slate-200" /><svg viewBox="0 0 310 82" preserveAspectRatio="none" className="relative h-full w-full"><path d="M0 67 C19 62, 30 50, 46 58 S72 55, 91 47 S112 50, 127 42 S149 40, 163 33 S184 39, 200 26 S221 30, 239 20 S264 25, 279 11 S299 13, 310 2" fill="none" stroke="#ff9900" strokeWidth="2.5" /><path d="M0 67 C19 62, 30 50, 46 58 S72 55, 91 47 S112 50, 127 42 S149 40, 163 33 S184 39, 200 26 S221 30, 239 20 S264 25, 279 11 S299 13, 310 2 V82 H0Z" fill="url(#successFill)" opacity=".14" /><defs><linearGradient id="successFill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#ff9900" /><stop offset="1" stopColor="#ff9900" stopOpacity="0" /></linearGradient></defs></svg></div>;
}

function SuccessDashboard() {
  return <div className="relative mx-auto w-full max-w-[610px] overflow-hidden rounded-xl border border-white/15 bg-[#f7f9fb] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-3"><div className="absolute -right-3 top-12 z-20 hidden items-center gap-2 rounded-md border border-white/15 bg-[#152638] px-3 py-2 text-[9px] font-semibold text-white shadow-xl sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Milestone unlocked</div><AnalyticsTopbar /><div className="flex min-h-[310px]"><AnalyticsSidebar /><div className="min-w-0 flex-1 bg-[#f8fafc] p-3 sm:p-4"><div className="flex items-center justify-between"><div><p className="text-[8px] text-slate-400">Tuesday, June 18, 2024</p><p className="mt-1 text-sm font-extrabold text-navy sm:text-base">Your contributor progress</p></div><span className="rounded-full bg-orange/10 px-2.5 py-1 text-[8px] font-bold text-orange">Gold level</span></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{[["Total Earnings", "$14,850", "↑ 18.4%"], ["Completed", "247", "12 this month"], ["Success Rate", "98.4%", "Excellent"], ["Contributor Level", "Gold", "68% to Platinum"]].map(([label, value, hint], index) => <div key={label} className="rounded-md border border-slate-200 bg-white p-2.5"><p className="text-[7px] text-slate-400">{label}</p><p className={`mt-1 text-sm font-extrabold ${index === 3 ? "text-orange" : "text-navy"}`}>{value}</p><p className="mt-1 text-[7px] text-emerald-600">{hint}</p></div>)}</div><div className="mt-3 grid gap-2 sm:grid-cols-[1.15fr_0.85fr]"><div className="rounded-md border border-slate-200 bg-white p-3"><div className="flex items-center justify-between"><div><p className="text-[8px] font-bold text-navy">Earnings growth</p><p className="mt-1 text-[7px] text-slate-400">Last 12 months</p></div><p className="text-[7px] font-semibold text-slate-400">This year⌄</p></div><HeroGrowthChart /><div className="flex justify-between text-[7px] text-slate-400"><span>Jul</span><span>Sep</span><span>Nov</span><span>Jan</span><span>Jun</span></div></div><div className="rounded-md border border-slate-200 bg-white p-3"><p className="text-[8px] font-bold text-navy">Achievement progress</p><div className="mt-3 flex items-center gap-3"><div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full" style={{ background: "conic-gradient(#ff9900 0deg 244deg, #e6ebef 244deg 360deg)" }}><div className="flex h-[54px] w-[54px] flex-col items-center justify-center rounded-full bg-white"><Trophy size={13} className="text-orange" /><span className="mt-0.5 text-[7px] text-slate-400">Gold</span></div></div><div className="min-w-0"><p className="text-lg font-extrabold text-navy">247</p><p className="text-[7px] text-slate-400">assignments completed</p><div className="mt-2 h-1.5 w-full rounded-full bg-slate-100"><div className="h-1.5 w-[68%] rounded-full bg-orange" /></div></div></div></div></div></div></div></div>;
}

function GrowthCard({ story }: { story: (typeof growthStories)[number] }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-elevated"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-xs font-extrabold text-white">{story.initials}</span><div><h3 className="text-sm font-extrabold text-navy">{story.name}</h3><p className="mt-0.5 text-[10px] text-slate-400">{story.level}</p></div></div><TrendingUp size={17} style={{ color: story.color }} /></div><div className="mt-5 rounded-lg bg-[#f8fafc] p-3"><div className="flex items-center justify-between"><div><p className="text-[9px] font-bold text-navy">Earnings growth</p><p className="mt-1 text-[8px] text-slate-400">12 month journey</p></div><span className="text-xs font-extrabold" style={{ color: story.color }}>{story.monthTwelve}</span></div><svg viewBox="0 0 220 78" preserveAspectRatio="none" className="mt-3 h-[78px] w-full"><path d={story.points} fill="none" stroke={story.color} strokeWidth="2.5" /><path d={`${story.points} V78 H0Z`} fill={story.color} opacity=".09" /></svg><div className="flex justify-between text-[8px] text-slate-400"><span>Month 1 <b className="ml-1 text-navy">{story.monthOne}</b></span><span>Month 6 <b className="ml-1 text-navy">{story.monthSix}</b></span><span>Month 12 <b className="ml-1 text-navy">{story.monthTwelve}</b></span></div></div><div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4"><div><p className="text-[9px] text-slate-400">Approval rate</p><p className="mt-1 text-sm font-extrabold text-navy">{story.approval}</p></div><div><p className="text-[9px] text-slate-400">Current level</p><p className="mt-1 text-sm font-extrabold text-navy">{story.level.split(" ")[0]}</p></div></div></article>;
}

export default function SuccessStories() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return <div className="min-h-screen overflow-x-hidden bg-[#f8f9fa] text-ink"><SiteHeader active="success-stories" /><main>
    <section className="relative overflow-hidden bg-navy text-white"><div className="absolute -right-40 -top-48 h-[520px] w-[520px] rounded-full border border-white/[0.05]" /><div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-orange/[0.07] blur-3xl" /><div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12 lg:px-8 lg:py-20"><div className="relative z-10 max-w-[480px]"><SectionEyebrow>Success stories</SectionEyebrow><h1 className="text-[42px] font-extrabold leading-[1.06] tracking-[-0.045em] sm:text-[56px]">Real Contributors.<span className="block text-orange">Real Achievements.</span></h1><p className="mt-6 max-w-[450px] text-base leading-7 text-white/65">Discover how contributors around the world are earning rewards, developing valuable skills, and participating in meaningful assignments through the Contributor Program.</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/apply" className="inline-flex items-center gap-2 rounded-md bg-orange px-6 py-3.5 text-sm font-extrabold text-navy transition hover:-translate-y-0.5 hover:bg-orange-light">Apply now <ArrowRight size={16} /></Link><Link to="/#opportunities" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition hover:border-orange hover:text-orange">View opportunities <ArrowRight size={15} /></Link></div><div className="mt-8 flex items-center gap-2 text-xs font-medium text-white/60"><ShieldCheck size={16} className="text-orange" /> A community built on quality and progress</div></div><SuccessDashboard /></div></section>

    <section className="bg-white px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="text-center"><SectionEyebrow>Progress worth celebrating</SectionEyebrow><h2 className="section-title">Featured contributor journeys</h2><p className="mx-auto mt-3 max-w-[560px] text-sm leading-6 text-slate-500">Every achievement starts with one assignment and grows through consistent, meaningful work.</p></div><div className="mt-10 grid gap-4 lg:grid-cols-3">{featuredStories.map((story) => <article key={story.name} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-elevated sm:p-6"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><span className={`flex h-12 w-12 items-center justify-center rounded-full font-extrabold text-white ${story.accent === "orange" ? "bg-orange text-navy" : story.accent === "blue" ? "bg-[#3976aa]" : "bg-[#8064b6]"}`}>{story.initials}</span><div><h3 className="text-sm font-extrabold text-navy">{story.name}</h3><p className="mt-1 text-xs text-slate-400">{story.location}</p></div></div><span className="flex items-center gap-1 rounded-full bg-orange/10 px-2.5 py-1 text-[9px] font-bold text-orange"><Trophy size={11} /> {story.level}</span></div><p className="mt-6 text-sm leading-6 text-slate-600">{story.name === "Sarah M." ? "Started with product research assignments and progressed into premium marketplace evaluation projects." : story.name === "Michael T." ? "Focused on customer experience testing and advanced content quality assessments." : "Built expertise in product feedback and marketplace analysis assignments."}</p><div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5"><div><p className="text-[9px] uppercase tracking-wide text-slate-400">Since</p><p className="mt-1 text-sm font-extrabold text-navy">{story.since}</p></div><div><p className="text-[9px] uppercase tracking-wide text-slate-400">Completed</p><p className="mt-1 text-sm font-extrabold text-navy">{story.assignments}</p></div><div><p className="text-[9px] uppercase tracking-wide text-slate-400">Earnings</p><p className="mt-1 text-sm font-extrabold text-orange">{story.earnings}</p></div></div><div className="mt-5 flex items-center gap-2 text-[10px] font-semibold text-slate-500"><CheckCircle size={14} className="text-emerald-600" /> Verified contributor milestone <ArrowUpRight size={13} className="ml-auto text-slate-300" /></div></article>)}</div></div></section>

    <section className="bg-[#f8f9fa] px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="text-center"><SectionEyebrow>Earn your next level</SectionEyebrow><h2 className="section-title">Contributor milestones</h2><p className="mx-auto mt-3 max-w-[560px] text-sm leading-6 text-slate-500">A clear progression system recognizes the experience you build over time.</p></div><div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{milestones.map(({ title, target, icon: Icon, tone, progress }) => <div key={title} className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-card transition hover:-translate-y-1 hover:shadow-elevated"><div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${tone === "gold" ? "bg-orange/15 text-orange" : tone === "elite" ? "bg-navy text-orange" : tone === "platinum" ? "bg-slate-100 text-slate-600" : tone === "silver" ? "bg-slate-100 text-slate-500" : "bg-[#f4ead9] text-[#aa783b]"}`}><Icon size={24} /></div><h3 className="mt-5 text-sm font-extrabold text-navy">{title}</h3><p className="mt-2 text-[10px] leading-4 text-slate-500">{target}</p><div className="mt-5 h-1.5 rounded-full bg-slate-100"><div className={`h-1.5 rounded-full ${tone === "elite" ? "bg-orange" : "bg-navy"}`} style={{ width: progress }} /></div><p className="mt-2 text-[9px] text-slate-400">Achievement level</p></div>)}</div></div></section>

    <section className="bg-navy px-5 py-16 text-white sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="text-center"><SectionEyebrow>Measured at scale</SectionEyebrow><h2 className="text-[30px] font-extrabold tracking-[-0.035em] sm:text-[36px]">The impact of our contributor community</h2><p className="mx-auto mt-3 max-w-[560px] text-sm leading-6 text-white/55">Together, contributors are helping improve experiences for customers around the world.</p></div><div className="relative mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{impactStats.map(({ value, label, icon: Icon }) => <div key={label} className="rounded-lg border border-white/10 bg-white/[0.05] p-5 text-center transition hover:-translate-y-1 hover:border-orange/40"><Icon size={21} className="mx-auto text-orange" /><p className="mt-4 text-2xl font-extrabold tracking-[-0.04em] text-orange">{value}</p><p className="mt-1 text-xs font-bold text-white">{label}</p></div>)}</div></div></section>

    <section className="bg-white px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="text-center"><SectionEyebrow>Consistency compounds</SectionEyebrow><h2 className="section-title">Growth over time</h2><p className="mx-auto mt-3 max-w-[560px] text-sm leading-6 text-slate-500">See how contributors turn early momentum into lasting progress.</p></div><div className="mt-10 grid gap-4 lg:grid-cols-3">{growthStories.map((story) => <GrowthCard key={story.name} story={story} />)}</div></div></section>

    <section className="bg-[#f8f9fa] px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="text-center"><SectionEyebrow>Designed for the long term</SectionEyebrow><h2 className="section-title">Why contributors stay</h2><p className="mx-auto mt-3 max-w-[560px] text-sm leading-6 text-slate-500">The program gives you the flexibility, visibility, and support to keep moving forward.</p></div><div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{benefits.map(([title, description, Icon]) => <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-orange/40"><span className="flex h-10 w-10 items-center justify-center rounded-md bg-orange/10 text-orange"><Icon size={19} /></span><h3 className="mt-5 text-sm font-extrabold text-navy">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{description}</p></div>)}</div></div></section>

    <section className="bg-white px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><SectionEyebrow>Recognition in action</SectionEyebrow><h2 className="section-title">Community achievements</h2><p className="mt-3 max-w-[560px] text-sm leading-6 text-slate-500">From quality leaders to fast learners, every kind of progress matters.</p></div><div className="hidden items-center gap-2 text-xs font-semibold text-slate-400 sm:flex"><Award size={15} className="text-orange" /> Updated monthly</div></div><div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{achievements.map(([title, description, Icon], index) => <div key={title} className="flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-elevated"><span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-orange/10 text-orange"><Icon size={20} /><span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[8px] font-bold text-white">{index + 1}</span></span><div><h3 className="text-xs font-extrabold leading-4 text-navy">{title}</h3><p className="mt-2 text-[10px] leading-4 text-slate-500">{description}</p></div></div>)}</div></div></section>

    <section id="faq" className="bg-[#f8f9fa] px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto grid max-w-[1020px] gap-10 md:grid-cols-[0.7fr_1.3fr] md:gap-16"><div><SectionEyebrow>Need help?</SectionEyebrow><h2 className="section-title">Frequently asked questions</h2><p className="mt-4 text-sm leading-6 text-slate-500">Learn more about progress, recognition, and long-term participation.</p></div><div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white px-5 shadow-card">{faqs.map(({ question, answer }, index) => { const isOpen = openFaq === index; return <div key={question}><button type="button" onClick={() => setOpenFaq(isOpen ? null : index)} className="flex w-full items-center justify-between gap-4 py-5 text-left text-xs font-bold text-navy sm:text-sm">{question}<ChevronDown size={17} className={`shrink-0 text-slate-400 transition ${isOpen ? "rotate-180 text-orange" : ""}`} /></button>{isOpen && <p className="-mt-1 pb-5 pr-8 text-xs leading-5 text-slate-500">{answer}</p>}</div>; })}</div></div></section>

    <section id="apply" className="bg-gradient-to-r from-navy to-[#1b3247] px-5 py-14 text-white sm:px-8 lg:py-16"><div className="mx-auto flex max-w-[1020px] flex-col items-center justify-between gap-7 text-center sm:flex-row sm:text-left"><div><SectionEyebrow>Your next chapter</SectionEyebrow><h2 className="text-[28px] font-extrabold tracking-[-0.035em] sm:text-[34px]">Start your success story today</h2><p className="mt-2 max-w-[540px] text-sm text-white/60">Join thousands of contributors earning rewards through flexible assignments and meaningful opportunities.</p></div><div className="flex flex-wrap justify-center gap-3"><Link to="/contact" className="inline-flex items-center gap-2 rounded-md bg-orange px-7 py-3.5 text-sm font-extrabold text-navy transition hover:-translate-y-0.5 hover:bg-orange-light">Apply now <ArrowRight size={16} /></Link><Link to="/#opportunities" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition hover:border-orange hover:text-orange">Browse opportunities <ArrowRight size={15} /></Link></div></div></section>
  </main><SiteFooter /></div>;
}
