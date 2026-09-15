import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { getAnalytics, getCompanies } from "@/services/api";
import { Card } from "@/components/ui/Card";

const stageColors: Record<string, string> = {
  Wishlist: "rgba(147,197,253,0.9)",
  Applied: "rgba(96,165,250,0.9)",
  Assessment: "rgba(56,189,248,0.9)",
  Interview: "rgba(167,139,250,0.9)",
  Offer: "rgba(34,197,94,0.9)",
  Rejected: "rgba(244,63,94,0.9)",
};

export default function Analytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [a, c] = await Promise.all([getAnalytics(), getCompanies()]);
      if (!alive) return;
      setAnalytics(a);
      setCompanies(c);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const byStage = useMemo(() => {
    const obj = analytics?.byStage ?? {};
    return Object.keys(obj).map((k) => ({ name: k, value: obj[k] }));
  }, [analytics]);

  const byIndustry = useMemo(() => {
    const obj = analytics?.byIndustry ?? {};
    return Object.keys(obj)
      .map((k) => ({ name: k, value: obj[k] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
  }, [analytics]);

  const byCompany = useMemo(() => {
    const obj = analytics?.byCompany ?? {};
    const name = (id: string) => companies.find((c) => c.id === id)?.name ?? id;
    return Object.keys(obj)
      .map((k) => ({ name: name(k), value: obj[k] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
  }, [analytics, companies]);

  const funnel = useMemo(() => {
    const s = analytics?.byStage ?? {};
    return [
      { name: "Wishlist", value: s.Wishlist ?? 0 },
      { name: "Applied", value: s.Applied ?? 0 },
      { name: "Assessment", value: s.Assessment ?? 0 },
      { name: "Interview", value: s.Interview ?? 0 },
      { name: "Offer", value: s.Offer ?? 0 },
    ];
  }, [analytics]);

  return (
    <div data-ct-light className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xs text-slate-500">Career analytics</div>
        <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          Conversion, focus areas, momentum.
        </div>
        <div className="mt-2 text-sm text-slate-500">
          Premium charts (Recharts) styled to feel like part of the product.
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5">
          <div className="text-sm font-semibold text-slate-900">Status distribution</div>
          <div className="mt-1 text-xs text-slate-500">Where your pipeline currently sits</div>

          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,12,18,0.92)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 14,
                    color: "rgba(255,255,255,0.9)",
                  }}
                />
                <Pie data={byStage} dataKey="value" nameKey="name" innerRadius={72} outerRadius={112} paddingAngle={2}>
                  {byStage.map((entry: any) => (
                    <Cell key={entry.name} fill={stageColors[entry.name] ?? "rgba(255,255,255,0.5)"} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-700">
            {byStage.map((s: any) => (
              <div key={s.name} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: stageColors[s.name] }} />
                  {s.name}
                </div>
                <div className="font-medium text-slate-900">{s.value}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7">
          <div className="text-sm font-semibold text-slate-900">Industry distribution</div>
          <div className="mt-1 text-xs text-slate-500">Signals where your effort is going</div>

          <div className="mt-6 h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byIndustry} margin={{ left: 10, right: 12, top: 10, bottom: 10 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,12,18,0.92)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 14,
                    color: "rgba(255,255,255,0.9)",
                  }}
                />
                <Bar dataKey="value" radius={[10, 10, 10, 10]} fill="rgba(56,189,248,0.75)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7">
          <div className="text-sm font-semibold text-slate-900">Company distribution</div>
          <div className="mt-1 text-xs text-slate-500">Where you’re applying most</div>

          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCompany} layout="vertical" margin={{ left: 10, right: 16, top: 10, bottom: 10 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,12,18,0.92)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 14,
                    color: "rgba(255,255,255,0.9)",
                  }}
                />
                <Bar dataKey="value" radius={[10, 10, 10, 10]} fill="rgba(99,102,241,0.75)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5">
          <div className="text-sm font-semibold text-slate-900">Application funnel</div>
          <div className="mt-1 text-xs text-slate-500">Stage-by-stage reduction</div>

          <div className="mt-6 space-y-3">
            {funnel.map((s: any, idx: number) => (
              <div key={s.name} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-800">{s.name}</div>
                  <div className="text-xs font-medium text-slate-600">{s.value}</div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, (s.value / Math.max(1, funnel[0]?.value ?? 1)) * 100)}%`,
                      background: idx % 2 === 0 ? "rgba(56,189,248,0.75)" : "rgba(99,102,241,0.75)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
