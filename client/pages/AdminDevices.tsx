import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  AlertCircle,
  Check,
  Clock3,
  Eye,
  ImagePlus,
  LoaderCircle,
  Monitor,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { AdminDevice, AdminDeviceInput } from "@/lib/admin-devices";
import {
  createAdminDevice,
  deleteAdminDevice,
  listAdminDevices,
  updateAdminDevice,
  uploadAdminDeviceImage,
} from "@/lib/admin-devices";
import { listPaymentRequests, updatePaymentRequestStatus } from "@/lib/payment-requests";
import type { PaymentRequest, PaymentRequestStatus } from "@shared/payment-requests";

const deviceStatuses = ["Available", "Unavailable", "Reserved"];
const adminRequestStatuses = ["Under Review", "Approved", "Rejected"] as const;
type AdminRequestStatus = (typeof adminRequestStatuses)[number];

type DeviceForm = {
  name: string;
  model: string;
  specifications: string;
  amount: string;
  status: string;
};

const emptyForm: DeviceForm = {
  name: "",
  model: "",
  specifications: "",
  amount: "",
  status: "Available",
};

function formFromDevice(device: AdminDevice): DeviceForm {
  return {
    name: device.name,
    model: device.model,
    specifications: device.specifications,
    amount: device.amount === null ? "" : String(device.amount),
    status: device.status,
  };
}

function formatAmount(amount: number | null, currency = "USD") {
  if (amount === null) return "Price on request";
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function referenceNumber(id: string) {
  return `AMZ-${id.replace(/-/g, "").slice(0, 12).toUpperCase()}`;
}

function requestAddress(request: PaymentRequest) {
  return [request.deliveryAddress, request.city, request.stateProvince, request.postalCode, request.country].filter(Boolean).join(", ");
}

function requestAdminStatus(status: PaymentRequestStatus): AdminRequestStatus {
  return status === "Approved" || status === "Rejected" ? status : "Under Review";
}

function storedRequestStatus(status: AdminRequestStatus): PaymentRequestStatus {
  return status === "Under Review" ? "Pending Review" : status;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-bold text-navy">{children}</span>;
}

function StatusPill({ status }: { status: string }) {
  const isApproved = status === "Approved";
  const isRejected = status === "Rejected";
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${isApproved ? "bg-emerald-50 text-emerald-700" : isRejected ? "bg-red-50 text-red-700" : "bg-orange/10 text-orange"}`}>{status}</span>;
}

export default function AdminDevices() {
  const [devices, setDevices] = useState<AdminDevice[]>([]);
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestsLoading, setIsRequestsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [requestError, setRequestError] = useState("");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState<DeviceForm>(emptyForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<AdminDevice | null>(null);
  const [deviceToDelete, setDeviceToDelete] = useState<AdminDevice | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(null);

  const loadDevices = async () => {
    setIsLoading(true);
    setError("");
    try {
      setDevices(await listAdminDevices());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load devices.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadRequests = async () => {
    setIsRequestsLoading(true);
    setRequestError("");
    try {
      setRequests(await listPaymentRequests());
    } catch (loadError) {
      setRequestError(loadError instanceof Error ? loadError.message : "Unable to load device requests.");
    } finally {
      setIsRequestsLoading(false);
    }
  };

  useEffect(() => {
    void Promise.all([loadDevices(), loadRequests()]);
  }, []);

  useEffect(() => {
    if (!selectedImage) {
      setImagePreview(editingDevice?.imageUrl ?? null);
      return;
    }
    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [editingDevice, selectedImage]);

  const filteredDevices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return devices;
    return devices.filter((device) => [device.name, device.model, device.specifications, device.status].some((value) => value.toLowerCase().includes(normalizedQuery)));
  }, [devices, query]);

  const openCreateForm = () => {
    setEditingDevice(null);
    setForm(emptyForm);
    setSelectedImage(null);
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditForm = (device: AdminDevice) => {
    setEditingDevice(device);
    setForm(formFromDevice(device));
    setSelectedImage(null);
    setFormError("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (isSaving) return;
    setEditingDevice(null);
    setForm(emptyForm);
    setSelectedImage(null);
    setFormError("");
    setIsFormOpen(false);
  };

  const updateForm = (field: keyof DeviceForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setSelectedImage(null);
      setFormError("Choose a PNG, JPG, or WebP image smaller than 5 MB.");
      return;
    }
    setFormError("");
    setSelectedImage(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = form.name.trim();
    const trimmedModel = form.model.trim();
    const trimmedSpecifications = form.specifications.trim();
    const amount = form.amount.trim() === "" ? null : Number(form.amount);
    if (!trimmedName || !trimmedModel || !trimmedSpecifications || !form.status) {
      setFormError("Complete all device fields before saving.");
      return;
    }
    if (amount !== null && (!Number.isFinite(amount) || amount < 0)) {
      setFormError("Enter a valid non-negative amount.");
      return;
    }

    const input: AdminDeviceInput = {
      name: trimmedName,
      model: trimmedModel,
      specifications: trimmedSpecifications,
      amount,
      status: form.status,
    };
    setIsSaving(true);
    setFormError("");
    try {
      const savedDevice = editingDevice ? await updateAdminDevice(editingDevice.id, input) : await createAdminDevice(input);
      if (selectedImage) await uploadAdminDeviceImage(savedDevice.id, selectedImage);
      await loadDevices();
      setIsFormOpen(false);
      setEditingDevice(null);
      setForm(emptyForm);
      setSelectedImage(null);
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : "Unable to save device.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deviceToDelete) return;
    setError("");
    try {
      await deleteAdminDevice(deviceToDelete.id);
      setDevices((current) => current.filter((device) => device.id !== deviceToDelete.id));
      setDeviceToDelete(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete device.");
    }
  };

  const handleRequestStatusChange = async (request: PaymentRequest, status: AdminRequestStatus) => {
    setUpdatingRequestId(request.id);
    setRequestError("");
    try {
      const storedStatus = storedRequestStatus(status);
      await updatePaymentRequestStatus(request.id, storedStatus);
      setRequests((current) => current.map((item) => item.id === request.id ? { ...item, status: storedStatus } : item));
      setSelectedRequest((current) => current?.id === request.id ? { ...current, status: storedStatus } : current);
    } catch (statusError) {
      setRequestError(statusError instanceof Error ? statusError.message : "Unable to update request status.");
    } finally {
      setUpdatingRequestId(null);
    }
  };

  return (
    <section aria-labelledby="devices-heading">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange">Administrator workspace</p>
          <h2 id="devices-heading" className="mt-2 text-[32px] font-extrabold tracking-[-0.04em] text-navy sm:text-[40px]">Device Management</h2>
          <p className="mt-3 max-w-[640px] text-sm leading-6 text-slate-500">Manage the contributor device inventory and review incoming payment requests from one protected workspace.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><ShieldCheck size={16} className="text-orange" /> Protected administrator data</div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Inventory devices" value={isLoading ? "—" : devices.length} detail="Records in public.devices" icon={Monitor} />
        <SummaryCard label="Requests to review" value={isRequestsLoading ? "—" : requests.filter((request) => requestAdminStatus(request.status) === "Under Review").length} detail="Awaiting an admin decision" icon={Clock3} />
        <SummaryCard label="Approved requests" value={isRequestsLoading ? "—" : requests.filter((request) => request.status === "Approved").length} detail="Current request status" icon={Check} />
      </div>

      {error && <AlertMessage message={error} onDismiss={() => setError("")} />}

      <section className="mt-8" aria-labelledby="inventory-heading">
        <SectionHeader eyebrow="Device inventory" title="Manage inventory" description="View, update, and maintain the devices available to the contributor program." action={<button type="button" onClick={openCreateForm} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-orange px-5 text-xs font-extrabold text-navy shadow-[0_6px_18px_rgba(255,153,0,0.16)] transition hover:bg-orange-light"><Plus size={16} /> Add device</button>} />
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div><h3 id="inventory-heading" className="text-sm font-extrabold text-navy">Inventory records</h3><p className="mt-1 text-xs text-slate-500">{isLoading ? "Loading devices..." : `${filteredDevices.length} device${filteredDevices.length === 1 ? "" : "s"}${query.trim() ? ` matching “${query.trim()}”` : ""}`}</p></div>
            <label className="relative w-full sm:max-w-[330px]"><span className="sr-only">Search devices</span><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search inventory" className="h-10 w-full rounded-lg border border-slate-200 bg-[#fbfcfd] pl-9 pr-3 text-xs text-navy outline-none transition placeholder:text-slate-400 focus:border-orange focus:ring-2 focus:ring-orange/10" /></label>
          </div>
          {isLoading ? <LoadingState label="Loading inventory records..." /> : filteredDevices.length === 0 ? <EmptyState icon={Monitor} title="No devices found" detail={query ? "Try a different search term." : "Add a device to begin building the inventory."} /> : <div className="overflow-x-auto"><table className="w-full min-w-[920px] text-left"><thead className="bg-[#fbfcfd] text-[10px] font-bold uppercase tracking-wide text-slate-400"><tr><th className="px-6 py-3">Device</th><th className="px-6 py-3">Model</th><th className="px-6 py-3">Specifications</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Status</th><th className="px-6 py-3"><span className="sr-only">Actions</span></th></tr></thead><tbody className="divide-y divide-slate-100">{filteredDevices.map((device) => <tr key={device.id} className="transition hover:bg-[#fbfcfd]"><td className="px-6 py-4"><div className="flex items-center gap-3"><DeviceThumbnail device={device} /><span className="text-sm font-bold text-navy">{device.name}</span></div></td><td className="px-6 py-4 text-sm text-slate-600">{device.model}</td><td className="max-w-[260px] px-6 py-4 text-sm text-slate-500"><span className="line-clamp-2">{device.specifications}</span></td><td className="px-6 py-4 text-sm font-semibold text-navy">{formatAmount(device.amount)}</td><td className="px-6 py-4"><StatusPill status={device.status} /></td><td className="px-6 py-4"><div className="flex items-center justify-end gap-1"><button type="button" onClick={() => openEditForm(device)} className="rounded-lg p-2 text-slate-400 transition hover:bg-orange/10 hover:text-orange" aria-label={`Edit ${device.name}`}><Pencil size={16} /></button><button type="button" onClick={() => setDeviceToDelete(device)} className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${device.name}`}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div>}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="requests-heading">
        <SectionHeader eyebrow="Device requests" title="Review submissions" description="Open each request for complete details and keep its review status current." action={<button type="button" onClick={() => void loadRequests()} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-xs font-extrabold text-navy transition hover:border-orange/40 hover:text-orange"><RefreshCw size={15} /> Refresh</button>} />
        {requestError && <div className="mt-5"><AlertMessage message={requestError} onDismiss={() => setRequestError("")} /></div>}
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
          {isRequestsLoading ? <LoadingState label="Loading submitted requests..." /> : requests.length === 0 ? <EmptyState icon={Clock3} title="No device requests yet" detail="Submitted requests will appear here for review." /> : <div className="overflow-x-auto"><table className="w-full min-w-[1060px] text-left"><thead className="bg-[#fbfcfd] text-[10px] font-bold uppercase tracking-wide text-slate-400"><tr><th className="px-6 py-3">Reference</th><th className="px-6 py-3">Submitted</th><th className="px-6 py-3">User</th><th className="px-6 py-3">Device</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Status</th><th className="px-6 py-3"><span className="sr-only">Actions</span></th></tr></thead><tbody className="divide-y divide-slate-100">{requests.map((request) => <tr key={request.id} className="transition hover:bg-[#fbfcfd]"><td className="whitespace-nowrap px-6 py-4 text-xs font-extrabold text-navy">{referenceNumber(request.id)}</td><td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">{formatDate(request.createdAt)}</td><td className="px-6 py-4"><p className="text-sm font-bold text-navy">{request.fullLegalName}</p><p className="mt-1 text-xs text-slate-500">{request.email}</p></td><td className="px-6 py-4"><p className="text-sm font-semibold text-navy">{request.deviceName}</p><p className="mt-1 text-xs text-slate-500">{request.deviceModel}</p></td><td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-navy">{formatAmount(request.deviceAmount, request.currency)}</td><td className="px-6 py-4"><select value={requestAdminStatus(request.status)} disabled={updatingRequestId === request.id} onChange={(event) => void handleRequestStatusChange(request, event.target.value as AdminRequestStatus)} className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-navy outline-none focus:border-orange focus:ring-2 focus:ring-orange/10">{adminRequestStatuses.map((status) => <option key={status}>{status}</option>)}</select></td><td className="px-6 py-4 text-right"><button type="button" onClick={() => setSelectedRequest(request)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-navy transition hover:border-orange/40 hover:text-orange"><Eye size={14} /> Open</button></td></tr>)}</tbody></table></div>}
        </div>
      </section>

      {isFormOpen && <DeviceFormDialog form={form} editingDevice={editingDevice} selectedImage={selectedImage} imagePreview={imagePreview} formError={formError} isSaving={isSaving} onChange={updateForm} onImageChange={handleImageChange} onSubmit={handleSubmit} onClose={closeForm} />}
      {deviceToDelete && <DeleteDialog device={deviceToDelete} onCancel={() => setDeviceToDelete(null)} onConfirm={() => void handleDelete()} />}
      {selectedRequest && <RequestDetailsDialog request={selectedRequest} onClose={() => setSelectedRequest(null)} />}
    </section>
  );
}

function SummaryCard({ label, value, detail, icon: Icon }: { label: string; value: string | number; detail: string; icon: typeof Monitor }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p><p className="mt-3 text-3xl font-extrabold tracking-tight text-navy">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange/10 text-orange"><Icon size={19} /></span></div></div>;
}

function SectionHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action: React.ReactNode }) {
  return <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange">{eyebrow}</p><h3 className="mt-2 text-2xl font-extrabold tracking-[-0.035em] text-navy sm:text-[28px]">{title}</h3><p className="mt-2 max-w-[580px] text-sm leading-6 text-slate-500">{description}</p></div><div className="shrink-0">{action}</div></div>;
}

function AlertMessage({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return <div className="mt-5 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert"><div className="flex items-start gap-2"><AlertCircle size={17} className="mt-0.5 shrink-0" />{message}</div><button type="button" onClick={onDismiss} aria-label="Dismiss error" className="rounded p-1 text-red-500 hover:bg-red-100"><X size={15} /></button></div>;
}

function LoadingState({ label }: { label: string }) {
  return <div className="flex items-center justify-center gap-3 px-5 py-16 text-sm font-semibold text-slate-500" role="status"><LoaderCircle size={18} className="animate-spin text-orange" /> {label}</div>;
}

function EmptyState({ icon: Icon, title, detail }: { icon: typeof Monitor; title: string; detail: string }) {
  return <div className="px-5 py-16 text-center"><Icon size={26} className="mx-auto text-slate-300" /><p className="mt-3 text-sm font-bold text-navy">{title}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>;
}

function DeviceThumbnail({ device }: { device: AdminDevice }) {
  return device.imageUrl ? <img src={device.imageUrl} alt="" className="h-10 w-10 rounded-lg border border-slate-100 object-cover" /> : <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange/10 text-orange"><Monitor size={18} /></span>;
}

function DeviceFormDialog({ form, editingDevice, selectedImage, imagePreview, formError, isSaving, onChange, onImageChange, onSubmit, onClose }: { form: DeviceForm; editingDevice: AdminDevice | null; selectedImage: File | null; imagePreview: string | null; formError: string; isSaving: boolean; onChange: (field: keyof DeviceForm, value: string) => void; onImageChange: (event: ChangeEvent<HTMLInputElement>) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/45 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={editingDevice ? "Edit device" : "Add device"} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-xl bg-white p-6 shadow-2xl sm:rounded-xl sm:p-7"><div className="flex items-start justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange">Inventory record</p><h3 className="mt-2 text-xl font-extrabold text-navy">{editingDevice ? "Edit device" : "Add device"}</h3><p className="mt-2 text-sm leading-6 text-slate-500">Keep device information accurate for administrators and payment request processing.</p></div><button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-navy" aria-label="Close device form"><X size={18} /></button></div><form className="mt-6 space-y-4" onSubmit={onSubmit}><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-2"><FieldLabel>Device name</FieldLabel><input required value={form.name} onChange={(event) => onChange("name", event.target.value)} className={inputClass()} /></label><label className="space-y-2"><FieldLabel>Model</FieldLabel><input required value={form.model} onChange={(event) => onChange("model", event.target.value)} className={inputClass()} /></label><label className="space-y-2 sm:col-span-2"><FieldLabel>Specifications</FieldLabel><textarea required value={form.specifications} onChange={(event) => onChange("specifications", event.target.value)} className="min-h-24 w-full rounded-lg border border-slate-200 bg-[#fbfcfd] px-3 py-3 text-sm text-navy outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/10" /></label><label className="space-y-2"><FieldLabel>Amount</FieldLabel><input type="number" min="0" step="0.01" value={form.amount} onChange={(event) => onChange("amount", event.target.value)} placeholder="Optional" className={inputClass()} /></label><label className="space-y-2"><FieldLabel>Status</FieldLabel><select value={form.status} onChange={(event) => onChange("status", event.target.value)} className={inputClass()}>{deviceStatuses.map((status) => <option key={status}>{status}</option>)}</select></label></div><div><FieldLabel>Device image</FieldLabel><label className="mt-2 flex cursor-pointer items-center gap-4 rounded-lg border border-dashed border-slate-300 bg-[#fbfcfd] p-3 transition hover:border-orange/60 hover:bg-orange/[0.03]"><span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-orange/10 text-orange">{imagePreview ? <img src={imagePreview} alt="Selected device preview" className="h-full w-full object-cover" /> : <ImagePlus size={22} />}</span><span className="min-w-0"><span className="flex items-center gap-2 text-sm font-bold text-navy"><Upload size={15} className="text-orange" /> {selectedImage ? "Image selected" : "Upload image"}</span><span className="mt-1 block text-xs text-slate-500">JPG, PNG, or WebP. Uploading a new image replaces the current one.</span></span><input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={onImageChange} /></label></div>{formError && <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-800" role="alert"><AlertCircle size={15} className="mt-0.5 shrink-0" />{formError}</div>}<div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} disabled={isSaving} className="rounded-lg border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:text-navy disabled:opacity-50">Cancel</button><button type="submit" disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange px-5 py-3 text-xs font-extrabold text-navy transition hover:bg-orange-light disabled:cursor-not-allowed disabled:opacity-60">{isSaving && <LoaderCircle size={15} className="animate-spin" />}{isSaving ? "Saving..." : editingDevice ? "Save changes" : "Add device"}</button></div></form></section></div>;
}

function DeleteDialog({ device, onCancel, onConfirm }: { device: AdminDevice; onCancel: () => void; onConfirm: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/45 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="delete-device-title"><div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600"><Trash2 size={19} /></div><h3 id="delete-device-title" className="mt-5 text-lg font-extrabold text-navy">Delete this device?</h3><p className="mt-2 text-sm leading-6 text-slate-500">This will remove <strong className="text-navy">{device.name}</strong> from the admin inventory. Existing payment requests keep their saved device details.</p><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:text-navy">Cancel</button><button type="button" onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-3 text-xs font-extrabold text-white transition hover:bg-red-700">Delete device</button></div></div></div>;
}

function RequestDetailsDialog({ request, onClose }: { request: PaymentRequest; onClose: () => void }) {
  const status = requestAdminStatus(request.status);
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/45 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="request-details-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-xl bg-white p-6 shadow-2xl sm:rounded-xl sm:p-8"><div className="flex items-start justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange">Payment request</p><h3 id="request-details-title" className="mt-2 text-xl font-extrabold text-navy">{referenceNumber(request.id)}</h3><p className="mt-2 text-xs text-slate-500">Submitted {formatDate(request.createdAt)}</p></div><button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-navy" aria-label="Close request details"><X size={18} /></button></div><div className="mt-6 flex items-center justify-between rounded-lg border border-slate-100 bg-[#fbfcfd] p-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Review status</p><div className="mt-2"><StatusPill status={status} /></div></div><Check size={20} className="text-orange" /></div><div className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">{[["User name", request.fullLegalName], ["Email", request.email], ["Phone", request.phone], ["Address", requestAddress(request)], ["Selected device", request.deviceName], ["Model", request.deviceModel], ["Amount", formatAmount(request.deviceAmount, request.currency)], ["Notes", "No notes are stored with this request."]].map(([label, value]) => <div key={label}><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p><p className="mt-1 text-sm leading-6 text-navy">{value}</p></div>)}</div><div className="mt-7 border-t border-slate-100 pt-5"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Status options</p><p className="mt-1 text-xs leading-5 text-slate-500">Use the status selector in the request list to move this submission between Under Review, Approved, and Rejected.</p></div></section></div>;
}

function inputClass() {
  return "h-11 w-full rounded-lg border border-slate-200 bg-[#fbfcfd] px-3 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-orange focus:ring-2 focus:ring-orange/10";
}
