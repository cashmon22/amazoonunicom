import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { assignmentCategories } from "@/assignment-data";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Globe2,
  House,
  LaptopMinimalCheck,
  Play,
  ShieldCheck,
  X,
  Sparkles,
  Star,
  UsersRound,
  WalletCards,
} from "lucide-react";

const heroImage =
  "https://images.pexels.com/photos/7859490/pexels-photo-7859490.jpeg?auto=compress&cs=tinysrgb&w=1600";

const benefits = [
  {
    icon: House,
    title: "Work from anywhere",
    description: "100% remote",
  },
  {
    icon: CalendarDays,
    title: "Flexible schedule",
    description: "Work when you want",
  },
  {
    icon: CircleDollarSign,
    title: "Earn rewards",
    description: "Get paid for your work",
  },
  {
    icon: ShieldCheck,
    title: "Trusted by Amazon",
    description: "Official business program",
  },
];

const steps = [
  {
    number: "1",
    icon: UsersRound,
    title: "Create your account",
    description: "Sign up and complete your profile",
  },
  {
    number: "2",
    icon: ClipboardCheck,
    title: "Access tasks",
    description: "Browse and choose tasks that fit you",
  },
  {
    number: "3",
    icon: LaptopMinimalCheck,
    title: "Complete tasks",
    description: "Follow guidelines and submit your work",
  },
  {
    number: "4",
    icon: WalletCards,
    title: "Earn rewards",
    description: "Get paid securely to your preferred method",
  },
];

const stats = [
  { value: "200K+", label: "Active remote workers", icon: UsersRound },
  { value: "10M+", label: "Tasks completed monthly", icon: ClipboardCheck },
  { value: "$50M+", label: "Rewards paid to our community", icon: CircleDollarSign },
  { value: "100+", label: "Countries worldwide", icon: Globe2 },
];

const testimonials = [
  {
    quote: "This program gives me the flexibility I need while earning a great income.",
    name: "Jessica M.",
    location: "United States",
    image: "https://i.pravatar.cc/100?img=47",
  },
  {
    quote: "I love being able to work from home and choose tasks that interest me.",
    name: "David R.",
    location: "Canada",
    image: "https://i.pravatar.cc/100?img=12",
  },
  {
    quote: "Payments are always on time and the tasks are easy to understand.",
    name: "Priya S.",
    location: "India",
    image: "https://i.pravatar.cc/100?img=32",
  },
];

const faqs = [
  {
    question: "Do I need previous experience?",
    answer: "No. Each opportunity includes clear instructions, and you can choose tasks that match your interests and skills.",
  },
  {
    question: "When will I receive my rewards?",
    answer: "Once your completed task is reviewed and approved, rewards are sent securely through your selected payment method.",
  },
  {
    question: "Can I choose my own hours?",
    answer: "Yes. Work when it suits you and browse available opportunities whenever you are ready to get started.",
  },
];

function SectionEyebrow({ children }: { children: string }) {
  return <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange">{children}</p>;
}

export default function Index() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    if (!isVideoOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsVideoOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isVideoOpen]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8f9fa] text-ink">
      <SiteHeader active="home" />

      <main>
        <section className="hero-shell relative overflow-hidden bg-navy text-white">
          <div className="absolute -left-24 top-8 h-64 w-64 rounded-full bg-orange/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-[1440px] lg:grid-cols-[0.94fr_1.06fr]">
            <div className="hero-copy relative flex min-h-[500px] flex-col justify-center px-6 py-16 sm:px-10 lg:min-h-[548px] lg:pl-[max(40px,calc((100vw-1240px)/2+8px))] lg:pr-14 xl:py-20">
              <div className="relative z-10 max-w-[530px]">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/75">
                  <Sparkles size={14} className="text-orange" /> The future of flexible work
                </div>
                <h1 className="max-w-[600px] text-[42px] font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-[54px] lg:text-[62px]">
                  Work from home.
                  <span className="mt-2 block text-orange">Make an impact.</span>
                </h1>
                <p className="mt-6 max-w-[470px] text-base leading-7 text-white/70 sm:text-lg">
                  Join thousands of remote workers helping Amazon improve the customer experience across the globe.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link className="group inline-flex items-center justify-center gap-2 rounded-md bg-orange px-7 py-3.5 text-sm font-extrabold text-navy shadow-[0_8px_24px_rgba(255,153,0,0.2)] transition hover:-translate-y-0.5 hover:bg-orange-light" to="/apply">
                    Apply now <ArrowRight size={17} className="transition group-hover:translate-x-0.5" />
                  </Link>
                  <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md border border-white/35 px-6 py-3.5 text-sm font-bold text-white transition hover:border-orange hover:text-orange" onClick={() => setIsVideoOpen(true)}>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/60"><Play size={11} fill="currentColor" /></span>
                    Watch how it works
                  </button>
                </div>
                <div className="mt-9 flex items-center gap-2.5 text-xs font-medium text-white/65">
                  <BadgeCheck size={17} className="text-orange" /> Official Amazon Work-from-Home Opportunity
                </div>
              </div>
              <div className="pointer-events-none absolute -bottom-36 -right-36 h-96 w-96 rounded-full border-[1px] border-orange/15 lg:h-[520px] lg:w-[520px]" />
            </div>
            <div className="hero-photo relative min-h-[370px] overflow-hidden lg:min-h-[548px]">
              <img src={heroImage} alt="Woman working remotely in a warm home office" className="absolute inset-0 h-full w-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-r from-navy/40 via-transparent to-transparent lg:from-navy/50 lg:via-transparent" />
              <div className="absolute bottom-6 right-6 hidden rounded-lg border border-white/20 bg-navy/70 px-4 py-3 text-xs font-semibold text-white/90 shadow-xl backdrop-blur-md sm:block">
                <div className="mb-1 flex items-center gap-2 text-orange"><Clock3 size={14} /> Work on your terms</div>
                <span className="text-white/60">Flexible opportunities, wherever you are</span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white" aria-label="Program benefits">
          <div className="mx-auto grid max-w-[1240px] grid-cols-2 divide-x divide-slate-100 sm:grid-cols-4 lg:px-8">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div key={title} className="benefit-card group flex items-center gap-3 px-5 py-5 sm:px-4 lg:py-7">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange/[0.10] text-orange transition group-hover:bg-orange group-hover:text-navy">
                  <Icon size={22} strokeWidth={1.8} />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-ink">{title}</h2>
                  <p className="mt-1 text-xs text-slate-500">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 bg-[#f8f9fa] px-5 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-[1120px]">
            <div className="text-center">
              <SectionEyebrow>Simple by design</SectionEyebrow>
              <h2 className="section-title">How it works</h2>
              <p className="mx-auto mt-3 max-w-[530px] text-sm leading-6 text-slate-500">Get started in four simple steps and take control of the way you work.</p>
            </div>
            <div className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-5">
              <div className="absolute left-[12%] right-[12%] top-[39px] hidden border-t border-dashed border-slate-300 md:block" />
              {steps.map(({ number, icon: Icon, title, description }) => (
                <div key={number} className="relative z-10 flex items-center gap-4 md:block md:text-center">
                  <div className="relative inline-flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-full border-[6px] border-[#f8f9fa] bg-white text-navy shadow-[0_4px_20px_rgba(20,36,52,0.10)] ring-1 ring-slate-200 md:mx-auto">
                    <Icon size={29} strokeWidth={1.65} />
                    <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-orange text-sm font-extrabold text-navy shadow-sm">{number}</span>
                  </div>
                  <div className="md:mt-5">
                    <h3 className="text-sm font-extrabold capitalize text-ink">{title}</h3>
                    <p className="mt-2 max-w-[180px] text-xs leading-5 text-slate-500 md:mx-auto">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="opportunities" className="scroll-mt-20 bg-white px-5 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-[1240px]">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <SectionEyebrow>Find your fit</SectionEyebrow>
                <h2 className="section-title">Types of assignments you may receive</h2>
                <p className="mt-3 max-w-[560px] text-sm leading-6 text-slate-500">Explore flexible opportunities built around real customer experiences and your everyday expertise.</p>
              </div>
              <Link className="group inline-flex items-center gap-1 text-sm font-bold text-navy transition hover:text-orange" to="/apply">View all opportunities <ChevronRight size={17} className="transition group-hover:translate-x-1" /></Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {assignmentCategories.map(({ icon: Icon, title, difficulty, description, time, reward }) => (
                <article key={title} className="task-card group rounded-[10px] border border-slate-200 bg-white p-5 shadow-[0_3px_16px_rgba(20,36,52,0.04)] transition duration-300 hover:-translate-y-1 hover:border-orange/40 hover:shadow-[0_14px_32px_rgba(20,36,52,0.10)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange/[0.10] text-orange transition group-hover:bg-orange group-hover:text-navy"><Icon size={23} strokeWidth={1.8} /></div>
                  <h3 className="mt-5 min-h-[32px] text-sm font-extrabold text-ink">{title}</h3>
                  <div className="mt-3 grid grid-cols-2 gap-3 border-y border-slate-100 py-3">
                    <div><p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Difficulty</p><p className="mt-1 text-[10px] font-semibold leading-4 text-navy">{difficulty}</p></div>
                    <div><p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Estimated time</p><p className="mt-1 text-[10px] font-semibold leading-4 text-navy">{time}</p></div>
                  </div>
                  <p className="mt-4 min-h-[64px] text-[10px] leading-4 text-slate-500">{description}</p>
                  <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4"><div><p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Reward range</p><p className="mt-1 text-sm font-extrabold text-navy">{reward}</p></div><CircleDollarSign size={17} className="mb-0.5 text-orange" /></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="payments" className="scroll-mt-20 bg-[#f8f9fa] px-5 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-[1160px] gap-7 lg:grid-cols-[0.83fr_1.17fr] lg:items-stretch">
            <div className="rounded-xl border border-slate-200 bg-white p-7 shadow-[0_4px_22px_rgba(20,36,52,0.04)] sm:p-9">
              <SectionEyebrow>Built around you</SectionEyebrow>
              <h2 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-ink sm:text-[32px]">Why work with Amazon?</h2>
              <ul className="mt-7 space-y-4">
                {[
                  "Official program with secure payments",
                  "Flexible hours that fit your lifestyle",
                  "No commute, work from anywhere",
                  "Gain experience with a trusted brand",
                  "Opportunities for everyone",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-600"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange/15 text-orange"><Check size={13} strokeWidth={3} /></span>{item}</li>
                ))}
              </ul>
              <Link className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-navy transition hover:text-orange" to="/apply">Learn about the program <ArrowUpRight size={16} /></Link>
            </div>
            <div className="stats-panel relative overflow-hidden rounded-xl bg-navy p-7 text-white shadow-[0_10px_30px_rgba(9,22,35,0.16)] sm:p-9">
              <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-orange/15" />
              <div className="absolute -bottom-40 left-20 h-72 w-72 rounded-full bg-orange/10 blur-3xl" />
              <div className="relative z-10 flex items-center gap-3 border-b border-white/10 pb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange text-navy"><Banknote size={21} /></span>
                <div><p className="text-sm font-bold">A community that works</p><p className="mt-0.5 text-xs text-white/55">Making an impact, together</p></div>
              </div>
              <div className="relative z-10 grid grid-cols-2 gap-x-5 gap-y-8 pt-8 sm:grid-cols-4 sm:gap-5">
                {stats.map(({ value, label, icon: Icon }) => (
                  <div key={label} className="text-center sm:text-left">
                    <Icon size={23} strokeWidth={1.6} className="mx-auto mb-3 text-orange sm:mx-0" />
                    <p className="text-2xl font-extrabold tracking-[-0.03em] text-orange sm:text-[27px]">{value}</p>
                    <p className="mt-1.5 text-[11px] leading-4 text-white/65">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="success-stories" className="scroll-mt-20 bg-white px-5 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-[1240px]">
            <div className="text-center">
              <SectionEyebrow>Real people, real flexibility</SectionEyebrow>
              <h2 className="section-title">What our remote workers say</h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {testimonials.map(({ quote, name, location, image }) => (
                <article key={name} className="rounded-[10px] border border-slate-200 bg-white p-6 shadow-[0_3px_16px_rgba(20,36,52,0.04)] transition hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(20,36,52,0.08)]">
                  <div className="flex gap-0.5 text-orange" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={14} fill="currentColor" strokeWidth={1.2} />)}</div>
                  <p className="mt-5 min-h-[68px] text-sm leading-6 text-slate-600">“{quote}”</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                    <img src={image} alt="" className="h-10 w-10 rounded-full object-cover" />
                    <div><p className="text-sm font-bold text-ink">{name}</p><p className="mt-0.5 text-xs text-slate-400">{location}</p></div>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-8 flex justify-center gap-2" aria-label="Testimonial carousel pagination"><span className="h-2 w-6 rounded-full bg-orange" /><span className="h-2 w-2 rounded-full bg-slate-300" /><span className="h-2 w-2 rounded-full bg-slate-300" /><span className="h-2 w-2 rounded-full bg-slate-300" /></div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-20 bg-[#f8f9fa] px-5 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-[980px] gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <div>
              <SectionEyebrow>Good to know</SectionEyebrow>
              <h2 className="section-title">Frequently asked questions</h2>
              <p className="mt-4 text-sm leading-6 text-slate-500">Everything you need to feel confident getting started.</p>
            </div>
            <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white px-5 shadow-[0_3px_16px_rgba(20,36,52,0.04)]">
              {faqs.map(({ question, answer }, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={question}>
                    <button type="button" onClick={() => setOpenFaq(isOpen ? null : index)} className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-bold text-ink">
                      {question}<ChevronDown size={18} className={`shrink-0 text-slate-400 transition ${isOpen ? "rotate-180 text-orange" : ""}`} />
                    </button>
                    {isOpen && <p className="-mt-2 pb-5 pr-8 text-sm leading-6 text-slate-500">{answer}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="apply" className="scroll-mt-20 bg-navy px-5 py-16 text-white sm:px-8 lg:py-20">
          <div className="mx-auto flex max-w-[1080px] flex-col items-center justify-between gap-8 text-center sm:flex-row sm:text-left">
            <div><SectionEyebrow>Take the next step</SectionEyebrow><h2 className="max-w-[650px] text-[28px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[35px]">Ready to start your work-from-home journey?</h2><p className="mt-3 text-sm text-white/65">Join now and start earning on your schedule.</p></div>
            <Link className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-orange px-10 py-4 text-sm font-extrabold text-navy shadow-[0_8px_24px_rgba(255,153,0,0.18)] transition hover:-translate-y-0.5 hover:bg-orange-light" to="/contact">Apply now <ArrowRight size={17} className="transition group-hover:translate-x-0.5" /></Link>
          </div>
        </section>
      </main>

      <SiteFooter />

      {isVideoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="How it works video"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsVideoOpen(false);
          }}
        >
          <div className="relative w-full max-w-5xl overflow-hidden rounded-xl bg-black shadow-2xl">
            <button
              type="button"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-navy/90 text-white transition hover:bg-orange hover:text-navy focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => setIsVideoOpen(false)}
              aria-label="Close video"
            >
              <X size={20} />
            </button>
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src="https://player.vimeo.com/video/1226270296?autoplay=1&title=0&byline=0&portrait=0"
                title="How it works"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
