import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  CheckCircle,
  ChevronDown,
  CircleAlert,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  FileCheck2,
  FileSearch,
  Globe2,
  Grid2x2,
  Headphones,
  LayoutDashboard,
  LockKeyhole,
  LoaderCircle,
  MessageSquare,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { assignmentCategories } from "@/assignment-data";
import { submitForm } from "@/lib/form-submission";
import { useAuth } from "@/lib/auth";

const processSteps = [
  ["1", "Submit Application", "Complete the contributor application form.", FileCheck2],
  ["2", "Application Review", "Our team reviews qualifications and availability.", Search],
  ["3", "Approval Decision", "Qualified applicants are approved.", UserCheck],
  ["4", "Credentials Issued", "Approved applicants receive login credentials by email.", Send],
  ["5", "Program Access", "Begin participating in available assignments.", Grid2x2],
] as const;

const statusSteps = [
  ["Application Submitted", "Your application has been received.", CheckCircle],
  ["Under Review", "The team is reviewing your information.", Search],
  ["Approval Decision", "You will be notified when a decision is ready.", UserCheck],
  ["Login Credentials Sent", "Credentials are sent after successful review.", Send],
  ["Contributor Access Granted", "Begin exploring available assignments.", Grid2x2],
] as const;

const faqItems = [
  ["How long does application review take?", "Most applications are reviewed within 1–3 business days, depending on program requirements and contributor availability."],
  ["How will I receive my login credentials?", "Qualified applicants receive login credentials and onboarding instructions by email after a successful review."],
  ["Can I update my application after submission?", "Contact support with your application details if you need to correct or update information during review."],
  ["When can I begin participating in assignments?", "Once your application is approved and access is granted, available assignments will appear in your contributor workspace."],
] as const;

const eligibilityOptions = [
  "I am at least 18 years old.",
  "I have reliable internet access.",
  "I can follow assignment instructions accurately.",
  "I agree to Contributor Program policies.",
  "I understand applications are reviewed before approval.",
  "I understand login credentials will only be provided after successful application review.",
];

const initialApplication = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  timeZone: "",
  interests: [] as string[],
  hours: "5–10 Hours",
  experience: "No",
  reason: "",
  eligibility: [] as string[],
};

function SectionEyebrow({ children }: { children: string }) {
  return <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange">{children}</p>;
}

function ApplicationTopbar() {
  return <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3"><div className="flex items-center gap-2"><div className="flex gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-200" /><span className="h-2 w-2 rounded-full bg-slate-200" /><span className="h-2 w-2 rounded-full bg-slate-200" /></div><div className="ml-2 hidden h-5 w-32 items-center rounded bg-slate-50 px-2 text-[8px] text-slate-400 sm:flex">apply.amazon.com</div></div><div className="flex items-center gap-3 text-slate-400"><Search size={13} /><Bell size={13} /><span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[8px] font-bold text-white">AS</span></div></div>;
}

function ApplicationSidebar() {
  return <aside className="hidden w-[130px] shrink-0 border-r border-slate-200 bg-[#fbfcfd] px-3 py-4 sm:block"><div className="mb-5 flex items-center gap-1.5 px-1 text-[9px] font-bold text-navy"><span className="flex h-4 w-4 items-center justify-center rounded bg-orange text-[8px]">a</span> contributor</div><div className="space-y-1 text-[9px] font-medium text-slate-500">{[[LayoutDashboard, "Overview"], [FileCheck2, "Application"], [Grid2x2, "Opportunities"], [BarChart3, "Progress"], [Headphones, "Support"]].map(([Icon, label], index) => { const ItemIcon = Icon as typeof LayoutDashboard; return <div key={label as string} className={`flex items-center gap-2 rounded px-2 py-2 ${index === 1 ? "bg-orange/10 font-bold text-orange" : ""}`}><ItemIcon size={11} />{label as string}</div>; })}</div><div className="mt-8 border-t border-slate-200 pt-3 text-[8px] text-slate-400"><ShieldCheck size={11} className="mb-1 text-slate-500" />Secure portal</div></aside>;
}

function ApplicationDashboard() {
  return <div className="relative mx-auto w-full max-w-[610px] overflow-hidden rounded-xl border border-white/15 bg-[#f7f9fb] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-3"><div className="absolute -right-3 top-12 z-20 hidden items-center gap-2 rounded-md border border-white/15 bg-[#152638] px-3 py-2 text-[9px] font-semibold text-white shadow-xl sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-orange" /> Application in progress</div><ApplicationTopbar /><div className="flex min-h-[315px]"><ApplicationSidebar /><div className="min-w-0 flex-1 bg-[#f8fafc] p-3 sm:p-4"><div className="flex items-center justify-between"><div><p className="text-[8px] text-slate-400">Contributor application portal</p><p className="mt-1 text-sm font-extrabold text-navy sm:text-base">Welcome to your application</p></div><span className="rounded-full bg-orange/10 px-2.5 py-1 text-[8px] font-bold text-orange">Step 2 of 5</span></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{[["Application Status", "In progress", "Continue"], ["Available Opportunities", "18", "Explore"], ["Contributor Progress", "62%", "On track"], ["Earnings Potential", "$20–$500+", "Per assignment"]].map(([label, value, hint], index) => <div key={label} className="rounded-md border border-slate-200 bg-white p-2.5"><p className="text-[7px] text-slate-400">{label}</p><p className={`mt-1 text-sm font-extrabold ${index === 0 || index === 2 ? "text-orange" : "text-navy"}`}>{value}</p><p className="mt-1 text-[7px] text-emerald-600">{hint}</p></div>)}</div><div className="mt-3 grid gap-2 sm:grid-cols-[1fr_0.9fr]"><div className="rounded-md border border-slate-200 bg-white p-3"><div className="flex items-center justify-between"><p className="text-[8px] font-bold text-navy">Application progress</p><p className="text-[7px] font-bold text-orange">40%</p></div><div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-2 w-[40%] rounded-full bg-orange" /></div><div className="mt-4 space-y-2">{([["Personal information", "Complete", true], ["Contributor interests", "In progress", true], ["Experience & availability", "Next step", false], ["Eligibility verification", "Locked", false]] as const).map(([label, status, done]) => <div key={label} className="flex items-center justify-between text-[8px]"><span className="flex items-center gap-1.5 text-slate-500"><span className={`flex h-4 w-4 items-center justify-center rounded-full ${done ? "bg-orange/15 text-orange" : "bg-slate-100 text-slate-400"}`}>{done ? <Check size={9} /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />}</span>{label}</span><span className={status === "In progress" || status === "Next step" ? "font-bold text-orange" : "text-slate-400"}>{status}</span></div>)}</div></div><div className="rounded-md border border-slate-200 bg-white p-3"><div className="flex items-center justify-between"><p className="text-[8px] font-bold text-navy">Assignment categories</p><MoreHorizontalIcon /></div><div className="mt-3 grid grid-cols-2 gap-2">{[["Product Research", FileSearch], ["Marketplace Evaluation", BarChart3], ["Product Feedback", MessageSquare], ["Content Quality", FileCheck2], ["Customer Experience", UsersRound], ["Premium Research", Sparkles]].map(([label, Icon]) => { const ItemIcon = Icon as typeof FileSearch; return <div key={label as string} className="flex items-center gap-1.5 rounded bg-[#fbfcfd] p-1.5 text-[7px] font-semibold text-slate-500"><ItemIcon size={10} className="text-orange" />{label as string}</div>; })}</div></div></div></div></div></div>;
}

function MoreHorizontalIcon() {
  return <span className="flex gap-0.5"><i className="h-1 w-1 rounded-full bg-slate-300" /><i className="h-1 w-1 rounded-full bg-slate-300" /><i className="h-1 w-1 rounded-full bg-slate-300" /></span>;
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return <label className="block"><span className="text-xs font-bold text-navy">{label}</span><input required type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-[#fbfcfd] px-3 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-orange focus:ring-2 focus:ring-orange/10" /></label>;
}

export default function Apply() {
  const { session } = useAuth();
  const [step, setStep] = useState(1);
  const [application, setApplication] = useState(initialApplication);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [submissionError, setSubmissionError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const updateField = (field: keyof typeof initialApplication, value: string) => {
    setValidationError("");
    setSubmissionError("");
    setApplication((current) => ({ ...current, [field]: value }));
  };
  const toggleListValue = (field: "interests" | "eligibility", value: string) => {
    setValidationError("");
    setSubmissionError("");
    setApplication((current) => ({ ...current, [field]: current[field].includes(value) ? current[field].filter((item) => item !== value) : [...current[field], value] }));
  };
  const personalComplete = Boolean(application.firstName && application.lastName && application.email && application.phone && application.country && application.timeZone);
  const interestsComplete = application.interests.length > 0;
  const experienceComplete = Boolean(application.hours && application.reason);
  const eligibilityComplete = application.eligibility.length === eligibilityOptions.length;
  const canContinue = step === 1 ? personalComplete : step === 2 ? interestsComplete : step === 3 ? experienceComplete : step === 4 ? eligibilityComplete : true;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setValidationError("");
    setSubmissionError("");

    if (!canContinue) {
      setValidationError("Please complete all required fields before continuing.");
      return;
    }

    if (step < 5) {
      setStep((current) => current + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      await submitForm("application", {
        userId: session?.user.id,
        firstName: application.firstName,
        lastName: application.lastName,
        email: application.email,
        phone: application.phone,
        country: application.country,
        timeZone: application.timeZone,
        interests: application.interests,
        hours: application.hours,
        experience: application.experience,
        reason: application.reason,
        eligibility: application.eligibility,
      });
      setApplication({ ...initialApplication, interests: [], eligibility: [] });
      setStep(1);
      setSubmitted(true);
    } catch (submissionError) {
      setSubmissionError(submissionError instanceof Error ? submissionError.message : "Unable to submit your form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div className="min-h-screen overflow-x-hidden bg-[#f8f9fa] text-ink"><SiteHeader active="apply" /><main>
    <section className="relative overflow-hidden bg-navy text-white"><div className="absolute -right-40 -top-48 h-[520px] w-[520px] rounded-full border border-white/[0.05]" /><div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-orange/[0.07] blur-3xl" /><div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12 lg:px-8 lg:py-20"><div className="relative z-10 max-w-[480px]"><SectionEyebrow>Amazon Contributor Application Portal</SectionEyebrow><h1 className="text-[42px] font-extrabold leading-[1.06] tracking-[-0.045em] sm:text-[56px]">Apply to Join the Amazon Contributor Program</h1><p className="mt-6 max-w-[450px] text-base leading-7 text-white/65">Join a global network of contributors participating in research, evaluation, testing, and feedback assignments. Complete the application process to be considered for program access.</p><div className="mt-8 flex flex-wrap gap-3"><a href="#application-form" className="inline-flex items-center gap-2 rounded-md bg-orange px-6 py-3.5 text-sm font-extrabold text-navy transition hover:-translate-y-0.5 hover:bg-orange-light">Start application <ArrowRight size={16} /></a><Link to="/how-it-works" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition hover:border-orange hover:text-orange">Learn how it works <ArrowRight size={15} /></Link></div><div className="mt-8 flex items-center gap-2 text-xs font-medium text-white/60"><ShieldCheck size={16} className="text-orange" /> Applications are reviewed securely and thoughtfully</div></div><ApplicationDashboard /></div></section>

    <section className="bg-white px-5 py-12 sm:px-8 lg:py-16"><div className="mx-auto grid max-w-[1200px] gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["250K+", "Active Contributors", UsersRound], ["12M+", "Assignments Completed", ClipboardList], ["100+", "Countries Supported", Globe2], ["$50M+", "Compensation Distributed", CircleDollarSign]].map(([value, label, Icon]) => { const ItemIcon = Icon as typeof UsersRound; return <div key={label as string} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-elevated"><span className="flex h-10 w-10 items-center justify-center rounded-md bg-orange/10 text-orange"><ItemIcon size={19} /></span><div><p className="text-2xl font-extrabold tracking-[-0.04em] text-navy">{value as string}</p><p className="mt-1 text-xs font-semibold text-slate-500">{label as string}</p></div></div>; })}</div></section>

    <section className="bg-[#f8f9fa] px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="text-center"><SectionEyebrow>What to expect</SectionEyebrow><h2 className="section-title">Application process</h2><p className="mx-auto mt-3 max-w-[560px] text-sm leading-6 text-slate-500">A straightforward review process designed to match qualified contributors with meaningful opportunities.</p></div><div className="relative mt-14 grid gap-9 md:grid-cols-5 md:gap-3"><div className="absolute left-[9%] right-[9%] top-[38px] hidden border-t border-dashed border-slate-300 md:block" />{processSteps.map(([number, title, description, Icon]) => <div key={number} className="relative z-10 flex items-start gap-4 md:block md:text-center"><div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full border-[6px] border-[#f8f9fa] bg-white text-navy shadow-card ring-1 ring-slate-200 md:mx-auto"><Icon size={27} strokeWidth={1.6} /><span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange text-xs font-extrabold text-navy">{number}</span></div><div className="md:mt-5"><h3 className="text-xs font-extrabold text-navy sm:text-sm">{title}</h3><p className="mt-2 max-w-[180px] text-[10px] leading-4 text-slate-500 md:mx-auto">{description}</p></div></div>)}</div></div></section>

    <section id="application-form" className="scroll-mt-20 bg-white px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-16"><div><SectionEyebrow>Secure application</SectionEyebrow><h2 className="section-title">Tell us about yourself</h2><p className="mt-4 text-sm leading-6 text-slate-500">Complete each step to help us understand your interests, experience, and availability.</p><div className="mt-8 rounded-lg border border-slate-200 bg-[#f8f9fa] p-5"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-md bg-navy text-orange"><LockKeyhole size={17} /></span><div><p className="text-xs font-bold text-navy">Your information is protected</p><p className="mt-1 text-[10px] leading-4 text-slate-500">We use your responses to evaluate program fit and contact you about your application.</p></div></div></div><div className="mt-6 space-y-3 text-xs text-slate-600">{["No registration fee", "Flexible remote participation", "Rewards shown before work begins", "Access after successful review"].map((item) => <p key={item} className="flex items-center gap-2"><Check size={14} className="text-orange" />{item}</p>)}</div></div><form noValidate onSubmit={handleSubmit} aria-busy={isSubmitting} className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_8px_28px_rgba(20,36,52,0.07)] sm:p-7"><div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-orange">Application</p><h3 className="mt-1 text-xl font-extrabold text-navy">{step === 1 ? "Personal Information" : step === 2 ? "Contributor Interests" : step === 3 ? "Experience & Availability" : step === 4 ? "Eligibility Verification" : "Review & Submit"}</h3></div><span className="text-xs font-bold text-slate-400">Step {step} of 5</span></div><div className="mt-5 flex gap-1.5">{[1, 2, 3, 4, 5].map((item) => <div key={item} className={`h-1.5 flex-1 rounded-full ${item <= step ? "bg-orange" : "bg-slate-100"}`} />)}</div><div className="mt-8 min-h-[320px]">
      {step === 1 && <div className="grid gap-5 sm:grid-cols-2"><Field label="First name" value={application.firstName} onChange={(value) => updateField("firstName", value)} placeholder="Enter your first name" /><Field label="Last name" value={application.lastName} onChange={(value) => updateField("lastName", value)} placeholder="Enter your last name" /><Field label="Email address" value={application.email} onChange={(value) => updateField("email", value)} placeholder="you@example.com" type="email" /><Field label="Phone number" value={application.phone} onChange={(value) => updateField("phone", value)} placeholder="Enter your phone number" type="tel" /><label className="block"><span className="text-xs font-bold text-navy">Country of residence</span><select required value={application.country} onChange={(event) => updateField("country", event.target.value)} className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-[#fbfcfd] px-3 text-sm text-navy outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/10"><option value="">Select your country</option><option>United States</option><option>Canada</option><option>United Kingdom</option><option>India</option><option>Australia</option><option>Other</option></select></label><label className="block"><span className="text-xs font-bold text-navy">Time zone</span><select required value={application.timeZone} onChange={(event) => updateField("timeZone", event.target.value)} className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-[#fbfcfd] px-3 text-sm text-navy outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/10"><option value="">Select your time zone</option><option>Eastern Time (ET)</option><option>Central Time (CT)</option><option>Mountain Time (MT)</option><option>Pacific Time (PT)</option><option>GMT / UTC</option><option>India Standard Time (IST)</option><option>Australian Eastern Time (AET)</option></select></label></div>}
      {step === 2 && <div><p className="text-sm font-bold text-navy">Which assignment categories are you interested in?</p><p className="mt-2 text-xs text-slate-500">Select all that apply.</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{assignmentCategories.map(({ title, description, icon: Icon }) => { const checked = application.interests.includes(title); return <label key={title} className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition ${checked ? "border-orange bg-orange/[0.05]" : "border-slate-200 hover:border-orange/40"}`}><input type="checkbox" checked={checked} onChange={() => toggleListValue("interests", title)} className="sr-only" /><span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${checked ? "border-orange bg-orange text-navy" : "border-slate-300 text-transparent"}`}><Check size={13} strokeWidth={3} /></span><span><span className="flex items-center gap-2 text-xs font-bold text-navy"><Icon size={14} className="text-orange" />{title}</span><span className="mt-1 block text-[10px] leading-4 text-slate-500">{description}</span></span></label>; })}</div></div>}
      {step === 3 && <div className="space-y-7"><div><p className="text-sm font-bold text-navy">How many hours can you dedicate weekly?</p><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{["1–5 Hours", "5–10 Hours", "10–20 Hours", "20+ Hours"].map((option) => <label key={option} className={`flex cursor-pointer items-center justify-center rounded-md border px-3 py-3 text-xs font-semibold transition ${application.hours === option ? "border-orange bg-orange/10 text-navy" : "border-slate-200 text-slate-500 hover:border-orange/40"}`}><input type="radio" name="hours" checked={application.hours === option} onChange={() => updateField("hours", option)} className="sr-only" />{option}</label>)}</div></div><div><p className="text-sm font-bold text-navy">Have you previously participated in online research, testing, evaluation, or contributor programs?</p><div className="mt-4 flex gap-3">{["Yes", "No"].map((option) => <label key={option} className={`flex cursor-pointer items-center gap-2 rounded-md border px-5 py-3 text-xs font-semibold transition ${application.experience === option ? "border-orange bg-orange/10 text-navy" : "border-slate-200 text-slate-500 hover:border-orange/40"}`}><input type="radio" name="experience" checked={application.experience === option} onChange={() => updateField("experience", option)} className="sr-only" /><span className={`h-3 w-3 rounded-full border ${application.experience === option ? "border-[4px] border-orange" : "border-slate-300"}`} />{option}</label>)}</div></div><label className="block"><span className="text-sm font-bold text-navy">Why would you like to join the Contributor Program?</span><textarea required value={application.reason} onChange={(event) => updateField("reason", event.target.value)} placeholder="Tell us a little about your goals and interests" rows={5} className="mt-3 w-full resize-none rounded-md border border-slate-200 bg-[#fbfcfd] px-3 py-3 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-orange focus:ring-2 focus:ring-orange/10" /></label></div>}
      {step === 4 && <div><p className="text-sm font-bold text-navy">Please confirm the following statements.</p><div className="mt-6 space-y-3">{eligibilityOptions.map((option) => { const checked = application.eligibility.includes(option); return <label key={option} className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition ${checked ? "border-orange bg-orange/[0.05]" : "border-slate-200 hover:border-orange/40"}`}><input type="checkbox" checked={checked} onChange={() => toggleListValue("eligibility", option)} className="sr-only" /><span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${checked ? "border-orange bg-orange text-navy" : "border-slate-300 text-transparent"}`}><Check size={13} strokeWidth={3} /></span><span className="text-xs leading-5 text-slate-600">{option}</span></label>; })}</div></div>}
      {step === 5 && <div><div className="rounded-lg border border-orange/25 bg-orange/[0.05] p-4"><p className="text-xs font-bold text-navy">Your application is ready to submit.</p><p className="mt-1 text-[10px] leading-4 text-slate-500">Review your information below. You can use Previous to make changes.</p></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{[["Personal Information", `${application.firstName} ${application.lastName}\n${application.email}`], ["Selected Interests", application.interests.join(", ")], ["Availability", `${application.hours}\nPrevious experience: ${application.experience}`], ["Eligibility Responses", `${application.eligibility.length} of ${eligibilityOptions.length} confirmed`]].map(([label, value]) => <div key={label} className="rounded-lg border border-slate-200 bg-[#fbfcfd] p-4"><div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p><CheckCircle size={14} className="text-emerald-600" /></div><p className="mt-2 whitespace-pre-line text-xs leading-5 text-navy">{value}</p></div>)}</div></div>}
    </div>{validationError && <div className="mt-5 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800" role="alert"><CircleAlert size={16} className="mt-0.5 shrink-0" />{validationError}</div>}{submissionError && <div className="mt-5 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-xs leading-5 text-red-800" role="alert"><CircleAlert size={17} className="mt-0.5 shrink-0" /><div><p className="font-extrabold">{submissionError}</p></div></div>}<div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5"><button type="button" disabled={step === 1 || isSubmitting} onClick={() => setStep((current) => current - 1)} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-5 py-3 text-sm font-bold text-slate-500 transition hover:border-navy hover:text-navy disabled:cursor-not-allowed disabled:opacity-30"><ArrowLeft size={15} /> Previous</button><button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-md bg-orange px-6 py-3 text-sm font-extrabold text-navy transition hover:-translate-y-0.5 hover:bg-orange-light disabled:cursor-not-allowed disabled:opacity-40">{step === 5 ? isSubmitting ? <><LoaderCircle size={15} className="animate-spin" /> Submitting...</> : "Submit application" : "Next"} {step < 5 && <ArrowRight size={15} />}</button></div></form></div></section>

    <section className="bg-[#f8f9fa] px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="text-center"><SectionEyebrow>Transparent opportunity</SectionEyebrow><h2 className="section-title">Potential assignment rewards</h2><p className="mx-auto mt-3 max-w-[560px] text-sm leading-6 text-slate-500">Explore the types of assignments available after successful application review.</p></div><div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{assignmentCategories.map(({ title, difficulty, time, reward, icon: Icon }) => <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-elevated"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-md bg-orange/10 text-orange"><Icon size={19} /></span><span className="rounded-full bg-navy/5 px-2.5 py-1 text-[9px] font-bold text-slate-500">{difficulty}</span></div><h3 className="mt-5 text-sm font-extrabold text-navy">{title}</h3><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4"><span className="flex items-center gap-1 text-[10px] text-slate-500"><Clock3 size={12} className="text-orange" /> {time}</span><span className="text-sm font-extrabold text-orange">{reward}</span></div></div>)}</div></div></section>

    <section className="bg-white px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="text-center"><SectionEyebrow>After you apply</SectionEyebrow><h2 className="section-title">What happens after submission?</h2><p className="mx-auto mt-3 max-w-[550px] text-sm leading-6 text-slate-500">Track each stage from your initial application to contributor access.</p></div><div className="relative mx-auto mt-10 max-w-[1040px] grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{statusSteps.map(([title, description, Icon], index) => <div key={title} className="relative rounded-lg border border-slate-200 bg-white p-4 shadow-card"><div className="flex h-9 w-9 items-center justify-center rounded-md bg-orange/10 text-orange"><Icon size={17} /></div><p className="mt-4 text-xs font-extrabold leading-4 text-navy">{title}</p><p className="mt-2 text-[10px] leading-4 text-slate-500">{description}</p>{index < statusSteps.length - 1 && <span className="absolute -right-3 top-1/2 z-20 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 lg:flex"><ArrowRight size={12} /></span>}</div>)}</div></div></section>

    <section className="bg-[#f8f9fa] px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto grid max-w-[1020px] gap-10 md:grid-cols-[0.72fr_1.28fr] md:gap-16"><div><SectionEyebrow>Before you submit</SectionEyebrow><h2 className="section-title">Frequently asked questions</h2><p className="mt-4 text-sm leading-6 text-slate-500">A few quick answers about the application and review process.</p><Link to="/faq" className="mt-7 inline-flex items-center gap-2 text-xs font-bold text-navy transition hover:text-orange">Visit the full FAQ center <ArrowRight size={14} /></Link></div><div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white px-5 shadow-card">{faqItems.map(([question, answer], index) => { const isOpen = openFaq === index; return <div key={question}><button type="button" onClick={() => setOpenFaq(isOpen ? null : index)} className="flex w-full items-center justify-between gap-4 py-5 text-left text-xs font-bold text-navy sm:text-sm">{question}<ChevronDown size={17} className={`shrink-0 text-slate-400 transition ${isOpen ? "rotate-180 text-orange" : ""}`} /></button>{isOpen && <p className="-mt-1 pb-5 pr-8 text-xs leading-6 text-slate-500">{answer}</p>}</div>; })}</div></div></section>

    <section className="bg-gradient-to-r from-navy to-[#1b3247] px-5 py-14 text-white sm:px-8 lg:py-16"><div className="mx-auto flex max-w-[1020px] flex-col items-center justify-between gap-7 text-center sm:flex-row sm:text-left"><div><SectionEyebrow>Take the first step</SectionEyebrow><h2 className="text-[28px] font-extrabold tracking-[-0.035em] sm:text-[34px]">Ready to take the first step?</h2><p className="mt-2 max-w-[540px] text-sm text-white/60">Submit your application today and become part of a global contributor community.</p></div><a href="#application-form" className="inline-flex items-center gap-2 rounded-md bg-orange px-8 py-3.5 text-sm font-extrabold text-navy transition hover:-translate-y-0.5 hover:bg-orange-light">Start application <ArrowRight size={16} /></a></div></section>
  </main><SiteFooter />{submitted && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/75 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="application-success-title"><div className="relative w-full max-w-[560px] rounded-xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-9"><button type="button" onClick={() => setSubmitted(false)} aria-label="Close confirmation" className="absolute right-4 top-4 rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-navy"><X size={18} /></button><div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle size={28} /></div><SectionEyebrow>Application received</SectionEyebrow><h2 id="application-success-title" className="text-2xl font-extrabold tracking-[-0.03em] text-navy sm:text-3xl">Application Submitted Successfully</h2><p className="mt-4 text-sm leading-6 text-slate-500">Thank you for your interest in joining our Contributor Program. Our team will review your application and contact you via email if you are selected to proceed.</p><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-lg border border-slate-200 bg-[#f8f9fa] p-4"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Status</p><p className="mt-2 text-sm font-extrabold text-orange">Under Review</p></div><div className="rounded-lg border border-slate-200 bg-[#f8f9fa] p-4"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Estimated review time</p><p className="mt-2 text-sm font-extrabold text-navy">1–3 Business Days</p></div></div><div className="mt-7 flex flex-wrap gap-3"><Link to="/" className="inline-flex items-center gap-2 rounded-md bg-orange px-5 py-3 text-sm font-extrabold text-navy">Return home <ArrowRight size={15} /></Link><Link to="/contact" className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-5 py-3 text-sm font-bold text-navy transition hover:border-orange hover:text-orange">Contact support <ArrowRight size={15} /></Link></div></div></div>}</div>;
}
