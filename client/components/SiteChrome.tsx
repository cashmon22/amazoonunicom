import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

type NavKey = "home" | "opportunities" | "how-it-works" | "payments" | "success-stories" | "faq" | "contact" | "apply";

type SiteHeaderProps = {
  active?: NavKey;
};

function AmazonLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" aria-label="Amazon Contributor Program home" className="inline-flex shrink-0 flex-col leading-none">
      <span className={compact ? "text-[22px]" : "text-[27px]"} style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, letterSpacing: "-1.4px" }}>
        amazon
      </span>
      <svg className={compact ? "-mt-1 ml-1 h-[10px] w-[48px]" : "-mt-1 ml-1 h-[12px] w-[56px]"} viewBox="0 0 56 13" fill="none" aria-hidden="true">
        <path d="M4 4.8c11.1 5.2 28.6 6.7 43.1-1.2" stroke="#FF9900" strokeWidth="2.1" strokeLinecap="round" />
        <path d="m42.2 2.7 5.8.1-2.6 4.5" stroke="#FF9900" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

const homepageLinks: Array<[string, string, NavKey]> = [
  ["Home", "/", "home"],
  ["How It Works", "/how-it-works", "how-it-works"],
  ["Payments", "/payments", "payments"],
  ["Success Stories", "/success-stories", "success-stories"],
  ["FAQ", "/faq", "faq"],
  ["Contact", "/contact", "contact"],
];

export function SiteHeader({ active }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = homepageLinks;
  const signInHref = "/login";
  const actionHref = "/apply";
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/95 text-white shadow-[0_4px_24px_rgba(9,22,35,0.16)] backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
        <AmazonLogo />
        <nav className="hidden items-center gap-6 xl:flex" aria-label="Main navigation">
          {links.map(([label, href, key]) => (
            <Link key={key} className={`nav-link ${active === key ? "nav-link-active text-white" : ""}`} to={href}>{label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-5 md:flex">
          <Link className="text-sm font-semibold text-white/85 transition hover:text-orange" to={signInHref}>Sign in</Link>
          <Link aria-current={active === "apply" ? "page" : undefined} className={`rounded-md bg-orange px-5 py-3 text-sm font-bold text-navy shadow-[0_4px_14px_rgba(255,153,0,0.18)] transition hover:-translate-y-0.5 hover:bg-orange-light ${active === "apply" ? "ring-2 ring-orange-light ring-offset-2 ring-offset-navy" : ""}`} to={actionHref}>Apply now</Link>
        </div>
        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
          className="rounded-md p-2 text-white transition hover:bg-white/10 md:hidden"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {menuOpen && (
        <nav className="border-t border-white/10 bg-navy px-5 py-4 md:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-1">
            {links.map(([label, href, key]) => (
              <Link key={key} onClick={closeMenu} className={`rounded-md px-3 py-3 text-sm font-semibold hover:bg-white/5 hover:text-white ${active === key ? "bg-white/5 text-orange" : "text-white/80"}`} to={href}>{label}</Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
              <Link onClick={closeMenu} className="rounded-md border border-white/25 px-4 py-3 text-center text-sm font-semibold" to={signInHref}>Sign in</Link>
              <Link onClick={closeMenu} aria-current={active === "apply" ? "page" : undefined} className={`rounded-md bg-orange px-4 py-3 text-center text-sm font-bold text-navy ${active === "apply" ? "ring-2 ring-orange-light ring-offset-2 ring-offset-navy" : ""}`} to={actionHref}>Apply now</Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-white/10 bg-[#0b1723] px-5 pb-8 pt-10 text-white sm:px-8">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-9 md:flex-row md:items-start">
          <div className="max-w-[280px]"><AmazonLogo compact /><p className="mt-5 text-xs leading-5 text-white/50">Flexible work opportunities for a world of possibilities.</p></div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm sm:grid-cols-3 sm:gap-x-16">
            <Link className="footer-link" to="/#opportunities">Opportunities</Link>
            <Link className="footer-link" to="/how-it-works">How it works</Link>
            <Link className="footer-link" to="/payments">Payments</Link>
            <Link className="footer-link" to="/success-stories">Success stories</Link>
            <Link className="footer-link" to="/faq">FAQ</Link>
            <Link className="footer-link" to="/contact">Contact</Link>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 pt-6 text-[11px] text-white/40 sm:flex-row sm:items-center"><div className="flex gap-5"><Link className="transition hover:text-white" to="/contact">Privacy policy</Link><Link className="transition hover:text-white" to="/contact">Terms of use</Link></div><p>© 2025 Amazon.com, Inc. or its affiliates</p></div>
      </div>
    </footer>
  );
}
