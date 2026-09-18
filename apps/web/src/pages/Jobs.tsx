import { useEffect, useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { getPositions } from "@/services/api";
import { Input } from "@/components/ui/Input";
import { Segmented } from "@/components/ui/Segmented";
import { JobCard } from "@/components/jobs/JobCard";

export default function Jobs() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [positions, setPositions] = useState<any[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const list = await getPositions({ query, type });
      if (alive) setPositions(list);
    })();
    return () => {
      alive = false;
    };
  }, [query, type]);

  const typeOptions = useMemo(
    () => [
      { value: "All", label: "All" },
      { value: "Internship", label: "Internships" },
    ],
    []
  );

  return (
    <div data-ct-light className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs text-slate-500">Job discovery</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Find roles worth your time.</div>
            <div className="mt-2 text-sm text-slate-500">
              Search across realistic demo roles — designed as a premium UI, ready for REST.
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:w-[320px]">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search roles, tags, teams…"
                aria-label="Search jobs"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
                <Filter className="h-4 w-4" />
                Filter
              </div>
              <Segmented options={typeOptions} value={type} onChange={setType} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {positions.map((p) => (
          <JobCard key={p.id} position={p} />
        ))}
      </div>

      {positions.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          No roles match your search.
        </div>
      )}
    </div>
  );
}
