import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MonitorCheck,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { useAuth } from "@/lib/auth";

function SectionEyebrow({ children }: { children: string }) {
  return <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange">{children}</p>;
}


export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, isLoading, signIn } = useAuth();
  const redirectPath = (location.state as { from?: string } | null)?.from ?? "/dashboard";
  const isAdministrator = session?.user.app_metadata?.role === "admin";
  const destination = isAdministrator ? "/admin" : redirectPath.startsWith("/admin") ? "/dashboard" : redirectPath;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && session) navigate(destination, { replace: true });
  }, [destination, isLoading, navigate, session]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setAuthError("");
    setIsSubmitting(true);
    try {
      const { error } = await signIn(email.trim(), password);
      if (error) {
        setAuthError("Invalid email or password");
        return;
      }
    } catch {
      setAuthError("Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8f9fa] text-ink">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-navy text-white">
          <div className="absolute -right-40 -top-48 h-[520px] w-[520px] rounded-full border border-white/[0.05]" />
          <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-orange/[0.07] blur-3xl" />
          <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-1 lg:gap-12 lg:px-8 lg:py-20">
            <div className="relative z-10 max-w-[480px]">
              <SectionEyebrow>Amazon Contributor Login</SectionEyebrow>
              <h1 className="text-[42px] font-extrabold leading-[1.06] tracking-[-0.045em] sm:text-[56px]">Amazon Contributor Login</h1>
              <p className="mt-6 max-w-[450px] text-base leading-7 text-white/65">Approved contributors can securely access their dashboard, monitor account status, manage assignments, and track program activity.</p>
              <div className="mt-8 flex flex-wrap gap-3"><Link to="/apply" className="inline-flex items-center gap-2 rounded-md bg-orange px-6 py-3.5 text-sm font-extrabold text-navy transition hover:-translate-y-0.5 hover:bg-orange-light">Apply now <ArrowRight size={16} /></Link><Link to="/how-it-works" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition hover:border-orange hover:text-orange">Learn how it works <ArrowRight size={15} /></Link></div>
              <div className="mt-8 flex items-center gap-2 text-xs font-medium text-white/55"><ShieldCheck size={15} className="text-orange" /> Secure access for approved contributors</div>
            </div>
          </div>
        </section>

        <section id="login-portal" className="bg-[#f8f9fa] px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-[560px]">
            <div className="text-center"><SectionEyebrow>Contributor portal</SectionEyebrow><h2 className="section-title">Access your workspace</h2><p className="mx-auto mt-3 max-w-[470px] text-sm leading-6 text-slate-500">Sign in to review assignments, monitor account activity, and stay up to date with your contributor status.</p></div>
            <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-[0_12px_36px_rgba(20,36,52,0.09)] sm:p-9">
              <div className="flex items-start gap-4 border-b border-slate-100 pb-6"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange/10 text-orange"><LockKeyhole size={20} /></span><div><h3 className="text-xl font-extrabold tracking-[-0.025em] text-navy">Welcome Back</h3><p className="mt-2 text-sm leading-6 text-slate-500">Sign in using the credentials provided after your application was approved.</p></div></div>
              <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
                <label className="block"><span className="text-xs font-bold text-navy">Email Address</span><div className="relative mt-2"><Mail size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input required id="contributor-email" type="email" autoComplete="username" value={email} onChange={(event) => { setEmail(event.target.value); setAuthError(""); }} placeholder="Enter your email address" className="h-12 w-full rounded-md border border-slate-200 bg-[#fbfcfd] pl-10 pr-3 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-orange focus:ring-2 focus:ring-orange/10" /></div></label>
                <label className="block"><span className="text-xs font-bold text-navy">Password</span><div className="relative mt-2"><KeyRound size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input required id="contributor-password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); setAuthError(""); }} placeholder="Enter your password" className="h-12 w-full rounded-md border border-slate-200 bg-[#fbfcfd] pl-10 pr-11 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-orange focus:ring-2 focus:ring-orange/10" /><button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition hover:text-navy">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
                <div className="flex flex-col justify-between gap-3 text-xs sm:flex-row sm:items-center"><label className="flex items-center gap-2 font-semibold text-slate-500"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="h-4 w-4 rounded border-slate-300 accent-[#ff9900]" /> Remember Me</label><Link to="/contact" className="font-bold text-navy transition hover:text-orange">Forgot Password?</Link></div>
                {authError && <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-800" role="alert">{authError}</div>}
                <button type="submit" disabled={isSubmitting || isLoading} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-orange text-sm font-extrabold text-navy shadow-[0_4px_14px_rgba(255,153,0,0.18)] transition hover:-translate-y-0.5 hover:bg-orange-light disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? <><LoaderCircle size={16} className="animate-spin" /> Signing In...</> : <>Sign In <ArrowRight size={16} /></>}</button>
                <Link to="/contact" className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 transition hover:text-orange">Need Help Accessing Your Account? <ArrowRight size={13} /></Link>
              </form>
            </div>
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-orange/25 bg-orange/[0.07] p-4 sm:p-5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-orange/15 text-orange"><ShieldCheck size={18} /></span><div><p className="text-xs font-extrabold text-navy">Security notice</p><p className="mt-1 text-xs leading-5 text-slate-600">For security purposes, only approved contributors can access the platform.</p><p className="mt-1 text-xs leading-5 text-slate-600">Login credentials are issued after successful application review.</p></div></div>
          </div>
        </section>

        <section className="bg-white px-5 py-14 sm:px-8 lg:py-16"><div className="mx-auto grid max-w-[1020px] gap-4 sm:grid-cols-3"><div className="rounded-lg border border-slate-200 bg-white p-5 shadow-card"><ShieldCheck size={20} className="text-orange" /><h3 className="mt-4 text-sm font-extrabold text-navy">Secure by design</h3><p className="mt-2 text-xs leading-5 text-slate-500">Your contributor workspace is designed around protected access and visible account activity.</p></div><div className="rounded-lg border border-slate-200 bg-white p-5 shadow-card"><MonitorCheck size={20} className="text-orange" /><h3 className="mt-4 text-sm font-extrabold text-navy">Track your activity</h3><p className="mt-2 text-xs leading-5 text-slate-500">Review account activity, device checks, and access notifications from one place.</p></div><div className="rounded-lg border border-slate-200 bg-white p-5 shadow-card"><UserRound size={20} className="text-orange" /><h3 className="mt-4 text-sm font-extrabold text-navy">Need an account?</h3><p className="mt-2 text-xs leading-5 text-slate-500">Applications are reviewed before access is issued. <Link to="/apply" className="font-bold text-navy hover:text-orange">Apply now</Link>.</p></div></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
