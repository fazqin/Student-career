import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bot,
  Sparkles,
  Send,
  CheckCircle2,
  RefreshCw,
  Layers,
  ArrowRight,
  KeyRound,
  Database,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  sendAdminBotMessage,
  getAdminBotStatus,
  getAdminBotApplications,
  type BotStatus,
  type BotActionDetail,
} from "@/services/adminApi";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  actionsTaken?: BotActionDetail[];
  data?: any[];
  engine?: string;
}

const DEFAULT_PROMPTS = [
  "Ganti status lamaran Faza menjadi Interview",
  "Ubah status lamaran uswa menjadi Offer",
  "Set prioritas lamaran Yanto jadi High",
  "Tampilkan semua lamaran yang berstatus Applied",
  "Berapa total lamaran yang masuk saat ini?",
  "Tolak lamaran afni",
];

export default function ApplicationBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m_welcome",
      sender: "bot",
      text: "Halo Admin! 👋 Saya adalah Kabinet mas prabs . Saya siap membantu Anda mengelola data lamaran mahasiswa di Supabase secara otomatis lewat perintah teks natural.\n\nContoh yang bisa saya lakukan:\n• 'Ganti status lamaran Faza menjadi Interview'\n• 'Ubah status lamaran uswa menjadi Offer'\n• 'Tampilkan semua lamaran yang berstatus Applied'\n• 'Set prioritas lamaran Yanto jadi High'",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null);
  const [liveApps, setLiveApps] = useState<any[]>([]);
  const [showLiveDrawer, setShowLiveDrawer] = useState(false);
  const [showApiKeyHelp, setShowApiKeyHelp] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load Bot Status & Live Applications from Supabase
  async function loadStatusAndApps() {
    try {
      const status = await getAdminBotStatus();
      setBotStatus(status);
      const apps = await getAdminBotApplications();
      setLiveApps(apps);
    } catch (e) {
      console.error("Failed to load bot status or apps:", e);
    }
  }

  useEffect(() => {
    void loadStatusAndApps();
  }, []);

  // Handle Send Message
  async function handleSend(textToSend?: string) {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await sendAdminBotMessage(text);

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actionsTaken: response.actionsTaken,
        data: response.data,
        engine: response.aiEngine,
      };

      setMessages((prev) => [...prev, botMsg]);

      // If an action was taken, refresh live Supabase data
      if (response.actionsTaken && response.actionsTaken.length > 0) {
        const freshApps = await getAdminBotApplications();
        setLiveApps(freshApps);
      }
    } catch (error: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: "bot",
        text: `Maaf, terjadi kesalahan saat mengeksekusi perintah: ${error.message || "Gagal menghubungi server API"}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div data-ct-light className="space-y-4">
      {/* HEADER CARD */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white shadow-sm">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Application Management Bot
                </h1>
                <Badge
                  variant={botStatus?.hasKey ? "success" : "default"}
                  className="flex items-center gap-1 text-[11px]"
                >
                  <Sparkles className="h-3 w-3" />
                  {botStatus?.hasKey
                    ? `${botStatus.provider} (${botStatus.model}) Active`
                    : "Smart Rule Engine Ready"}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                Otomatisasi pengubahan status, prioritas, catatan, dan query lamaran mahasiswa dengan bahasa natural.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowApiKeyHelp((prev) => !prev)}
              className="flex items-center gap-1.5 text-xs"
            >
              <KeyRound className="h-3.5 w-3.5 text-amber-500" />
              <span>
                {botStatus?.hasKey
                  ? `API Key: ${botStatus.provider}`
                  : "Pasang API Key di .env"}
              </span>
              {showApiKeyHelp ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLiveDrawer((prev) => !prev)}
              className="flex items-center gap-1.5 text-xs border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Database className="h-3.5 w-3.5 text-teal-600" />
              <span>Live Supabase ({liveApps.length})</span>
            </Button>

            <Link to="/admin/applications">
              <Button variant="primary" size="sm" className="flex items-center gap-1 text-xs">
                <Layers className="h-3.5 w-3.5" />
                <span>Edit Manual</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* API KEY INSTRUCTION BANNER (COLLAPSIBLE) */}
        {showApiKeyHelp && (
          <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50/60 p-4 text-xs text-teal-950 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-2.5">
              <KeyRound className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <div className="font-semibold text-teal-950">
                  Cara Memasang API Key (OpenAI / Gemini) di Backend:
                </div>
                <p className="text-teal-900">
                  Bot sudah mendukung <strong>OpenAI (GPT-4o Mini)</strong> dan <strong>Google Gemini (1.5 Flash)</strong> secara otomatis:
                </p>
                <ol className="list-decimal pl-4 space-y-1.5 text-teal-900">
                  <li>
                    Buka file <code className="rounded bg-teal-100 px-1.5 py-0.5 text-teal-950 font-mono">apps/api/.env</code>.
                  </li>
                  <li>
                    Tambahkan salah satu kunci API berikut:
                    <div className="mt-1 space-y-1 font-mono text-[11px] bg-slate-900 text-teal-300 p-2.5 rounded-lg">
                      <div># Untuk OpenAI (disarankan):</div>
                      <div>OPENAI_API_KEY=sk-proj-...</div>
                      <div className="mt-1.5 text-slate-400"># Atau Google Gemini:</div>
                      <div className="text-slate-400">GEMINI_API_KEY=AIzaSy...</div>
                    </div>
                  </li>
                  <li>Simpan file. Backend akan langsung mendeteksi API Key OpenAI tanpa perlu instalasi package tambahan!</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MAIN 2-COLUMN OR SINGLE CHAT LAYOUT */}
      <div className="grid gap-4 lg:grid-cols-12 items-start">
        {/* CHAT AREA (LEFT/MAIN COLUMN) */}
        <div className={cn("transition-all duration-200", showLiveDrawer ? "lg:col-span-8" : "lg:col-span-12")}>
          <div className="flex flex-col h-[650px] rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* CHAT MESSAGES SCROLLER */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  {/* AVATAR */}
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold shadow-sm",
                      msg.sender === "user"
                        ? "bg-[rgb(var(--hero-bg))] text-white"
                        : "bg-teal-600 text-white"
                    )}
                  >
                    {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>

                  {/* BUBBLE CONTENT */}
                  <div className="space-y-2">
                    <div
                      className={cn(
                        "rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm",
                        msg.sender === "user"
                          ? "bg-[rgb(var(--hero-bg))] text-white rounded-tr-none"
                          : "border border-slate-200 bg-white text-slate-800 rounded-tl-none"
                      )}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>

                      {/* BADGE ENGINE */}
                      {msg.engine && (
                        <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-400">
                          <Sparkles className="h-3 w-3 text-teal-500" />
                          <span>Diproses oleh: {msg.engine}</span>
                        </div>
                      )}
                    </div>

                    {/* ACTION CONFIRMATION CARD (IF STATUS WAS UPDATED) */}
                    {msg.actionsTaken && msg.actionsTaken.length > 0 && (
                      <div className="space-y-2">
                        {msg.actionsTaken.map((act, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-950 shadow-sm"
                          >
                            <div className="flex items-center gap-1.5 font-semibold text-emerald-800 mb-1.5">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              <span>Supabase Database Updated Successfully</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-900 mt-2 bg-white/70 rounded-lg p-2.5 border border-emerald-100">
                              <div>
                                <span className="text-slate-500">Mahasiswa:</span>{" "}
                                <strong className="text-slate-800">{act.studentName}</strong>
                              </div>
                              <div>
                                <span className="text-slate-500">Application ID:</span>{" "}
                                <strong className="font-mono text-slate-800">#{act.applicationId}</strong>
                              </div>
                              {act.positionTitle && (
                                <div className="col-span-2">
                                  <span className="text-slate-500">Posisi:</span>{" "}
                                  <strong className="text-slate-800">{act.positionTitle}</strong>{" "}
                                  {act.companyName && <span className="text-slate-500">di {act.companyName}</span>}
                                </div>
                              )}
                              {act.oldValue && act.newValue && (
                                <div className="col-span-2 flex items-center gap-2 mt-1">
                                  <span className="text-slate-500">Perubahan:</span>
                                  <Badge variant="default" className="line-through text-slate-500">
                                    {act.oldValue}
                                  </Badge>
                                  <ArrowRight className="h-3 w-3 text-slate-400" />
                                  <Badge variant="success" className="font-bold">
                                    {act.newValue}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* DATA LIST CARDS (IF QUERY RESULTS RETURNED) */}
                    {msg.data && msg.data.length > 0 && !msg.actionsTaken?.length && (
                      <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2 shadow-sm">
                        <div className="text-[11px] font-semibold text-slate-600 flex items-center justify-between">
                          <span>Hasil Pencarian Database:</span>
                          <span className="text-slate-400">{msg.data.length} item</span>
                        </div>
                        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                          {msg.data.map((item: any, i: number) => (
                            <div
                              key={i}
                              className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 px-2.5 py-1.5 text-xs hover:border-teal-200 transition"
                            >
                              <div>
                                <div className="font-semibold text-slate-800">
                                  {item.student_name || item.student_email || `ID #${item.id}`}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  {item.position_title} {item.company_name && `· ${item.company_name}`}
                                </div>
                              </div>
                              <Badge
                                variant={
                                  item.status === "Interview"
                                    ? "info"
                                    : item.status === "Offer"
                                    ? "success"
                                    : item.status === "Rejected"
                                    ? "danger"
                                    : "default"
                                }
                              >
                                {item.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400 px-1">{msg.timestamp}</div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2 bg-white rounded-xl border border-slate-200 max-w-xs animate-pulse">
                  <Bot className="h-4 w-4 text-teal-600 animate-spin" />
                  <span>Sedang memproses instruksi ke Supabase...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* QUICK PROMPT CHIPS */}
            <div className="border-t border-slate-100 bg-white px-4 py-2.5">
              <div className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span>Rekomendasi Perintah Cepat:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_PROMPTS.map((promptText) => (
                  <button
                    key={promptText}
                    type="button"
                    onClick={() => handleSend(promptText)}
                    disabled={loading}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 transition disabled:opacity-50"
                  >
                    {promptText}
                  </button>
                ))}
              </div>
            </div>

            {/* INPUT FOOTER */}
            <div className="border-t border-slate-200 bg-white p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ketik instruksi bot (misal: 'ganti status lamaran Faza menjadi Interview')..."
                  disabled={loading}
                  className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={loading || !inputMessage.trim()}
                  className="shrink-0 flex items-center gap-1.5"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Kirim</span>
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* LIVE SUPABASE DRAWER / SIDEBAR (RIGHT COLUMN) */}
        {showLiveDrawer && (
          <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-3 h-[650px] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-teal-600" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Live Supabase Records
                </h2>
              </div>
              <button
                type="button"
                onClick={loadStatusAndApps}
                title="Refresh Live Data"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              Setiap instruksi bot yang mengubah status atau prioritas akan langsung terefleksi di sini secara real-time.
            </p>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {liveApps.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  Tidak ada data lamaran di database.
                </div>
              ) : (
                liveApps.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 text-xs hover:border-teal-300 transition"
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div className="font-semibold text-slate-800 truncate">
                        {app.student_name || app.student_email}
                      </div>
                      <Badge
                        variant={
                          app.status === "Interview"
                            ? "info"
                            : app.status === "Offer"
                            ? "success"
                            : app.status === "Rejected"
                            ? "danger"
                            : "default"
                        }
                        className="text-[10px] py-0.5"
                      >
                        {app.status}
                      </Badge>
                    </div>

                    <div className="text-[11px] text-slate-500 truncate">
                      {app.position_title} · {app.company_name}
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                      <span>ID: #{app.id}</span>
                      <span>Prioritas: <strong>{app.priority}</strong></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
