import {
  applications as _applications,
  companies as _companies,
  interviews as _interviews,
  positions as _positions,
  profile as _profile,
} from "../data/mockData";

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

let state = {
  profile: { ..._profile },
  companies: [..._companies],
  positions: [..._positions],
  applications: [..._applications],
  interviews: [..._interviews],
  savedPositionIds: new Set(["p_03", "p_01"]),
};

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function nowIso() {
  return new Date().toISOString();
}

export async function loginUser() {
  await delay();
  return { token: "mock_token", user: clone(state.profile) };
}

export async function registerUser() {
  await delay();
  return { token: "mock_token", user: clone(state.profile) };
}

export async function getProfile() {
  await delay();
  return clone(state.profile);
}

export async function updateProfile(partial) {
  await delay();
  state.profile = { ...state.profile, ...partial };
  return clone(state.profile);
}

export async function getCompanies() {
  await delay();
  return clone(state.companies);
}

export async function getPositions({ query = "", type = "All" } = {}) {
  await delay();
  const q = query.trim().toLowerCase();
  return clone(
    state.positions.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.tags.join(" ").toLowerCase().includes(q);
      const matchesType = type === "All" ? true : p.type === type;
      return matchesQuery && matchesType;
    })
  );
}

export async function getPositionById(positionId) {
  await delay();
  const found = state.positions.find((p) => p.id === positionId);
  if (!found) throw new Error("Position not found");
  return clone(found);
}

export async function getApplications() {
  await delay();
  return clone(state.applications);
}

export async function createApplication(payload) {
  await delay();
  const newItem = {
    id: `a_${Math.random().toString(16).slice(2)}`,
    createdAt: nowIso().slice(0, 10),
    updatedAt: nowIso().slice(0, 10),
    stage: "Wishlist",
    priority: "Medium",
    notes: "",
    ...payload,
  };
  state.applications = [newItem, ...state.applications];
  return clone(newItem);
}

export async function updateApplication(applicationId, payload) {
  await delay();
  state.applications = state.applications.map((a) =>
    a.id === applicationId ? { ...a, ...payload, updatedAt: nowIso().slice(0, 10) } : a
  );
  return clone(state.applications.find((a) => a.id === applicationId));
}

export async function updateApplicationStatus(applicationId, stage) {
  return updateApplication(applicationId, { stage });
}

export async function deleteApplication(applicationId) {
  await delay();
  state.applications = state.applications.filter((a) => a.id !== applicationId);
  state.interviews = state.interviews.filter((i) => i.applicationId !== applicationId);
  return { ok: true };
}

export async function getInterviews() {
  await delay();
  return clone(state.interviews);
}

export async function createInterview(payload) {
  await delay();
  const newItem = {
    id: `i_${Math.random().toString(16).slice(2)}`,
    ...payload,
  };
  state.interviews = [newItem, ...state.interviews];
  return clone(newItem);
}

export async function updateInterview(interviewId, payload) {
  await delay();
  state.interviews = state.interviews.map((i) =>
    i.id === interviewId ? { ...i, ...payload } : i
  );
  return clone(state.interviews.find((i) => i.id === interviewId));
}

export async function deleteInterview(interviewId) {
  await delay();
  state.interviews = state.interviews.filter((i) => i.id !== interviewId);
  return { ok: true };
}

export async function getDashboard() {
  await delay();
  // Frontend-derived summary (mirrors what an API could return later)
  const counts = state.applications.reduce(
    (acc, a) => {
      acc.total += 1;
      acc[a.stage] = (acc[a.stage] || 0) + 1;
      return acc;
    },
    { total: 0 }
  );

  const upcomingInterviews = [...state.interviews]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  const recentApplications = [...state.applications]
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 6);

  return clone({
    counts,
    upcomingInterviews,
    recentApplications,
  });
}

export async function getAnalytics() {
  await delay();

  const byStage = state.applications.reduce((acc, a) => {
    acc[a.stage] = (acc[a.stage] || 0) + 1;
    return acc;
  }, {});

  const byCompany = state.applications.reduce((acc, a) => {
    const pos = state.positions.find((p) => p.id === a.positionId);
    const key = pos?.companyId || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const byIndustry = state.applications.reduce((acc, a) => {
    const pos = state.positions.find((p) => p.id === a.positionId);
    const company = state.companies.find((c) => c.id === pos?.companyId);
    const key = company?.industry || "Other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Simple growth series over last 8 weeks (mocked from createdAt)
  const weeks = Array.from({ length: 8 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (7 * (7 - i)));
    return d;
  });

  const growth = weeks.map((d, idx) => {
    const count = state.applications.filter(
      (a) => new Date(a.createdAt).getTime() <= d.getTime()
    ).length;
    return {
      week: `W${idx + 1}`,
      applications: count,
      interviews: Math.round(count * 0.28),
      offers: Math.max(0, Math.round(count * 0.08) - 1),
    };
  });

  return clone({
    byStage,
    byCompany,
    byIndustry,
    growth,
  });
}

export async function isSavedPosition(positionId) {
  await delay(50);
  return state.savedPositionIds.has(positionId);
}

export async function toggleSavedPosition(positionId) {
  await delay(120);
  if (state.savedPositionIds.has(positionId)) state.savedPositionIds.delete(positionId);
  else state.savedPositionIds.add(positionId);
  return { saved: state.savedPositionIds.has(positionId) };
}
