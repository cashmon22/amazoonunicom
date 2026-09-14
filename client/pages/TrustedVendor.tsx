import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  BriefcaseBusiness,
  CircleDollarSign,
  CreditCard,
  Filter,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  MonitorCheck,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { vendorDevices, type DeviceCategory, type VendorDevice } from "@/vendor-data";
import { supabase } from "@/lib/supabase";

type AvailableDeviceRecord = {
  id: string;
  name: string;
  model: string;
  specifications: string;
  amount: number | null;
  status: string;
  image_url: string | null;
};

const neutralDevicePlaceholder = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400"><rect width="640" height="400" fill="#f1f4f6"/><rect x="190" y="105" width="260" height="160" rx="12" fill="#d8e0e7"/><rect x="208" y="123" width="224" height="112" rx="5" fill="#eef2f5"/><path d="M140 285h360l-28 22H168z" fill="#b6c2cc"/></svg>')}`;


function getAvailableDeviceImage(imagePath: string | null) {
  if (!imagePath) return neutralDevicePlaceholder;
  if (/^https?:\/\//i.test(imagePath)) return imagePath;

  const publicUrl = supabase.storage
    .from("device-images")
    .getPublicUrl(imagePath)
    .data.publicUrl;

  return publicUrl || neutralDevicePlaceholder;
}

async function listAvailableDevices(): Promise<VendorDevice[]> {
  const { data, error } = await supabase
    .from("devices")
    .select("id,name,model,specifications,amount,status,image_url")
    .eq("status", "Available");

  if (error) throw error;

  return ((data ?? []) as AvailableDeviceRecord[]).map((device) => ({
    id: device.id,
    name: device.name,
    model: device.model,

    image: getAvailableDeviceImage(device.image_url),

    imageAlt: `${device.name} device`,
    price: device.amount,
    currency: "USD",
    ram: "—",
    storage: device.specifications,
    processor: "—",
    condition: "Admin inventory",
    availability: "Available",
    workDeviceStatus: "Amazon Work Device",
    description: device.specifications,
    features: [device.specifications],
    category: "Laptop",
  }));
}

const authenticatedNavItems = [
  ["Dashboard", LayoutDashboard, "/dashboard"],
  ["Assignments", BriefcaseBusiness, "/dashboard"],
  ["Earnings", CircleDollarSign, "/dashboard"],
  ["Payments", CreditCard, "/dashboard"],
  ["Profile", UserRound, "/dashboard"],
  ["Device Authorization", MonitorCheck, "/trusted-vendor"],
  ["Help Center", HelpCircle, "/dashboard"],
  ["Settings", Settings, "/dashboard"],
] as const;

function ContributorLogo({ dark = false }: { dark?: boolean }) {
  return (
    <Link
      to="/dashboard"
      aria-label="Amazon Contributor Dashboard"
      className={`inline-flex shrink-0 flex-col leading-none ${
        dark ? "text-navy" : "text-white"
      }`}
    >
      <span
        className="text-[24px] font-bold tracking-[-1.4px]"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        amazon
      </span>
      <svg
        className="-mt-1 ml-1 h-[10px] w-[48px]"
        viewBox="0 0 56 13"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 4.8c11.1 5.2 28.6 6.7 43.1-1.2"
          stroke="#FF9900"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <path
          d="m42.2 2.7 5.8.1-2.6 4.5"
          stroke="#FF9900"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

export function AuthenticatedVendorSidebar({
  activeItem = "Device Authorization",
}: {
  activeItem?: string;
}) {
  return (
    <>
      <div className="border-b border-slate-200 px-5 py-5">
        <ContributorLogo dark />
        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Contributor workspace
        </p>
        <p className="mt-1 text-sm font-extrabold text-navy">
          Amazon Contributor Program
        </p>
      </div>

      <nav
        className="px-3 py-4"
        aria-label="Contributor workspace navigation"
      >
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Workspace
        </p>

        <div className="space-y-1">
          {authenticatedNavItems.slice(0, 6).map(([label, Icon, href]) => {
            const active = label === activeItem;

            return (
              <Link
                key={label}
                to={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-xs font-semibold transition ${
                  active
                    ? "bg-orange/10 text-orange"
                    : "text-slate-500 hover:bg-slate-50 hover:text-navy"
                }`}
              >
                <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                <span className="min-w-0 flex-1">{label}</span>
                {active && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </div>

        <p className="px-3 pb-2 pt-7 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Support
        </p>

        <div className="space-y-1">
          {authenticatedNavItems
            .slice(6)
            .map(([label, Icon, href]) => (
              <Link
                key={label}
                to={href}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-navy"
              >
                <Icon size={16} strokeWidth={1.8} />
                <span className="min-w-0 flex-1">{label}</span>
              </Link>
            ))}
        </div>
      </nav>

      <div className="mt-auto border-t border-slate-200 p-4">
        <div className="flex items-start gap-3 rounded-lg bg-[#f8f9fa] p-3">
          <ShieldCheck
            size={16}
            className="mt-0.5 shrink-0 text-orange"
          />
          <div>
            <p className="text-[10px] font-extrabold text-navy">
              Secure workspace
            </p>
            <p className="mt-1 text-[10px] leading-4 text-slate-500">
              Your account information is protected.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function SectionEyebrow({ children }: { children: string }) {
  return (
    <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange">
      {children}
    </p>
  );
}

function formatPrice(device: VendorDevice) {
  if (device.price === null) return "Price available on request";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: device.currency,
    maximumFractionDigits: 0,
  }).format(device.price);
}

function contactSellerUrl(device: VendorDevice) {
  const message = `Hello, I'm interested in the ${device.name} listed on your website. Is this device still available? Please let me know the availability and next steps. Thank you.`;

  return `https://t.me/AuthorizedDeviceDesk?text=${encodeURIComponent(message)}`;
}

export function AuthenticatedVendorHeader({
  displayName,
  initials,
  isSigningOut,
  mobileNavOpen,
  onOpenMenu,
  onLogout,
}: {
  displayName: string;
  initials: string;
  isSigningOut: boolean;
  mobileNavOpen: boolean;
  onOpenMenu: () => void;
  onLogout: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy text-white shadow-[0_4px_24px_rgba(9,22,35,0.18)]">
      <div className="flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Open contributor navigation"
            aria-expanded={mobileNavOpen}
            onClick={onOpenMenu}
            className="rounded-md p-2 text-white/80 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <Menu size={22} />
          </button>

          <ContributorLogo />

          <span className="hidden h-6 border-l border-white/20 sm:block" />

          <span className="hidden text-xs font-semibold text-white/60 sm:block">
            Amazon Contributor Portal
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            to="/dashboard"
            aria-label="View notifications"
            className="relative rounded-md p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <Bell size={18} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-orange" />
          </Link>

          <div className="hidden h-7 border-l border-white/15 sm:block" />

          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange text-xs font-extrabold text-navy">
              {initials}
            </span>

            <div className="hidden leading-tight sm:block">
              <p className="text-xs font-bold text-white">{displayName}</p>
              <p className="mt-1 text-[10px] text-white/50">
                Approved contributor
              </p>
            </div>
          </div>

          <div className="hidden h-7 border-l border-white/15 sm:block" />

          <button
            type="button"
            onClick={onLogout}
            disabled={isSigningOut}
            aria-busy={isSigningOut}
            aria-label="Log out"
            className="flex items-center gap-2 rounded-md p-2 text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={17} />
            <span className="hidden text-xs font-semibold sm:inline">
              {isSigningOut ? "Signing out..." : "Log out"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

function DeviceCard({
  device,
  onOpen,
}: {
  device: VendorDevice;
  onOpen: () => void;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:border-orange/40 hover:shadow-elevated">
      <button
        type="button"
        onClick={onOpen}
        className="relative block w-full overflow-hidden bg-[#f1f4f6] text-left"
        aria-label={`View details for ${device.name}`}
      >
        <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-navy px-2.5 py-1.5 text-[9px] font-extrabold tracking-[0.08em] text-white shadow-lg">
          <ShieldCheck size={11} className="text-orange" />
          AMAZON WORK DEVICE
        </div>

        <img
          src={device.image}
          alt={device.imageAlt}
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:h-56"
        />
      </button>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <button
              type="button"
              onClick={onOpen}
              className="text-left text-base font-extrabold tracking-[-0.02em] text-navy transition hover:text-orange"
            >
              {device.name}
            </button>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              {device.model}
            </p>
          </div>

          <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">
            {device.availability}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-slate-100 py-4 text-[10px]">
          <div>
            <p className="text-slate-400">Storage</p>
            <p className="mt-1 font-bold text-navy">{device.storage}</p>
          </div>

          <div>
            <p className="text-slate-400">Memory</p>
            <p className="mt-1 font-bold text-navy">{device.ram}</p>
          </div>

          <div>
            <p className="text-slate-400">Processor</p>
            <p className="mt-1 font-bold text-navy">{device.processor}</p>
          </div>

          <div>
            <p className="text-slate-400">Condition</p>
            <p className="mt-1 font-bold text-navy">{device.condition}</p>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold text-slate-400">
              Listed price
            </p>
            <p className="mt-1 text-sm font-extrabold text-navy">
              {formatPrice(device)}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-navy transition hover:text-orange"
          >
            View details
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link
            to={`/trusted-vendor/request-payment?deviceId=${encodeURIComponent(
              device.id
            )}`}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-orange px-3 py-3 text-xs font-extrabold text-navy shadow-[0_4px_14px_rgba(255,153,0,0.16)] transition hover:-translate-y-0.5 hover:bg-orange-light"
          >
            <CreditCard size={14} />
            Request Payment
          </Link>

          <a
            href={contactSellerUrl(device)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-slate-200 px-3 py-3 text-xs font-extrabold text-navy transition hover:border-orange hover:text-orange"
          >
            Contact Seller
          </a>
        </div>
      </div>
    </article>
  );
}

function DeviceDetailsModal({
  device,
  onClose,
}: {
  device: VendorDevice;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () =>
      document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-navy/70 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="relative my-6 w-full max-w-[900px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="device-details-title"
        aria-describedby="device-details-description"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close device details"
          className="absolute right-4 top-4 z-10 rounded-md bg-white/90 p-2 text-slate-500 shadow-sm transition hover:bg-white hover:text-navy"
        >
          <X size={19} />
        </button>

        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-[#f1f4f6] p-5 sm:p-8">
            <img
              src={device.image}
              alt={device.imageAlt}
              className="h-full max-h-[430px] min-h-[250px] w-full rounded-lg object-cover shadow-card"
            />
          </div>

          <div className="p-6 sm:p-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-navy px-2.5 py-1.5 text-[9px] font-extrabold tracking-[0.08em] text-white">
              <ShieldCheck size={11} className="text-orange" />
              AMAZON WORK DEVICE
            </span>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-orange">
              {device.category}
            </p>

            <h2
              id="device-details-title"
              className="mt-2 text-2xl font-extrabold tracking-[-0.035em] text-navy sm:text-3xl"
            >
              {device.name}
            </h2>

            <p className="mt-2 text-sm font-semibold text-slate-500">
              {device.model}
            </p>

            <p
              id="device-details-description"
              className="mt-5 text-sm leading-6 text-slate-500"
            >
              {device.description}
            </p>

            <div className="mt-6">
              <h3 className="text-xs font-extrabold uppercase tracking-[0.14em] text-navy">
                Work-from-home features
              </h3>

              <ul className="mt-3 space-y-2">
                {device.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-2 text-xs leading-5 text-slate-500"
                  >
                    <Check
                      size={14}
                      className="mt-0.5 shrink-0 text-orange"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-xs font-extrabold uppercase tracking-[0.14em] text-navy">
                Specifications
              </h3>

              <div className="mt-3 grid grid-cols-2 gap-3 border-y border-slate-100 py-5 text-xs sm:grid-cols-3">
                {[
                  ["Storage", device.storage],
                  ["Memory", device.ram],
                  ["Processor", device.processor],
                  ["Condition", device.condition],
                  ["Availability", device.availability],
                  ["Work status", device.workDeviceStatus],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[10px] text-slate-400">{label}</p>
                    <p className="mt-1 font-bold text-navy">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <span className="text-[10px] font-semibold text-slate-400">
                Listed price
              </span>
              <span className="text-lg font-extrabold text-navy">
                {formatPrice(device)}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link
                to={`/trusted-vendor/request-payment?deviceId=${encodeURIComponent(
                  device.id
                )}`}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-orange px-4 py-3.5 text-xs font-extrabold text-navy transition hover:bg-orange-light"
              >
                <CreditCard size={15} />
                Request Payment
              </Link>

              <a
                href={contactSellerUrl(device)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-slate-200 px-4 py-3.5 text-xs font-extrabold text-navy transition hover:border-orange hover:text-orange"
              >
                Contact Seller
              </a>
            </div>

            <div className="mt-5 flex items-start gap-2 rounded-md bg-[#f8f9fa] p-3 text-[10px] leading-4 text-slate-500">
              <Check
                size={14}
                className="mt-0.5 shrink-0 text-orange"
              />
              Submit a payment request to begin the Amazon Management payment
              procedure.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const categories: Array<"All" | DeviceCategory> = ["All", "Laptop"];

export default function TrustedVendor() {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();

  const [query, setQuery] = useState("");
  const [category, setCategory] =
    useState<(typeof categories)[number]>("All");
  const [selectedDevice, setSelectedDevice] =
    useState<VendorDevice | null>(null);
  const [additionalDevices, setAdditionalDevices] =
    useState<VendorDevice[]>([]);
  const [inventoryError, setInventoryError] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const displayName =
    session?.user.user_metadata?.full_name ||
    session?.user.email?.split("@")[0] ||
    "Contributor";

  const initials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CN";

  useEffect(() => {
    let isMounted = true;

    void listAvailableDevices()
      .then((devices) => {
        if (!isMounted) return;

        setAdditionalDevices(devices);
        setInventoryError("");
      })
      .catch((loadError) => {
        if (!isMounted) return;

        setInventoryError(
          loadError instanceof Error
            ? loadError.message
            : typeof loadError === "object" &&
                loadError !== null &&
                "message" in loadError
              ? String(loadError.message)
              : String(loadError)
        );
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const devices = useMemo(
    () => [...vendorDevices, ...additionalDevices],
    [additionalDevices]
  );

  const handleLogout = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      await signOut();
      navigate("/login", { replace: true });
    } finally {
      setIsSigningOut(false);
    }
  };

  const filteredDevices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return devices.filter((device) => {
      const matchesCategory =
        category === "All" || device.category === category;

      const matchesQuery =
        !normalizedQuery ||
        [
          device.name,
          device.model,
          device.processor,
          device.storage,
        ].some((value) =>
          value.toLowerCase().includes(normalizedQuery)
        );

      return matchesCategory && matchesQuery;
    });
  }, [category, devices, query]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8f9fa] text-ink">
      <AuthenticatedVendorHeader
        displayName={displayName}
        initials={initials}
        isSigningOut={isSigningOut}
        mobileNavOpen={mobileNavOpen}
        onOpenMenu={() => setMobileNavOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex min-h-[calc(100vh-72px)]">
        <aside className="sticky top-[72px] hidden h-[calc(100vh-72px)] w-[250px] shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
          <AuthenticatedVendorSidebar />
        </aside>

        {mobileNavOpen && (
          <button
            type="button"
            aria-label="Close contributor navigation"
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 z-40 bg-navy/50 lg:hidden"
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-white shadow-2xl transition-transform duration-200 lg:hidden ${
            mobileNavOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-[72px] items-center justify-between border-b border-slate-200 px-5">
            <ContributorLogo dark />

            <button
              type="button"
              aria-label="Close contributor navigation"
              onClick={() => setMobileNavOpen(false)}
              className="rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-navy"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <AuthenticatedVendorSidebar />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <section className="relative overflow-hidden bg-navy text-white">
            <div className="absolute -right-40 -top-48 h-[520px] w-[520px] rounded-full border border-white/[0.05]" />
            <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-orange/[0.08] blur-3xl" />

            <div className="relative mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:px-8 lg:py-20">
              <div className="max-w-[760px]">
                <SectionEyebrow>Trusted Vendor</SectionEyebrow>

                <h1 className="text-[42px] font-extrabold leading-[1.06] tracking-[-0.045em] sm:text-[58px]">
                  Amazon Authorized{" "}
                  <span className="text-orange">Work Devices</span>
                </h1>

                <p className="mt-6 max-w-[680px] text-base leading-7 text-white/70">
                  Choose a supported amazon work device from our available
                  inventory and submit a payment request for the selected
                  device.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-semibold text-white/65">
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-orange" />
                    Approved-device inventory
                  </span>

                  <span className="flex items-center gap-2">
                    <CreditCard size={15} className="text-orange" />
                    Secure payment request
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
            <div className="mx-auto flex max-w-[1240px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative min-w-0 flex-1 md:max-w-[520px]">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <label htmlFor="device-search" className="sr-only">
                  Search devices
                </label>

                <input
                  id="device-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by device, model, or processor"
                  className="h-11 w-full rounded-md border border-slate-200 bg-[#fbfcfd] pl-10 pr-3 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-orange focus:ring-2 focus:ring-orange/10"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto">
                <Filter size={15} className="shrink-0 text-slate-400" />

                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`rounded-md px-4 py-2.5 text-xs font-bold transition ${
                      category === item
                        ? "bg-orange text-navy"
                        : "border border-slate-200 bg-white text-slate-500 hover:border-orange hover:text-orange"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#f8f9fa] px-5 py-14 sm:px-8 lg:py-20">
            <div className="mx-auto max-w-[1240px]">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <SectionEyebrow>Available inventory</SectionEyebrow>

                  <h2 className="section-title">
                    Choose your supported device
                  </h2>

                  <p className="mt-3 max-w-[590px] text-sm leading-6 text-slate-500">
                    Browse the current selection, open any device for complete
                    specifications, and request payment for your selected
                    device.
                  </p>
                </div>

                <p className="text-xs font-semibold text-slate-400">
                  {filteredDevices.length}{" "}
                  {filteredDevices.length === 1 ? "device" : "devices"}{" "}
                  available
                </p>
              </div>

              {inventoryError && (
                <div
                  className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                  role="alert"
                >
                  Unable to load available devices: {inventoryError}
                </div>
              )}

              {filteredDevices.length > 0 ? (
                <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredDevices.map((device) => (
                    <DeviceCard
                      key={device.id}
                      device={device}
                      onOpen={() => setSelectedDevice(device)}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
                  <Search size={24} className="mx-auto text-slate-300" />

                  <h3 className="mt-4 text-sm font-extrabold text-navy">
                    No devices match your search
                  </h3>

                  <p className="mt-2 text-xs text-slate-500">
                    Try another search or clear the current filter.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setCategory("All");
                    }}
                    className="mt-5 inline-flex items-center gap-2 rounded-md bg-orange px-4 py-2.5 text-xs font-extrabold text-navy"
                  >
                    Clear filters
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white px-5 py-14 sm:px-8 lg:py-20">
            <div className="mx-auto grid max-w-[1060px] gap-5 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
                <ShieldCheck size={20} className="text-orange" />
                <h3 className="mt-4 text-sm font-extrabold text-navy">
                  Supported work devices
                </h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Each listing is presented as an approved work-device option
                  for the contributor experience.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
                <CreditCard size={20} className="text-orange" />
                <h3 className="mt-4 text-sm font-extrabold text-navy">
                  Payment requests
                </h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Selected device information is included automatically in
                  every payment request.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
                <Check size={20} className="text-orange" />
                <h3 className="mt-4 text-sm font-extrabold text-navy">
                  No online checkout
                </h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Complete the secure payment-request form to receive the next
                  payment instructions.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-navy to-[#1b3247] px-5 py-14 text-white sm:px-8 lg:py-16">
            <div className="mx-auto flex max-w-[1020px] flex-col items-center justify-between gap-7 text-center sm:flex-row sm:text-left">
              <div>
                <SectionEyebrow>Need assistance?</SectionEyebrow>

                <h2 className="text-[28px] font-extrabold tracking-[-0.035em] sm:text-[34px]">
                  Talk with the trusted vendor
                </h2>

                <p className="mt-2 max-w-[540px] text-sm text-white/60">
                  If you need help choosing a device, use Contact Seller on any
                  listing to ask about availability, delivery, and payment.
                </p>
              </div>

              <Link
                to="/contact"
                className="inline-flex shrink-0 items-center gap-2 rounded-md border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition hover:border-orange hover:text-orange"
              >
                General support
                <ArrowRight size={15} />
              </Link>
            </div>
          </section>
        </main>
      </div>

      {selectedDevice && (
        <DeviceDetailsModal
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
        />
      )}
    </div>
  );
}
