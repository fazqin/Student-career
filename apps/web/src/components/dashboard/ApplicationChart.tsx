import { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/Card";

export function ApplicationChart({ growth }: { growth: any[] }) {
  const data = useMemo(() => growth ?? [], [growth]);

  return (
    <Card className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">Application Overview</div>
          <div className="mt-1 text-xs text-slate-500">Momentum across the last 8 weeks</div>
        </div>
        <div className="text-xs text-slate-400">Demo data</div>
      </div>

      <div className="mt-6 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 4, right: 12, top: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(20,184,166,0.5)" />
                <stop offset="100%" stopColor="rgba(20,184,166,0.04)" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(203,213,225,0.8)" vertical={false} />
            <XAxis dataKey="week" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: 8,
                color: "#0f172a",
              }}
              labelStyle={{ color: "#1e293b" }}
            />
            <Area
              type="monotone"
              dataKey="applications"
              stroke="#14b8a6"
              strokeWidth={2}
              fill="url(#g1)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          { k: "Interview rate", v: "~32%", hint: "Improving" },
          { k: "Offer rate", v: "~8%", hint: "Stable" },
          { k: "Focus", v: "Data & Tech", hint: "Industry cluster" },
        ].map((x) => (
          <div key={x.k} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs text-slate-500">{x.k}</div>
            <div className="mt-2 text-sm font-semibold text-slate-800">{x.v}</div>
            <div className="mt-1 text-[11px] text-slate-400">{x.hint}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
