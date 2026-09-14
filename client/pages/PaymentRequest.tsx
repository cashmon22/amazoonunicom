import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  CircleAlert,
  CreditCard,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  AuthenticatedVendorHeader,
  AuthenticatedVendorSidebar,
} from "@/pages/TrustedVendor";
import { vendorDevices, type VendorDevice } from "@shared/vendor-data";
import type { PaymentRequest } from "@shared/payment-requests";
import { createPaymentRequest } from "@/lib/payment-requests";

const initialForm = {
  fullLegalName: "",
  phone: "",
  country: "",
  stateProvince: "",
  city: "",
  postalCode: "",
  shippingAddress: "",
  bankName: "",
  additionalNotes: "",
  confirmation: false,
};

function formatPrice(device: VendorDevice) {
  if (device.price === null) return "Price available on request";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: device.currency,
    maximumFractionDigits: 0,
  }).format(device.price);
}

function formatAmount(request: PaymentRequest) {
  if (request.deviceAmount === null) return "Price available on request";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: request.currency,
    maximumFractionDigits: 0,
  }).format(request.deviceAmount);
}

function fieldClass() {
  return "mt-2 h-11 w-full rounded-md border border-slate-200 bg-[#fbfcfd] px-3 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-orange focus:ring-2 focus:ring-orange/10";
}

export function AuthenticatedShell({
  children,
  onLogout,
  displayName,
  initials,
  isSigningOut,
  mobileNavOpen,
  onOpenMenu,
}: {
  children: ReactNode;
  onLogout: () => void;
  displayName: string;
  initials: string;
  isSigningOut: boolean;
  mobileNavOpen: boolean;
  onOpenMenu: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(mobileNavOpen);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8f9fa] text-ink">
      <AuthenticatedVendorHeader
        displayName={displayName}
        initials={initials}
        isSigningOut={isSigningOut}
        mobileNavOpen={mobileOpen}
        onOpenMenu={() => {
          setMobileOpen(true);
          onOpenMenu();
        }}
        onLogout={onLogout}
      />
      <div className="flex min-h-[calc(100vh-72px)]">
        <aside className="sticky top-[72px] hidden h-[calc(100vh-72px)] w-[250px] shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
          <AuthenticatedVendorSidebar activeItem="Payments" />
        </aside>
        {mobileOpen && (
          <button
            type="button"
            aria-label="Close contributor navigation"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-navy/50 lg:hidden"
          />
        )}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-white shadow-2xl transition-transform duration-200 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex h-[72px] items-center justify-between border-b border-slate-200 px-5">
            <Link
              to="/dashboard"
              aria-label="Amazon Contributor Dashboard"
              className="text-lg font-extrabold text-navy"
            >
              amazon
            </Link>
            <button
              type="button"
              aria-label="Close contributor navigation"
              onClick={() => setMobileOpen(false)}
              className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-navy"
            >
              ×
            </button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <AuthenticatedVendorSidebar activeItem="Payments" />
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

export function PaymentInstructions({ request }: { request: PaymentRequest }) {
  const referenceNumber = `AMZ-${request.id.replace(/-/g, "").slice(0, 12).toUpperCase()}`;

  return (
    <div className="mx-auto max-w-[900px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <section className="rounded-xl border border-emerald-200 bg-white p-6 shadow-card sm:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <Check size={28} />
        </div>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-orange">
          Payment instructions
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-navy sm:text-4xl">
          Payment Request Submitted
        </h1>
        <p className="mt-4 max-w-[610px] text-sm leading-6 text-slate-500">
          Your device payment request has been successfully submitted to Amazon
          Management.
        </p>
        <div className="mt-8 grid gap-4 rounded-lg border border-slate-200 bg-[#fbfcfd] p-5 sm:grid-cols-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
              Reference Number
            </p>
            <p className="mt-1 text-sm font-bold text-navy">
              {referenceNumber}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
              Selected Device
            </p>
            <p className="mt-1 text-sm font-bold text-navy">
              {request.deviceName}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
              Device Amount
            </p>
            <p className="mt-1 text-sm font-bold text-navy">
              {formatAmount(request)}
            </p>
          </div>
        </div>
        <div className="mt-9 border-t border-slate-100 pt-8">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-navy">
            What Happens Next
          </h2>
          <div className="mt-6 space-y-5">
            {[
              [
                "1. Payment Processing",
                "A payment representing the selected device amount will be provided through the approved payment process.",
              ],
              [
                "2. Payment Receipt",
                "Follow the verified payment instructions provided to you through the official process.",
              ],
              [
                "3. Vendor Payment",
                "Once payment is legitimately available, follow the approved instructions for completing payment to the selected vendor.",
              ],
            ].map(([title, detail]) => (
              <div key={title} className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange" />
                <div>
                  <h3 className="text-sm font-extrabold text-navy">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Link
          to="/trusted-vendor"
          className="mt-9 inline-flex items-center gap-2 rounded-md bg-orange px-5 py-3.5 text-sm font-extrabold text-navy shadow-[0_4px_14px_rgba(255,153,0,0.16)] transition hover:bg-orange-light"
        >
          Back to Work Devices <ChevronRight size={16} />
        </Link>
      </section>
    </div>
  );
}

export default function PaymentRequest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session, signOut } = useAuth();
  const [device, setDevice] = useState<VendorDevice | null>(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const email = session?.user.email ?? "";

  useEffect(() => {
    const deviceId = searchParams.get("deviceId");
    setDevice(vendorDevices.find((item) => item.id === deviceId) ?? null);
  }, [searchParams]);

  const amount = useMemo(() => (device ? formatPrice(device) : "—"), [device]);
  const updateField = (
    field: keyof typeof initialForm,
    value: string | boolean,
  ) => {
    setError("");
    setForm((current) => ({ ...current, [field]: value }));
  };

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!device || isSubmitting) return;
    setError("");
    setIsSubmitting(true);
    try {
      const submittedRequest = await createPaymentRequest({
        deviceId: device.id,
        fullLegalName: form.fullLegalName,
        phone: form.phone,
        deliveryAddress: form.shippingAddress,
        city: form.city,
        stateProvince: form.stateProvince,
        postalCode: form.postalCode,
        country: form.country,
        additionalNotes: form.additionalNotes || undefined,
        confirmation: form.confirmation,
      });
      setForm({ ...initialForm });
      navigate("/trusted-vendor/payment-instructions", {
        state: { request: submittedRequest },
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to submit your payment request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthenticatedShell
      onLogout={handleLogout}
      displayName={displayName}
      initials={initials}
      isSigningOut={isSigningOut}
      mobileNavOpen={mobileNavOpen}
      onOpenMenu={() => setMobileNavOpen(true)}
    >
      <div className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        <Link
          to="/trusted-vendor"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-orange"
        >
          <ArrowLeft size={14} /> Back to Work Devices
        </Link>
        <div className="mt-7 max-w-[720px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange">
            Device payment
          </p>
          <h1 className="mt-2 text-[34px] font-extrabold tracking-[-0.045em] text-navy sm:text-[44px]">
            Request Payment for Your Device
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            You have selected the device below. Complete the form to submit your
            payment request.
          </p>
        </div>
        {!device ? (
          <div className="mt-8 rounded-xl border border-orange/30 bg-orange/[0.07] p-5 text-sm text-slate-600">
            <CircleAlert size={18} className="mb-2 text-orange" />
            This device is no longer available. Return to the work-device
            catalog and choose an available product.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
            <section className="h-fit overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
              <img
                src={device.image}
                alt={device.imageAlt}
                className="h-56 w-full object-cover sm:h-64"
              />
              <div className="p-5 sm:p-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-navy px-2.5 py-1.5 text-[9px] font-extrabold tracking-[0.08em] text-white">
                  <ShieldCheck size={11} className="text-orange" /> AMAZON WORK
                  DEVICE
                </span>
                <h2 className="mt-5 text-xl font-extrabold text-navy">
                  {device.name}
                </h2>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {device.model}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-[10px]">
                  <div>
                    <p className="text-slate-400">Memory</p>
                    <p className="mt-1 font-bold text-navy">{device.ram}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Storage</p>
                    <p className="mt-1 font-bold text-navy">{device.storage}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Processor</p>
                    <p className="mt-1 font-bold text-navy">
                      {device.processor}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">Device amount</p>
                    <p className="mt-1 font-bold text-navy">{amount}</p>
                  </div>
                </div>
              </div>
            </section>
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-card sm:p-7"
            >
              <h2 className="text-lg font-extrabold text-navy">User Details</h2>
              <p className="mt-1 text-xs text-slate-500">
                Provide the details needed for your payment request.
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold text-navy">
                    Selected Device
                  </span>
                  <input
                    readOnly
                    value={device.name + " — " + device.model}
                    className={`${fieldClass()} cursor-not-allowed bg-slate-100 text-slate-500`}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold text-navy">
                    Device Amount
                  </span>
                  <input
                    readOnly
                    value={amount}
                    className={`${fieldClass()} cursor-not-allowed bg-slate-100 text-slate-500`}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold text-navy">
                    Full Legal Name
                  </span>
                  <span className="mt-1 block text-[10px] text-slate-400">
                    Enter the name to be used for the payment request.
                  </span>
                  <input
                    required
                    value={form.fullLegalName}
                    onChange={(event) =>
                      updateField("fullLegalName", event.target.value)
                    }
                    className={fieldClass()}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold text-navy">
                    Email Address
                  </span>
                  <input
                    readOnly
                    value={email}
                    className={`${fieldClass()} cursor-not-allowed bg-slate-100 text-slate-500`}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-navy">
                    Phone Number
                  </span>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    className={fieldClass()}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-navy">Country</span>
                  <select
                    required
                    value={form.country}
                    onChange={(event) =>
                      updateField("country", event.target.value)
                    }
                    className={fieldClass()}
                  >
                    <option value="">Select country</option>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>India</option>
                    <option>Australia</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold text-navy">
                    Shipping Address
                  </span>
                  <input
                    required
                    value={form.shippingAddress}
                    onChange={(event) =>
                      updateField("shippingAddress", event.target.value)
                    }
                    className={fieldClass()}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-navy">City</span>
                  <select
                    required
                    value={form.city}
                    onChange={(event) =>
                      updateField("city", event.target.value)
                    }
                    className={fieldClass()}
                  >
                    <option value="">Select city</option>
                    <option>New York</option>
                    <option>Los Angeles</option>
                    <option>Toronto</option>
                    <option>London</option>
                    <option>Mumbai</option>
                    <option>Sydney</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-navy">
                    State / Province
                  </span>
                  <select
                    required
                    value={form.stateProvince}
                    onChange={(event) =>
                      updateField("stateProvince", event.target.value)
                    }
                    className={fieldClass()}
                  >
                    <option value="">Select state / province</option>
                    <option>California</option>
                    <option>New York</option>
                    <option>Texas</option>
                    <option>Ontario</option>
                    <option>British Columbia</option>
                    <option>England</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-navy">
                    Postal Code
                  </span>
                  <input
                    required
                    autoComplete="postal-code"
                    value={form.postalCode}
                    onChange={(event) =>
                      updateField("postalCode", event.target.value)
                    }
                    className={fieldClass()}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-navy">
                    Bank / Financial Institution Name
                  </span>
                  <input
                    required
                    value={form.bankName}
                    onChange={(event) =>
                      updateField("bankName", event.target.value)
                    }
                    className={fieldClass()}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold text-navy">
                    Additional Notes{" "}
                    <span className="font-normal text-slate-400">
                      (Optional)
                    </span>
                  </span>
                  <textarea
                    value={form.additionalNotes}
                    onChange={(event) =>
                      updateField("additionalNotes", event.target.value)
                    }
                    className="mt-2 min-h-24 w-full rounded-md border border-slate-200 bg-[#fbfcfd] px-3 py-3 text-sm text-navy outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/10"
                  />
                </label>
              </div>
              <section className="mt-8 rounded-xl border border-orange/30 bg-orange/[0.06] p-5 sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange">
                  Payment Workflow
                </p>
                <h2 className="mt-2 text-xl font-extrabold text-navy">
                  Amazon Management Payment Procedure
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Amazon Management will issue a check for the approved amount
                  of the selected device.
                </p>
                <div className="mt-5 space-y-4">
                  {[
                    [
                      "Step 1 — Check Issuance",
                      "After the request is submitted, Amazon Management will issue the device-payment check for the selected device amount.",
                    ],
                    [
                      "Step 2 — Check Delivery",
                      "The check will be delivered to the email/address associated with the user's payment request.",
                    ],
                    [
                      "Step 3 — Mobile Deposit",
                      "the user then follows their financial institution's mobile-deposit process to deposit the check.",
                    ],
                    [
                      "Step 4 — Vendor Payment",
                      "After the funds become available, the user uses the available amount to pay the trusted vendor for the selected device.",
                    ],
                  ].map(([title, description]) => (
                    <div key={title} className="flex gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange text-[10px] font-extrabold text-navy">
                        {title.charAt(5)}
                      </span>
                      <p className="text-xs leading-5 text-slate-600">
                        <strong className="text-navy">{title}</strong>
                        <br />
                        {description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
              <label className="mt-6 flex items-start gap-3 text-xs leading-5 text-slate-600">
                <input
                  required
                  type="checkbox"
                  checked={form.confirmation}
                  onChange={(event) =>
                    updateField("confirmation", event.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-[#ff9900]"
                />
                <span>
                  I confirm that the information above is accurate and that I
                  understand the device-payment process described above.
                </span>
              </label>
              {error && (
                <div
                  role="alert"
                  className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-800"
                >
                  <CircleAlert size={15} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}
              <button
                disabled={isSubmitting}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-orange px-5 py-3.5 text-sm font-extrabold text-navy shadow-[0_4px_14px_rgba(255,153,0,0.16)] transition hover:bg-orange-light disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                {isSubmitting
                  ? "Submitting Payment Request..."
                  : "Submit Payment Request"}
              </button>
            </form>
          </div>
        )}
      </div>
    </AuthenticatedShell>
  );
}
