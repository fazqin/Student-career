import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  CheckCircle2,
  Crown,
  Zap,
  Calendar,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  QrCode,
  Wallet,
  Building2,
  Flame,
  Sparkles,
  CreditCard,
  Lock,
  Copy,
  Check,
  Wifi,
  Smartphone,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { subscribeToTier } from "@/services/api";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier?: "Free" | "Premium" | "Ultimate";
  onSuccessSubscribe?: (tier: "Premium" | "Ultimate", details: any) => void;
}

type PaymentMethod =
  | "visa"
  | "mastercard"
  | "amex"
  | "bitcoin"
  | "qris"
  | "gopay"
  | "bca";

export function SubscriptionModal({
  isOpen,
  onClose,
  currentTier = "Free",
  onSuccessSubscribe,
}: SubscriptionModalProps) {
  const [step, setStep] = useState<"plans" | "checkout" | "success">("plans");
  const [selectedTier, setSelectedTier] = useState<"Premium" | "Ultimate">("Premium");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qris");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transactionData, setTransactionData] = useState<any>(null);

  const isEliteMethod = ["visa", "mastercard", "amex", "bitcoin"].includes(paymentMethod);

  // Form states for simulated elite card details
  const [cardNumber, setCardNumber] = useState("4532 8821 9012 4432");
  const [cardHolder, setCardHolder] = useState("STUDENT CAREER VIP");
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvv, setCardCvv] = useState("889");

  // Bitcoin network toggle
  const [btcNetwork, setBtcNetwork] = useState<"lightning" | "mainnet">("lightning");

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      setStep("plans");
      setIsProcessing(false);
      setCopiedText(null);
      setErrorMessage(null);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !isProcessing) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen) return null;

  const tierPrices = {
    Premium: { price: 51945, label: "Rp 51.945", btc: "0.000035 BTC", sats: "3.500 Sats", period: "/bulan" },
    Ultimate: { price: 2999999, label: "Rp 2.999.999", btc: "0.002015 BTC", sats: "201.500 Sats", period: "/bulan" },
  };

  const handleSelectTier = (tier: "Premium" | "Ultimate") => {
    setSelectedTier(tier);
    setErrorMessage(null);
    setStep("checkout");
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(label);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  const handleCardNumberChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, "").slice(0, 16);
    const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted || "•••• •••• •••• ••••");
  };

  const handleProcessPayment = async () => {
    setErrorMessage(null);

    // Jika user memilih metode Elite, tolak dengan pesan edukatif
    if (isEliteMethod) {
      setErrorMessage(
        `Metode pembayaran ${paymentMethod.toUpperCase()} (Elite) saat ini hanya sebagai showcase/pemanis desain. Silakan pilih metode Domestik (QRIS, GoPay, atau BCA) untuk memproses transaksi riil ke database PostgreSQL.`
      );
      return;
    }

    setIsProcessing(true);
    try {
      const response = await subscribeToTier({
        tier: selectedTier,
        paymentMethod,
      });

      setTransactionData(response.data);
      setStep("success");

      if (onSuccessSubscribe) {
        onSuccessSubscribe(selectedTier, response.data);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal memproses transaksi database.");
    } finally {
      setIsProcessing(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* BACKDROP GELAP DENGAN SHADOW & BLUR */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={() => !isProcessing && onClose()}
        aria-hidden="true"
      />

      {/* MODAL CARD (UKURAN 70% DARI TOTAL HALAMAN DENGAN SHADOW TEBAL) */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-[94vw] lg:w-[70vw] max-w-5xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-200/90 bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto"
      >
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Pilih Paket Langganan CareerTrack</span>
                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-semibold text-teal-800">
                  Career Booster
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Akselerasi penerimaan kerja dengan pendampingan mentor & kuota prioritas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition disabled:opacity-50"
            aria-label="Tutup modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY MODAL BERDASARKAN STEP */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* =========================================================================
              STEP 1: PERBANDINGAN TIER (FREE vs PREMIUM vs ULTIMATE)
          ========================================================================= */}
          {step === "plans" && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                  Investasi Masa Depan Karier
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Tingkatkan Peluang Diterima Kerja Hingga 70%
                </h3>
                <p className="text-xs text-slate-500">
                  Pilih paket yang paling cocok untuk kebutuhan persiapan kariermu saat ini.
                </p>
              </div>

              {/* 3 COLUMN TIER PRICING GRID */}
              <div className="grid gap-5 md:grid-cols-3 items-stretch pt-2">
                {/* 1. TIER FREE */}
                <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-5 shadow-sm transition hover:border-slate-300">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                        Starter
                      </span>
                      <Badge variant="default" className="text-[10px]">
                        Gratis
                      </Badge>
                    </div>

                    <h4 className="mt-2 text-xl font-bold text-slate-900">Free Tier</h4>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900">Rp 0</span>
                      <span className="text-xs text-slate-400">/selamanya</span>
                    </div>

                    <p className="mt-3 text-xs text-slate-500 leading-relaxed border-t border-slate-200/60 pt-3">
                      Cocok untuk mahasiswa yang ingin melamar dan memantau status secara mandiri.
                    </p>

                    {/* BENEFIT LIST */}
                    <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>Maksimal 5 lamaran aktif</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>Antrean review standar</span>
                      </li>
                      <li className="flex items-center gap-2 text-slate-400">
                        <X className="h-4 w-4 text-slate-300 shrink-0" />
                        <span>Konsultasi 1-on-1: <strong>0 Sesi (Mandiri)</strong></span>
                      </li>
                      <li className="flex items-center gap-2 text-slate-400">
                        <X className="h-4 w-4 text-slate-300 shrink-0" />
                        <span>Tanpa rekomendasi langsung</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/60">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                      className="w-full text-xs font-semibold text-slate-400 border border-slate-200 bg-slate-100"
                    >
                      {currentTier === "Free" ? "Paket Kamu Saat Ini" : "Paket Dasar"}
                    </Button>
                  </div>
                </div>

                {/* 2. TIER PREMIUM (POPULAR) */}
                <div className="relative flex flex-col justify-between rounded-2xl border-2 border-teal-500 bg-white p-5 shadow-lg transition hover:shadow-xl">
                  {/* POPULAR BADGE */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-3 py-1 text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
                      <Flame className="h-3 w-3" /> Paling Populer
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-teal-700 tracking-wider">
                        Pro Booster
                      </span>
                      <Badge variant="info" className="text-[10px]">
                        Medium Priority
                      </Badge>
                    </div>

                    <h4 className="mt-2 text-xl font-bold text-slate-900">Tier Premium</h4>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-teal-800">Rp 51.945</span>
                      <span className="text-xs text-slate-400">/bulan</span>
                    </div>

                    <p className="mt-3 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                      Solusi ideal untuk persiapan seleksi intensif dan bimbingan berkala.
                    </p>

                    {/* BENEFIT LIST */}
                    <ul className="mt-4 space-y-2.5 text-xs text-slate-700">
                      <li className="flex items-center gap-2 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                        <span>Hingga 20 lowongan aktif</span>
                      </li>
                      <li className="flex items-center gap-2 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                        <span>Antrean <strong>Priority Review</strong> di Recruiter</span>
                      </li>
                      <li className="flex items-center gap-2 bg-teal-50/70 p-1.5 rounded-lg border border-teal-100 font-semibold text-teal-950">
                        <Calendar className="h-4 w-4 text-teal-700 shrink-0" />
                        <span>2x Sesi Konsultasi 1-on-1 (CV & HR Mock)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                        <span>Analisis CV AI Bot Tak Terbatas</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSelectTier("Premium")}
                      className="w-full text-xs font-semibold bg-teal-600 hover:bg-teal-700 shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>Pilih Premium</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* 3. TIER ULTIMATE (CAREER GUARANTEE - VIP) */}
                <div className="relative flex flex-col justify-between rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 p-5 shadow-lg transition hover:shadow-xl">
                  {/* VIP BADGE */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 px-3 py-1 text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
                      <Crown className="h-3.5 w-3.5 fill-white" />  70% Lolos
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-amber-700 tracking-wider">
                        VIP Concierge
                      </span>
                      <Badge variant="warning" className="text-[10px] bg-amber-100 text-amber-900 border-amber-300">
                        High Priority
                      </Badge>
                    </div>

                    <h4 className="mt-2 text-xl font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Tier Ultimate</span>
                      <Crown className="h-4 w-4 text-amber-500 fill-amber-500" />
                    </h4>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-amber-900">Rp 2.999.999</span>
                      <span className="text-xs text-slate-400">/bulan</span>
                    </div>

                    <p className="mt-3 text-xs text-slate-600 leading-relaxed border-t border-amber-100 pt-3">
                      Didampingi penuh hingga lolos kerja dengan koneksi langsung ke recruiter mitra.
                    </p>

                    {/* BENEFIT LIST */}
                    <ul className="mt-4 space-y-2.5 text-xs text-slate-800">
                      <li className="flex items-center gap-2 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                        <span><strong>Unlimited</strong> Lamaran Lowongan</span>
                      </li>
                      <li className="flex items-center gap-2 bg-amber-100/70 p-1.5 rounded-lg border border-amber-200 font-bold text-amber-950">
                        <Zap className="h-4 w-4 text-amber-600 shrink-0 fill-amber-500" />
                        <span>Unlimited 1-on-1 Mentoring Bebas Jam</span>
                      </li>
                      <li className="flex items-center gap-2 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                        <span><strong>Direct Endorsement</strong> ke Mitra Perusahaan</span>
                      </li>
                      <li className="flex items-center gap-2 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                        <span>Prioritas Teratas di Dashboard Recruiter</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-amber-100">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSelectTier("Ultimate")}
                      className="w-full text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>Pilih Ultimate VIP</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 2: CHECKOUT & PAYMENT SELECTION (DENGAN METODE ELITE & GLOBAL)
          ========================================================================= */}
          {step === "checkout" && (
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
              <button
                type="button"
                onClick={() => setStep("plans")}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-teal-700 transition"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Kembali ke pilihan paket</span>
              </button>

              {/* RINGKASAN ORDER */}
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 via-teal-50/20 to-slate-50 p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <span className="text-xs text-slate-500">Paket yang dipilih:</span>
                    <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>Tier {selectedTier}</span>
                      <Badge variant={selectedTier === "Ultimate" ? "warning" : "info"}>
                        {selectedTier === "Ultimate" ? "Unlimited Mentoring" : "2x Konsultasi"}
                      </Badge>
                    </h4>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-2xl font-extrabold text-teal-800">
                      {tierPrices[selectedTier].label}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Masa aktif 30 hari • {tierPrices[selectedTier].btc}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200/80 pt-3 text-xs text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800">Benefit yang akan aktif:</div>
                  <p>• Kuota Konsultasi: <strong>{selectedTier === "Ultimate" ? "Unlimited Bebas Jam" : "2x Sesi Terjadwal"}</strong></p>
                  <p>• Prioritas Lamaran: <strong>{selectedTier === "Ultimate" ? "High Priority (Paling Atas)" : "Medium Priority"}</strong></p>
                </div>
              </div>

              {/* PILIHAN METODE PEMBAYARAN */}
              <div className="space-y-4">
                {/* 1. METODE ELITE & GLOBAL (VISA, MASTERCARD, AMEX, BITCOIN) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-500 fill-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        Metode Pembayaran Elite & Global
                      </span>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 border border-slate-200 flex items-center gap-1">
                      ✨ Showcase Desain (Pemanis)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* VISA */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("visa")}
                      className={`relative flex flex-col items-center justify-between p-3 rounded-2xl border-2 transition text-center ${
                        paymentMethod === "visa"
                          ? "border-blue-600 bg-blue-50/70 shadow-md ring-2 ring-blue-500/20"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="h-8 w-full flex items-center justify-center">
                        <img src="/visa.svg" alt="Visa" className="h-6 w-auto object-contain" />
                      </div>
                      <div className="mt-2 w-full">
                        <div className="text-xs font-bold text-slate-900">Visa Card</div>
                        <div className="text-[10px] text-slate-500">Infinite / Signature</div>
                      </div>
                      {paymentMethod === "visa" && (
                        <div className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600" />
                      )}
                    </button>

                    {/* MASTERCARD */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("mastercard")}
                      className={`relative flex flex-col items-center justify-between p-3 rounded-2xl border-2 transition text-center ${
                        paymentMethod === "mastercard"
                          ? "border-amber-600 bg-amber-50/70 shadow-md ring-2 ring-amber-500/20"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="h-8 w-full flex items-center justify-center">
                        <img src="/Mastercard.svg" alt="Mastercard" className="h-7 w-auto object-contain" />
                      </div>
                      <div className="mt-2 w-full">
                        <div className="text-xs font-bold text-slate-900">Mastercard</div>
                        <div className="text-[10px] text-slate-500">World Elite</div>
                      </div>
                      {paymentMethod === "mastercard" && (
                        <div className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-600" />
                      )}
                    </button>

                    {/* AMEX */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("amex")}
                      className={`relative flex flex-col items-center justify-between p-3 rounded-2xl border-2 transition text-center ${
                        paymentMethod === "amex"
                          ? "border-cyan-600 bg-cyan-50/70 shadow-md ring-2 ring-cyan-500/20"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="h-8 w-full flex items-center justify-center">
                        <img src="/Amex.png" alt="Amex" className="h-6 w-auto object-contain rounded" />
                      </div>
                      <div className="mt-2 w-full">
                        <div className="text-xs font-bold text-slate-900">American Express</div>
                        <div className="text-[10px] text-slate-500">Centurion / Plat</div>
                      </div>
                      {paymentMethod === "amex" && (
                        <div className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-600" />
                      )}
                    </button>

                    {/* BITCOIN */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("bitcoin")}
                      className={`relative flex flex-col items-center justify-between p-3 rounded-2xl border-2 transition text-center ${
                        paymentMethod === "bitcoin"
                          ? "border-amber-500 bg-amber-500/10 shadow-md ring-2 ring-amber-500/30"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="h-8 w-full flex items-center justify-center">
                        <img src="/Bitcoin.webp" alt="Bitcoin" className="h-7 w-7 object-contain drop-shadow" />
                      </div>
                      <div className="mt-2 w-full">
                        <div className="text-xs font-bold text-slate-900 flex items-center justify-center gap-1">
                          <span>Bitcoin</span>
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1 rounded">BTC</span>
                        </div>
                        <div className="text-[10px] text-slate-500">Web3 / Lightning</div>
                      </div>
                      {paymentMethod === "bitcoin" && (
                        <div className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. METODE DOMESTIK INSTANT */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Metode Pembayaran Domestik
                      </span>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      ⚡ Aktif Riil (Tersambung PostgreSQL)
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("qris")}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition ${
                        paymentMethod === "qris"
                          ? "border-teal-600 bg-teal-50/50 text-teal-900 shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <QrCode className="h-5 w-5 text-teal-600 mb-1" />
                      <span className="text-xs font-bold">QRIS Instant</span>
                      <span className="text-[10px] text-slate-400">Semua E-Wallet</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("gopay")}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition ${
                        paymentMethod === "gopay"
                          ? "border-teal-600 bg-teal-50/50 text-teal-900 shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <Wallet className="h-5 w-5 text-sky-600 mb-1" />
                      <span className="text-xs font-bold">GoPay / OVO</span>
                      <span className="text-[10px] text-slate-400">Virtual E-Money</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("bca")}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition ${
                        paymentMethod === "bca"
                          ? "border-teal-600 bg-teal-50/50 text-teal-900 shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <Building2 className="h-5 w-5 text-blue-600 mb-1" />
                      <span className="text-xs font-bold">Bank Transfer</span>
                      <span className="text-[10px] text-slate-400">BCA / Mandiri / BNI</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ==============================================================
                  DYNAMIC INTERACTIVE PREVIEWS BERDASARKAN METODE YANG DIPILIH
              ============================================================== */}

              {/* KONDISI A: KARTU KREDIT / DEBIT ELITE (VISA, MASTERCARD, AMEX) */}
              {(paymentMethod === "visa" || paymentMethod === "mastercard" || paymentMethod === "amex") && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4 text-teal-700" />
                      <span>Virtual Card Preview & Rincian Otorisasi</span>
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> 3D Secure 2.0
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5 items-center">
                    {/* VISUAL KARTU KREDIT 3D-STYLE */}
                    <div
                      className={`aspect-[1.586/1] w-full max-w-[340px] mx-auto rounded-2xl p-5 relative overflow-hidden shadow-2xl flex flex-col justify-between select-none transition-all duration-300 ${
                        paymentMethod === "visa"
                          ? "bg-gradient-to-tr from-[#060c20] via-[#091b40] to-[#142850] border border-blue-400/30 shadow-blue-950/30"
                          : paymentMethod === "mastercard"
                          ? "bg-gradient-to-tr from-[#121212] via-[#211d1a] to-[#3a1b0d] border border-amber-500/30 shadow-amber-950/30"
                          : "bg-gradient-to-tr from-[#021f1d] via-[#063b36] to-[#0f2422] border border-teal-400/30 shadow-teal-950/30"
                      }`}
                    >
                      {/* Holographic light sheen */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent -skew-x-12 pointer-events-none" />

                      {/* Header Kartu: Chip + Contactless + Logo Brand */}
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-10 rounded bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-sm border border-amber-300 flex items-center justify-center">
                            <div className="grid grid-cols-2 grid-rows-2 gap-0.5 w-full h-full border border-amber-800/40 rounded-[2px]" />
                          </div>
                          <Wifi className="h-4 w-4 text-white/50 rotate-90" />
                        </div>

                        {/* Brand Logo inside crisp white pill */}
                        <div className="bg-white/95 px-2.5 py-1 rounded-md shadow-md h-8 flex items-center justify-center">
                          {paymentMethod === "visa" && (
                            <img src="/visa.svg" alt="Visa" className="h-6 w-auto object-contain" />
                          )}
                          {paymentMethod === "mastercard" && (
                            <img src="/Mastercard.svg" alt="Mastercard" className="h-6 w-auto object-contain" />
                          )}
                          {paymentMethod === "amex" && (
                            <img src="/Amex.png" alt="Amex" className="h-6 w-auto object-contain rounded" />
                          )}
                        </div>
                      </div>

                      {/* Nomor Kartu Spaced */}
                      <div className="my-2 relative z-10">
                        <div className="text-base sm:text-lg font-mono tracking-widest text-white/95 font-semibold drop-shadow">
                          {cardNumber || "•••• •••• •••• ••••"}
                        </div>
                      </div>

                      {/* Footer Kartu: Nama & Expiry */}
                      <div className="flex items-end justify-between relative z-10">
                        <div>
                          <div className="text-[8px] uppercase tracking-wider text-white/60">Cardholder</div>
                          <div className="text-xs font-semibold tracking-wider text-white uppercase truncate max-w-[180px]">
                            {cardHolder || "STUDENT CAREER VIP"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[8px] uppercase tracking-wider text-white/60">Expires</div>
                          <div className="text-xs font-mono font-semibold text-white">{cardExpiry || "08/29"}</div>
                        </div>
                      </div>
                    </div>

                    {/* FORM INPUT SIMULASI KARTU */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                          Nomor Kartu {paymentMethod.toUpperCase()}
                        </label>
                        <input
                          type="text"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => handleCardNumberChange(e.target.value)}
                          placeholder="4532 8821 9012 4432"
                          className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                          Nama Pemegang Kartu
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="NAMA LENGKAP PADA KARTU"
                          className="w-full text-xs uppercase px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                            Masa Berlaku
                          </label>
                          <input
                            type="text"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                            CVV / CVC
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-100 p-2 rounded-lg">
                        <Lock className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                        <span>Enkripsi 256-bit SSL • PCI-DSS Level 1 Certified</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* KONDISI B: BITCOIN WEB3 & LIGHTNING TERMINAL */}
              {paymentMethod === "bitcoin" && (
                <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black p-5 text-white shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <img src="/Bitcoin.webp" alt="Bitcoin" className="h-8 w-8 object-contain drop-shadow-[0_0_12px_rgba(247,147,26,0.6)]" />
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <span>Bitcoin Web3 Settlement Terminal</span>
                          <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1.5 py-0.2 rounded font-mono">
                            NODE v26.0
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          Konversi Real-time: 1 BTC ≈ Rp 1.488.500.000 IDR
                        </div>
                      </div>
                    </div>

                    {/* NETWORK TOGGLE */}
                    <div className="flex items-center gap-1 bg-zinc-800/80 p-1 rounded-xl border border-zinc-700/60 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setBtcNetwork("lightning")}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                          btcNetwork === "lightning"
                            ? "bg-amber-500 text-black shadow-sm"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        <Zap className="h-3 w-3 fill-current" />
                        <span>Lightning (0 Fee)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBtcNetwork("mainnet")}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition ${
                          btcNetwork === "mainnet"
                            ? "bg-amber-500 text-black shadow-sm"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        Native SegWit
                      </button>
                    </div>
                  </div>

                  {/* JUMLAH BTC & SATS */}
                  <div className="grid grid-cols-2 gap-3 bg-zinc-900/90 p-3.5 rounded-xl border border-zinc-800">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-zinc-400">Total Nominal Tagihan</div>
                      <div className="text-base font-extrabold text-amber-400 font-mono">
                        {tierPrices[selectedTier].btc}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        ({tierPrices[selectedTier].sats})
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-wider text-zinc-400">Konfirmasi Diperlukan</div>
                      <div className="text-xs font-bold text-emerald-400 font-mono flex items-center justify-end gap-1 mt-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                        <span>0 Conf (Instant Settlement)</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">CareerTrack Lightning Channel</div>
                    </div>
                  </div>

                  {/* ALAMAT DEPOSIT BITCOIN / LIGHTNING INVOICE */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                      {btcNetwork === "lightning" ? "Lightning Invoice Hash" : "Alamat Deposit Bitcoin (SegWit)"}
                    </label>
                    <div className="flex items-center gap-2 bg-black/80 border border-zinc-800 rounded-xl p-2.5">
                      <div className="flex-1 font-mono text-xs text-amber-300/90 truncate select-all">
                        {btcNetwork === "lightning"
                          ? "lnbc35u1pn8studentcareertrackvip99021xyz88741"
                          : "bc1q9xstudentcareertrack887elite9924"}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            btcNetwork === "lightning"
                              ? "lnbc35u1pn8studentcareertrackvip99021xyz88741"
                              : "bc1q9xstudentcareertrack887elite9924",
                            "btc_address"
                          )
                        }
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white flex items-center gap-1 transition shrink-0"
                      >
                        {copiedText === "btc_address" ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 pt-1">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Mempool Listener Aktif • Menunggu settlement dari wallet kripto Anda...</span>
                  </div>
                </div>
              )}

              {/* KONDISI C: QRIS INSTANT */}
              {paymentMethod === "qris" && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center space-y-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800">
                    <QrCode className="h-4 w-4" />
                    <span>Scan QRIS dengan Semua Aplikasi Bank / E-Wallet</span>
                  </div>
                  {/* SIMULATED QR CODE */}
                  <div className="mx-auto w-40 h-40 bg-white p-3 rounded-2xl border border-slate-300 shadow-sm flex flex-col items-center justify-center relative">
                    <QrCode className="h-28 w-28 text-slate-800" />
                    <span className="text-[9px] font-extrabold text-slate-500 tracking-wider">CAREERTRACK QRIS</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Buka GoPay, OVO, ShopeePay, BCA Mobile, atau Livin' Mandiri lalu scan kode QR di atas.
                  </div>
                </div>
              )}

              {/* KONDISI D: GOPAY / OVO */}
              {paymentMethod === "gopay" && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Smartphone className="h-4 w-4 text-sky-600" />
                    <span>Konfirmasi Pembayaran Cepat E-Wallet</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Nomor HP Terdaftar di GoPay / OVO
                    </label>
                    <input
                      type="tel"
                      defaultValue="0812-9842-1102"
                      className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Notifikasi persetujuan pembayaran akan otomatis dikirimkan ke aplikasi GoPay / OVO pada ponsel Anda.
                  </p>
                </div>
              )}

              {/* KONDISI E: BANK TRANSFER (BCA VA) */}
              {paymentMethod === "bca" && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-blue-600" />
                      <span>Nomor Virtual Account BCA</span>
                    </span>
                    <span className="text-[10px] text-slate-500">Verifikasi Otomatis</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl p-3">
                    <div className="flex-1 font-mono text-sm font-bold text-slate-900 tracking-wider">
                      80777 0812 3456 7890
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy("80777081234567890", "va_bca")}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition shrink-0"
                    >
                      {copiedText === "va_bca" ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Salin VA</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Dapat dibayar melalui ATM BCA, KlikBCA, m-BCA, atau transfer antar-bank dengan kode bank 014.
                  </p>
                </div>
              )}

              {/* PESAN ERROR / PERINGATAN METODE PEMBAYARAN */}
              {errorMessage && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold">Pemberitahuan Transaksi:</div>
                    <p className="leading-relaxed">{errorMessage}</p>
                    {isEliteMethod && (
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod("qris");
                          setErrorMessage(null);
                        }}
                        className="font-bold text-teal-800 underline hover:text-teal-950 block mt-1"
                      >
                        &rarr; Beralih ke QRIS Instant (Metode Aktif Riil)
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ACTION BUTTON */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  disabled={isProcessing}
                  onClick={handleProcessPayment}
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 py-3"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Memproses Transaksi Database (BEGIN ... COMMIT)...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>
                        Bayar Sekarang via {paymentMethod.toUpperCase()} ({tierPrices[selectedTier].label})
                      </span>
                    </span>
                  )}
                </Button>

                <p className="mt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Transaksi terenkripsi aman dan diproses langsung via Raw SQL Transaction.</span>
                </p>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 3: SUKSES AKTIVASI TIER
          ========================================================================= */}
          {step === "success" && (
            <div className="max-w-md mx-auto text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Pembayaran Berhasil!
                </span>
                <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
                  Selamat Datang di Tier {selectedTier}! 🎉
                </h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Paket kamu telah aktif selama 30 hari ke depan. Semua keuntungan prioritas dan sesi konsultasi 1-on-1 sudah siap kamu gunakan.
                </p>
              </div>

              {/* BADGE METODE PEMBAYARAN DI SUKSES */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800">
                <span className="text-slate-500">Metode:</span>
                {paymentMethod === "visa" && (
                  <span className="flex items-center gap-1.5 text-blue-700 font-bold">
                    <img src="/visa.svg" alt="Visa" className="h-4 w-auto inline" /> Visa Card
                  </span>
                )}
                {paymentMethod === "mastercard" && (
                  <span className="flex items-center gap-1.5 text-amber-700 font-bold">
                    <img src="/Mastercard.svg" alt="Mastercard" className="h-4 w-auto inline" /> Mastercard
                  </span>
                )}
                {paymentMethod === "amex" && (
                  <span className="flex items-center gap-1.5 text-cyan-700 font-bold">
                    <img src="/Amex.png" alt="Amex" className="h-4 w-auto inline rounded" /> American Express
                  </span>
                )}
                {paymentMethod === "bitcoin" && (
                  <span className="flex items-center gap-1.5 text-amber-600 font-bold">
                    <img src="/Bitcoin.webp" alt="Bitcoin" className="h-4 w-4 inline" /> Bitcoin Lightning Settlement
                  </span>
                )}
                {paymentMethod === "qris" && <span>QRIS Instant Pay</span>}
                {paymentMethod === "gopay" && <span>GoPay / OVO</span>}
                {paymentMethod === "bca" && <span>BCA Virtual Account</span>}
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-emerald-950 text-left space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <Flame className="h-4 w-4 text-emerald-600" />
                  Benefit Terverifikasi di Database (Raw SQL Transaction COMMITTED):
                </div>
                <div>• Status Akun: <strong>Tier {selectedTier}</strong></div>
                <div>
                  • Sesi Konsultasi: <strong>{selectedTier === "Ultimate" ? "Unlimited On-Demand" : "2 Sesi Tersedia"}</strong>
                </div>
                <div>• Prioritas Lamaran: <strong>{selectedTier === "Ultimate" ? "High Priority" : "Medium Priority"}</strong></div>
                <div className="text-[10px] text-emerald-700 pt-1 border-t border-emerald-200/60 font-mono space-y-0.5">
                  <div>SQL Status: <strong>{transactionData?.rawSqlTransaction?.status || "COMMITTED"}</strong></div>
                  <div>ID Transaksi: <strong>{transactionData?.transaction?.id || "TX-SUCCESS"}</strong></div>
                  <div className="text-[9px] text-emerald-600">
                    Query: BEGIN; INSERT INTO transactions...; UPDATE users SET tier='{selectedTier}'...; COMMIT;
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={onClose}
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs"
                >
                  Mulai Gunakan Fitur
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

