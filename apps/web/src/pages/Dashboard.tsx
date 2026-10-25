import { useEffect, useMemo, useState } from "react";
import { Briefcase, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { getAnalytics, getApplications, getDashboard, getInterviews, getProfile } from "@/services/api";
import { StatCard } from "@/components/dashboard/StatCard";
import { ApplicationChart } from "@/components/dashboard/ApplicationChart";
import { UpcomingInterviews } from "@/components/dashboard/UpcomingInterviews";
import { UpcomingDeadlines } from "@/components/dashboard/UpcomingDeadlines";
import { RecentApplications } from "@/components/dashboard/RecentApplications";
import { getGreetingNameHour } from "@/utils/format";
import { Logo } from "@/components/ui/Logo";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [apps, setApps] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [p, d, a, i, an] = await Promise.all([
        getProfile(),
        getDashboard(),
        getApplications(),
        getInterviews(),
        getAnalytics(),
      ]);
      if (!alive) return;
      setProfile(p);
      setDashboard(d);
      setApps(a || []);
      setInterviews(i || []);
      setAnalytics(an);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const greeting = useMemo(() => getGreetingNameHour(), []);

  const counts = dashboard?.counts ?? {};
  const totalCount = counts.total ?? apps.length;
  const interviewCount =
    counts.Interview ??
    apps.filter((a) => (a.status || a.stage) === "Interview").length;
  const offerCount =
    counts.Offer ??
    apps.filter((a) => (a.status || a.stage) === "Offer").length;
  const rejectedCount =
    counts.Rejected ??
    apps.filter((a) => (a.status || a.stage) === "Rejected").length;

  const kpis = [
    {
      title: "Applications",
      value: totalCount,
      hint: "Active pipeline",
      icon: <Briefcase className="h-5 w-5" />,
      accent: "indigo" as const,
    },
    {
      title: "Interviews",
      value: interviewCount,
      hint: "Scheduled or ongoing",
      icon: <Calendar className="h-5 w-5" />,
      accent: "sky" as const,
    },
    {
      title: "Offers",
      value: offerCount,
      hint: "Decision time",
      icon: <CheckCircle2 className="h-5 w-5" />,
      accent: "green" as const,
    },
    {
      title: "Rejected",
      value: rejectedCount,
      hint: "Learn and iterate",
      icon: <XCircle className="h-5 w-5" />,
      accent: "rose" as const,
    },
  ];

  const upcomingInterviewList = useMemo(() => {
    if (interviews && interviews.length > 0) return interviews;
    if (dashboard?.upcomingInterviews && dashboard.upcomingInterviews.length > 0) {
      return dashboard.upcomingInterviews;
    }
    return apps
      .filter((a) => (a.status || a.stage) === "Interview")
      .map((a) => ({
        id: `app_${a.id}`,
        title: `${a.position?.title || a.position_title || "Position"} Interview`,
        contact: a.company?.name || a.company_name || "Company",
        location: "Online (Google Meet)",
        date: a.deadline || a.updatedAt || a.updated_at || new Date().toISOString(),
      }));
  }, [interviews, dashboard, apps]);

  const recentApplicationsList = useMemo(() => {
    if (apps && apps.length > 0) return apps;
    return dashboard?.recentApplications ?? [];
  }, [apps, dashboard]);

  return (
    <div data-ct-light className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <Logo variant="dark" />
        </div>
        <div className="text-xs text-slate-500">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</div>
        <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {greeting}, {profile?.firstName ?? "Student"}.
        </div>
        <div className="mt-2 text-sm text-slate-500">
          Your career search, condensed into a calm command center.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <StatCard key={k.title} {...k} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ApplicationChart growth={analytics?.growth ?? dashboard?.growth ?? []} />
        </div>
        <div className="lg:col-span-4">
          <UpcomingInterviews interviews={upcomingInterviewList} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <UpcomingDeadlines applications={apps} />
        </div>
        <div className="lg:col-span-6">
          <RecentApplications applications={recentApplicationsList} />
        </div>
      </div>
    </div>
  );
}
