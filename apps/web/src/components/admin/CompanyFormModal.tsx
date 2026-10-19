import { useEffect, useState } from "react";
import { AlertCircle, Building2, Globe, MapPin, Tag, Users } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import type { Company } from "@/services/adminApi";

interface CompanyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Company, "id" | "createdAt" | "updatedAt">, companyId?: string | number) => Promise<void>;
  initialData?: Company | null;
}

interface FormErrors {
  name?: string;
  industry?: string;
  location?: string;
  website?: string;
}

const INDUSTRY_OPTIONS = [
  "Technology",
  "FinTech",
  "HealthTech",
  "E-commerce",
  "Data & Infrastructure",
  "Cybersecurity",
  "Consumer Apps",
  "Transportation",
  "Telecommunication",
  "Other",
];

const SIZE_OPTIONS = [
  "1–50",
  "51–200",
  "201–500",
  "501–1000",
  "1001+",
];

const BRAND_COLORS = [
  "#14b8a6", // Teal
  "#6366F1", // Indigo
  "#38BDF8", // Sky
  "#22C55E", // Green
  "#F59E0B", // Amber
  "#A855F7", // Purple
  "#FB7185", // Rose
];

export function CompanyFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: CompanyFormModalProps) {
  const isEditing = Boolean(initialData);

  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("Technology");
  const [size, setSize] = useState("51–200");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [brandColor, setBrandColor] = useState("#14b8a6");
  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Sync state when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || "");
        setIndustry(initialData.industry || "Technology");
        setSize(initialData.size || "51–200");
        setLocation(initialData.location || "");
        setWebsite(initialData.website || "");
        setBrandColor(initialData.brandColor || "#14b8a6");
        setDescription(initialData.description || "");
      } else {
        setName("");
        setIndustry("Technology");
        setSize("51–200");
        setLocation("");
        setWebsite("");
        setBrandColor("#14b8a6");
        setDescription("");
      }
      setErrors({});
      setSubmitError(null);
    }
  }, [isOpen, initialData]);

  function validate(): boolean {
    const nextErrors: FormErrors = {};

    if (!name.trim()) {
      nextErrors.name = "Nama perusahaan wajib diisi.";
    } else if (name.trim().length < 2) {
      nextErrors.name = "Nama perusahaan minimal 2 karakter.";
    }

    if (!industry.trim()) {
      nextErrors.industry = "Industri perusahaan wajib dipilih.";
    }

    if (!location.trim()) {
      nextErrors.location = "Lokasi kantor / basis kerja wajib diisi.";
    }

    if (website.trim()) {
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
      if (!urlPattern.test(website.trim())) {
        nextErrors.website = "Format URL website tidak valid (contoh: https://example.com).";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      let formattedWebsite = website.trim();
      if (formattedWebsite && !formattedWebsite.startsWith("http://") && !formattedWebsite.startsWith("https://")) {
        formattedWebsite = `https://${formattedWebsite}`;
      }

      await onSave(
        {
          name: name.trim(),
          industry: industry.trim(),
          size,
          location: location.trim(),
          website: formattedWebsite,
          brandColor,
          description: description.trim(),
        },
        initialData?.id
      );
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan data perusahaan. Silakan coba kembali."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Data Perusahaan" : "Tambah Perusahaan Mitra"}
      description={
        isEditing
          ? "Perbarui informasi profil dan detail mitra perusahaan industri."
          : "Lengkapi formulir di bawah ini untuk mendaftarkan mitra industri baru di CareerTrack."
      }
      maxWidth="xl"
    >
      {submitError && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Nama Perusahaan */}
        <div>
          <Label htmlFor="company-name">Nama Perusahaan *</Label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="company-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="Contoh: Aurora Labs"
              disabled={submitting}
              className={`pl-9 ${errors.name ? "border-rose-400 ring-rose-400" : ""}`}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 inline" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Industri & Ukuran Perusahaan */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="company-industry">Bidang / Industri *</Label>
            <div className="relative">
              <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                id="company-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                disabled={submitting}
                className="focus-ring h-11 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 transition hover:border-slate-400"
              >
                {INDUSTRY_OPTIONS.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>
            {errors.industry && (
              <p className="mt-1 text-xs text-rose-600">{errors.industry}</p>
            )}
          </div>

          <div>
            <Label htmlFor="company-size">Ukuran Perusahaan</Label>
            <div className="relative">
              <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                id="company-size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                disabled={submitting}
                className="focus-ring h-11 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 transition hover:border-slate-400"
              >
                {SIZE_OPTIONS.map((sz) => (
                  <option key={sz} value={sz}>
                    {sz} Karyawan
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lokasi & Website */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="company-location">Lokasi Kantor / Wilayah *</Label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="company-location"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (errors.location) setErrors((prev) => ({ ...prev, location: undefined }));
                }}
                placeholder="Contoh: Jakarta (Hybrid)"
                disabled={submitting}
                className={`pl-9 ${errors.location ? "border-rose-400 ring-rose-400" : ""}`}
              />
            </div>
            {errors.location && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3 inline" />
                {errors.location}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="company-website">Website Perusahaan</Label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="company-website"
                value={website}
                onChange={(e) => {
                  setWebsite(e.target.value);
                  if (errors.website) setErrors((prev) => ({ ...prev, website: undefined }));
                }}
                placeholder="https://example.com"
                disabled={submitting}
                className={`pl-9 ${errors.website ? "border-rose-400 ring-rose-400" : ""}`}
              />
            </div>
            {errors.website && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3 inline" />
                {errors.website}
              </p>
            )}
          </div>
        </div>

        {/* Warna Brand */}
        <div>
          <Label>Aksen Warna Brand</Label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {BRAND_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setBrandColor(c)}
                  className={`h-7 w-7 rounded-full border-2 transition ${
                    brandColor === c
                      ? "border-slate-800 scale-110 shadow-sm"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Warna ${c}`}
                />
              ))}
            </div>
            <span className="text-xs font-mono text-slate-500 uppercase">{brandColor}</span>
          </div>
        </div>

        {/* Deskripsi */}
        <div>
          <Label htmlFor="company-desc">Deskripsi Singkat Perusahaan</Label>
          <textarea
            id="company-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
            placeholder="Jelaskan ringkas profil bisnis, kultur kerja, atau fokus industri perusahaan..."
            className="focus-ring w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 transition hover:border-slate-400"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={submitting}
            className="text-slate-600 hover:text-slate-900"
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="secondary"
            disabled={submitting}
            className="min-w-[130px]"
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Menyimpan...
              </span>
            ) : isEditing ? (
              "Perbarui Perusahaan"
            ) : (
              "Simpan Perusahaan"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
