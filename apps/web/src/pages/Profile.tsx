import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/services/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const p = await getProfile();
      if (alive) setProfile(p);
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function onSave() {
    if (!profile) return;
    setSaving(true);
    try {
      const next = await updateProfile(profile);
      setProfile(next);
    } finally {
      setSaving(false);
    }
  }

  if (!profile) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-white/60">Loading…</div>
    );
  }

  return (
    <div data-ct-light className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xs text-slate-500">Professional profile</div>
        <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          Your career snapshot.
        </div>
        <div className="mt-2 text-sm text-slate-500">
          Keep links and context ready for applications.
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7">
          <div className="text-sm font-semibold text-slate-900">Personal information</div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <Label>First name</Label>
              <Input value={profile.firstName ?? ""} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
            </div>
            <div>
              <Label>Last name</Label>
              <Input value={profile.lastName ?? ""} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Headline</Label>
              <Input value={profile.title ?? ""} onChange={(e) => setProfile({ ...profile, title: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Email</Label>
              <Input value={profile.email ?? ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={profile.location ?? ""} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
            </div>
          </div>
        </Card>

        <Card className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5">
          <div className="text-sm font-semibold text-slate-900">Education</div>
          <div className="mt-6 grid gap-4">
            <div>
              <Label>University</Label>
              <Input value={profile.university ?? ""} onChange={(e) => setProfile({ ...profile, university: e.target.value })} />
            </div>
            <div>
              <Label>Graduation</Label>
              <Input value={profile.graduation ?? ""} onChange={(e) => setProfile({ ...profile, graduation: e.target.value })} />
            </div>
            <div className="rounded-lg border border-teal-200 bg-teal-50 p-4 text-xs text-teal-800">
              Keep this updated — it appears in your application exports (future).
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7">
          <div className="text-sm font-semibold text-slate-900">Career links</div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <Label>LinkedIn</Label>
              <Input
                value={profile.links?.linkedin ?? ""}
                onChange={(e) => setProfile({ ...profile, links: { ...profile.links, linkedin: e.target.value } })}
              />
            </div>
            <div>
              <Label>GitHub</Label>
              <Input
                value={profile.links?.github ?? ""}
                onChange={(e) => setProfile({ ...profile, links: { ...profile.links, github: e.target.value } })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Portfolio</Label>
              <Input
                value={profile.links?.portfolio ?? ""}
                onChange={(e) => setProfile({ ...profile, links: { ...profile.links, portfolio: e.target.value } })}
              />
            </div>
          </div>
        </Card>

        <Card className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5">
          <div className="text-sm font-semibold text-slate-900">Focus areas</div>
          <div className="mt-3 text-xs text-slate-500">
            Comma-separated (demo)
          </div>
          <div className="mt-4">
            <Input
              value={(profile.focusAreas ?? []).join(", ")}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  focusAreas: e.target.value
                    .split(",")
                    .map((s: string) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>

          <div className="mt-6 flex items-center justify-end">
            <Button variant="primary" onClick={onSave} disabled={saving}>
              {saving ? "Saving…" : "Save profile"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
