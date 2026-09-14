import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CheckCircle,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  CreditCard,
  FileCheck2,
  Globe2,
  Headphones,
  HelpCircle,
  LayoutDashboard,
  LifeBuoy,
  LockKeyhole,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Search,
  Send,
  ShieldCheck,
  UserCheck,
  UsersRound,
  WalletCards,
  Wrench,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { FORM_SUBMISSION_ERROR, submitForm } from "@/lib/form-submission";
import { useAuth } from "@/lib/auth";

const contactOptions = [
  ["Contributor Support", "Questions about assignments, participation, and contributor accounts.", "Support@Amazon.com", UserCheck],
  ["Payments Support", "Questions regarding earnings, rewards, and withdrawals.", "Support@Amazon.com", WalletCards],
  ["Technical Support", "Issues with the website, dashboard, or account access.", "Support@Amazon.com", Wrench],
  ["General Inquiries", "General questions and information requests.", "Support@Amazon.com", Mail],
] as const;

const availability = [
  ["Account Support", "24/7 Online Assistance", UserCheck],
  ["Payment Assistance", "Dedicated Payment Team", CircleDollarSign],
  ["Technical Help", "Platform Support Specialists", Wrench],
  ["Contributor Resources", "Knowledge Base Access", BookOpen],
] as const;

const resources = [
  ["FAQ Center", "Find answers to common program questions.", HelpCircle, "/faq"],
  ["Contributor Guide", "Learn how to apply and complete assignments.", BookOpen, "/how-it-works"],
  ["Payment Guide", "Understand rewards, balances, and withdrawals.", CreditCard, "/payments"],
  ["Assignment Standards", "Review quality expectations before you begin.", FileCheck2, "/how-it-works#assignment-workflow"],
] as const;

const initialForm = { name: "", email: "", subject: "", category: "Contributor Support", message: "" };

function SectionEyebrow({ children }: { children: string }) {
  return <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange">{children}</p>;
}

function SupportTopbar() {
  return <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3"><div className="flex items-center gap-2"><div className="flex gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-200" /><span className="h-2 w-2 rounded-full bg-slate-200" /><span className="h-2 w-2 rounded-full bg-slate-200" /></div><div className="ml-2 hidden h-5 w-32 items-center rounded bg-slate-50 px-2 text-[8px] text-slate-400 sm:flex">support.amazon.com</div></div><div className="flex items-center gap-3 text-slate-400"><Search size={13} /><Bell size={13} /><span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[8px] font-bold text-white">AS</span></div></div>;
}

function SupportSidebar() {
  return <aside className="hidden w-[130px] shrink-0 border-r border-slate-200 bg-[#fbfcfd] px-3 py-4 sm:block"><div className="mb-5 flex items-center gap-1.5 px-1 text-[9px] font-bold text-navy"><span className="flex h-4 w-4 items-center justify-center rounded bg-orange text-[8px]">a</span> support center</div><div className="space-y-1 text-[9px] font-medium text-slate-500">{[[LayoutDashboard, "Overview"], [LifeBuoy, "Open requests"], [MessageCircle, "Support tickets"], [BookOpen, "Resources"], [UserCheck, "Account"]].map(([Icon, label], index) => { const ItemIcon = Icon as typeof LayoutDashboard; return <div key={label as string} className={`flex items-center gap-2 rounded px-2 py-2 ${index === 0 ? "bg-orange/10 font-bold text-orange" : ""}`}><ItemIcon size={11} />{label as string}</div>; })}</div><div className="mt-8 border-t border-slate-200 pt-3 text-[8px] text-slate-400"><Headphones size={11} className="mb-1 text-slate-500" />Contact support</div></aside>;
}

function SupportDashboard() {
  return <div className="relative mx-auto w-full max-w-[610px] overflow-hidden rounded-xl border border-white/15 bg-[#f7f9fb] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-3"><div className="absolute -right-3 top-12 z-20 hidden items-center gap-2 rounded-md border border-white/15 bg-[#152638] px-3 py-2 text-[9px] font-semibold text-white shadow-xl sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Support available</div><SupportTopbar /><div className="flex min-h-[315px]"><SupportSidebar /><div className="min-w-0 flex-1 bg-[#f8fafc] p-3 sm:p-4"><div className="flex items-center justify-between"><div><p className="text-[8px] text-slate-400">Tuesday, June 18, 2024</p><p className="mt-1 text-sm font-extrabold text-navy sm:text-base">Support center overview</p></div><span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange/10 text-orange"><Bell size={13} /></span></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{[["Open Requests", "2", "Awaiting reply", LifeBuoy], ["Support Tickets", "12", "This month", MessageCircle], ["Response Times", "< 24h", "Average", Clock3], ["Help Center Resources", "128", "Available now", BookOpen]].map(([label, value, hint, Icon]) => { const ItemIcon = Icon as typeof LifeBuoy; return <div key={label as string} className="rounded-md border border-slate-200 bg-white p-2.5"><ItemIcon size={13} className="text-orange" /><p className="mt-2 text-[7px] text-slate-400">{label as string}</p><p className="mt-1 text-sm font-extrabold text-navy">{value as string}</p><p className="mt-1 text-[7px] text-emerald-600">{hint as string}</p></div>; })}</div><div className="mt-3 grid gap-2 sm:grid-cols-[1.1fr_0.9fr]"><div className="rounded-md border border-slate-200 bg-white p-3"><div className="flex items-center justify-between"><p className="text-[8px] font-bold text-navy">Recent support requests</p><MoreHorizontal size={13} className="text-slate-400" /></div><div className="mt-2 space-y-2">{[["Payment question", "PAY-1048", "In progress", "orange"], ["Account verification", "ACC-1022", "Resolved", "green"], ["Assignment clarification", "ASN-0994", "Resolved", "green"]].map(([title, id, status, tone]) => <div key={id} className="flex items-center gap-2 border-b border-slate-100 pb-1.5"><span className={`flex h-5 w-5 items-center justify-center rounded-full ${tone === "orange" ? "bg-orange/10 text-orange" : "bg-emerald-50 text-emerald-600"}`}><MessageCircle size={10} /></span><div className="min-w-0 flex-1"><p className="truncate text-[8px] font-bold text-slate-600">{title}</p><p className="mt-0.5 text-[7px] text-slate-400">{id}</p></div><span className={`text-[7px] font-semibold ${tone === "orange" ? "text-orange" : "text-emerald-600"}`}>{status}</span></div>)}</div></div><div className="rounded-md border border-slate-200 bg-white p-3"><div className="flex items-center justify-between"><p className="text-[8px] font-bold text-navy">Help center resources</p><Search size={12} className="text-slate-400" /></div><div className="mt-3 space-y-2">{[["Getting started", "24 articles"], ["Payments & rewards", "31 articles"], ["Assignments", "43 articles"], ["Account & security", "30 articles"]].map(([name, count]) => <div key={name} className="flex items-center justify-between rounded bg-[#fbfcfd] px-2 py-1.5 text-[8px]"><span className="flex items-center gap-1.5 font-semibold text-slate-600"><FileCheck2 size={10} className="text-orange" />{name}</span><span className="text-slate-400">{count}</span></div>)}</div></div></div></div></div></div>;
}

export default function Contact() {
  const { session } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setSubmitted(false);
    setSubmissionError("");
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setSubmissionError("");
    setIsSubmitting(true);
    try {
      await submitForm("contact", { ...form, userId: session?.user.id });
      setForm(initialForm);
      setSubmitted(true);
    } catch {
      setSubmissionError(FORM_SUBMISSION_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div className="min-h-screen overflow-x-hidden bg-[#f8f9fa] text-ink"><SiteHeader active="contact" /><main>
    <section className="relative overflow-hidden bg-navy text-white"><div className="absolute -right-40 -top-48 h-[520px] w-[520px] rounded-full border border-white/[0.05]" /><div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-orange/[0.07] blur-3xl" /><div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12 lg:px-8 lg:py-20"><div className="relative z-10 max-w-[480px]"><SectionEyebrow>Contact</SectionEyebrow><h1 className="text-[42px] font-extrabold leading-[1.06] tracking-[-0.045em] sm:text-[56px]">We’re Here to Help</h1><p className="mt-6 max-w-[450px] text-base leading-7 text-white/65">Get in touch with our support team for assistance with your account, assignments, payments, or general program questions.</p><div className="mt-8 flex flex-wrap gap-3"><a href="#contact-form" className="inline-flex items-center gap-2 rounded-md bg-orange px-6 py-3.5 text-sm font-extrabold text-navy transition hover:-translate-y-0.5 hover:bg-orange-light">Submit Request <ArrowRight size={16} /></a><Link to="/faq" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition hover:border-orange hover:text-orange">View FAQ <ArrowRight size={15} /></Link></div><div className="mt-8 flex items-center gap-2 text-xs font-medium text-white/60"><ShieldCheck size={16} className="text-orange" /> Trusted support for every contributor journey</div></div><SupportDashboard /></div></section>

    <section className="bg-white px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="text-center"><SectionEyebrow>Choose a support path</SectionEyebrow><h2 className="section-title">How can we help?</h2><p className="mx-auto mt-3 max-w-[560px] text-sm leading-6 text-slate-500">Connect directly with the team best equipped to answer your question.</p></div><div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{contactOptions.map(([title, description, email, Icon]) => <article key={title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-orange/40 hover:shadow-elevated"><span className="flex h-10 w-10 items-center justify-center rounded-md bg-orange/10 text-orange"><Icon size={19} /></span><h3 className="mt-5 text-sm font-extrabold text-navy">{title}</h3><p className="mt-2 min-h-[48px] text-xs leading-5 text-slate-500">{description}</p><span className="mt-5 block truncate text-[10px] font-bold text-navy">{email}</span></article>)}</div></div></section>

    <section id="contact-form" className="scroll-mt-20 bg-[#f8f9fa] px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16"><div><SectionEyebrow>Send a request</SectionEyebrow><h2 className="section-title">Send Us a Message</h2><p className="mt-4 text-sm leading-6 text-slate-500">Tell us what you need help with and our support team will route your request to the right place.</p><div className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-card"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-md bg-navy text-orange"><Headphones size={18} /></span><div><p className="text-xs font-bold text-navy">Support response time</p><p className="mt-1 text-[10px] text-slate-400">Most requests receive a reply within 24 hours.</p></div></div></div></div>{submissionError && <div className="mb-5 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-800" role="alert">{submissionError}</div>}<form onSubmit={handleSubmit} aria-busy={isSubmitting} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card sm:p-7"><div className="grid gap-5 sm:grid-cols-2"><label className="block"><span className="text-xs font-bold text-navy">Full name</span><input required value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Enter your full name" className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-[#fbfcfd] px-3 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-orange focus:ring-2 focus:ring-orange/10" /></label><label className="block"><span className="text-xs font-bold text-navy">Email address</span><input required type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="you@example.com" className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-[#fbfcfd] px-3 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-orange focus:ring-2 focus:ring-orange/10" /></label><label className="block"><span className="text-xs font-bold text-navy">Subject</span><input required value={form.subject} onChange={(event) => updateField("subject", event.target.value)} placeholder="How can we help?" className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-[#fbfcfd] px-3 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-orange focus:ring-2 focus:ring-orange/10" /></label><label className="block"><span className="text-xs font-bold text-navy">Category</span><select value={form.category} onChange={(event) => updateField("category", event.target.value)} className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-[#fbfcfd] px-3 text-sm text-navy outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/10"><option>Contributor Support</option><option>Payments Support</option><option>Technical Support</option><option>General Inquiries</option></select></label><label className="block sm:col-span-2"><span className="text-xs font-bold text-navy">Message</span><textarea required value={form.message} onChange={(event) => updateField("message", event.target.value)} placeholder="Share a few details about your question" rows={5} className="mt-2 w-full resize-none rounded-md border border-slate-200 bg-[#fbfcfd] px-3 py-3 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-orange focus:ring-2 focus:ring-orange/10" /></label></div><div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center"><p className={`text-xs ${submitted ? "font-semibold text-emerald-600" : "text-slate-400"}`}>{submitted ? "Request submitted. Our support team will be in touch." : "We’ll use your details only to respond to this request."}</p><button type="submit" className="inline-flex items-center gap-2 rounded-md bg-orange px-6 py-3 text-sm font-extrabold text-navy transition hover:-translate-y-0.5 hover:bg-orange-light">Submit request <Send size={15} /></button></div></form></div></section>

    <section className="bg-white px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="text-center"><SectionEyebrow>Support when you need it</SectionEyebrow><h2 className="section-title">Support availability</h2><p className="mx-auto mt-3 max-w-[560px] text-sm leading-6 text-slate-500">The right support channel is always within reach.</p></div><div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{availability.map(([title, description, Icon]) => <div key={title} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-elevated"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-navy text-orange"><Icon size={19} /></span><div><h3 className="text-sm font-extrabold text-navy">{title}</h3><p className="mt-1 text-xs text-slate-500">{description}</p></div></div>)}</div></div></section>

    <section className="bg-[#f8f9fa] px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><SectionEyebrow>Learn at your own pace</SectionEyebrow><h2 className="section-title">Explore self-service resources</h2><p className="mt-3 max-w-[560px] text-sm leading-6 text-slate-500">Get quick answers and practical guidance before opening a support request.</p></div><Link to="/faq" className="inline-flex items-center gap-1 text-xs font-bold text-navy transition hover:text-orange">Visit Help Center <ArrowRight size={14} /></Link></div><div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{resources.map(([title, description, Icon, href]) => <Link key={title} to={href} className="group rounded-lg border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-orange/40 hover:shadow-elevated"><span className="flex h-10 w-10 items-center justify-center rounded-md bg-navy/5 text-navy transition group-hover:bg-orange/10 group-hover:text-orange"><Icon size={19} /></span><h3 className="mt-5 text-sm font-extrabold text-navy">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{description}</p><span className="mt-5 inline-flex items-center gap-1 text-[10px] font-bold text-navy transition group-hover:text-orange">Open resource <ChevronRight size={12} /></span></Link>)}</div></div></section>

    <section className="bg-navy px-5 py-16 text-white sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="text-center"><SectionEyebrow>Our commitment</SectionEyebrow><h2 className="text-[30px] font-extrabold tracking-[-0.035em] sm:text-[36px]">Committed to contributor success</h2><p className="mx-auto mt-3 max-w-[560px] text-sm leading-6 text-white/55">Reliable support and clear information help contributors keep moving forward.</p></div><div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["250K+", "Active Contributors", UsersRound], ["98%", "Support Satisfaction", CheckCircle], ["24/7", "Help Center Access", Headphones], ["100+", "Countries Supported", Globe2]].map(([value, label, Icon]) => { const ItemIcon = Icon as typeof UsersRound; return <div key={label as string} className="rounded-lg border border-white/10 bg-white/[0.05] p-5 text-center transition hover:-translate-y-1 hover:border-orange/40"><ItemIcon size={21} className="mx-auto text-orange" /><p className="mt-4 text-2xl font-extrabold tracking-[-0.04em] text-orange">{value as string}</p><p className="mt-1 text-xs font-bold text-white">{label as string}</p></div>; })}</div></div></section>

    <section id="apply" className="bg-gradient-to-r from-navy to-[#1b3247] px-5 py-14 text-white sm:px-8 lg:py-16"><div className="mx-auto flex max-w-[1020px] flex-col items-center justify-between gap-7 text-center sm:flex-row sm:text-left"><div><SectionEyebrow>We are here to help</SectionEyebrow><h2 className="text-[28px] font-extrabold tracking-[-0.035em] sm:text-[34px]">Need help getting started?</h2><p className="mt-2 max-w-[540px] text-sm text-white/60">Our support team is ready to assist you every step of the way.</p></div><div className="flex flex-wrap justify-center gap-3"><a href="#contact-form" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition hover:border-orange hover:text-orange">Contact Support <ArrowRight size={15} /></a><Link to="/apply" className="inline-flex items-center gap-2 rounded-md bg-orange px-7 py-3.5 text-sm font-extrabold text-navy transition hover:-translate-y-0.5 hover:bg-orange-light">Apply now <ArrowRight size={16} /></Link></div></div></section>
  </main><SiteFooter /></div>;
}
