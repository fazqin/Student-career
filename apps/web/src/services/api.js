import {
  profile as _profile,
  companies as _companies,
  positions as _positions,
  applications as _applications,
  interviews as _interviews,
} from "@/data/mockData";


const API_BASE_URL = "http://localhost:3000/api";
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

export async function loginUser({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Login gagal");
  }

  return result.data;
}


export async function registerUser({ name, email, password, university, major, semester }) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      full_name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      university,
      major,
      semester: Number(semester)
    })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Registrasi gagal.");
  }

  return result.data;
}


export async function getProfile() {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal mengambil profil");
  }

  const user = result.data.user;

  const nameParts = (user.full_name ?? "").trim().split(/\s+/);

  return {
    id: user.id,
    email: user.email,
    firstName: nameParts[0] ?? "",
    lastName: nameParts.slice(1).join(" "),
    title: user.headline ?? "",
    university: user.university ?? "",
    graduation: user.graduation_year?.toString() ?? "",
    location: user.location ?? "",
    links: {
      linkedin: user.linkedin_url ?? "",
      github: user.github_url ?? "",
      portfolio: user.portfolio_url ?? "",
    },
    major: user.major ?? "",
    semester: user.semester ?? "",
    focusAreas: [],
  };
}


export async function updateProfile(partial) {
  const fullName = [
    partial.firstName,
    partial.lastName
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const response = await fetch(`${API_BASE_URL}/profiles/me`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      full_name: fullName,
      university: partial.university,
      major: partial.major,
      semester: Number(partial.semester),
      graduation_year: partial.graduation
        ? Number(partial.graduation)
        : null,
      headline: partial.title ?? "",
      location: partial.location ?? "",
      github_url: partial.links?.github ?? "",
      linkedin_url: partial.links?.linkedin ?? "",
      portfolio_url: partial.links?.portfolio ?? ""
    })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal memperbarui profil"
    );
  }

  return {
    ...partial,
    id: result.data.profile.user_id,
    firstName: result.data.profile.full_name.split(/\s+/)[0] ?? "",
    lastName: result.data.profile.full_name.split(/\s+/).slice(1).join(" "),
    university: result.data.profile.university,
    major: result.data.profile.major,
    semester: result.data.profile.semester,
    graduation: result.data.profile.graduation_year?.toString() ?? "",
    title: result.data.profile.headline ?? "",
    location: result.data.profile.location ?? "",
    links: {
      github: result.data.profile.github_url ?? "",
      linkedin: result.data.profile.linkedin_url ?? "",
      portfolio: result.data.profile.portfolio_url ?? ""
    }
  };
}


export async function getCompanies() {
  await delay();
  return clone(state.companies);
}


export async function getPositions({ query = "", type = "All", page = 1, limit = 6  } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const response = await fetch(`${API_BASE_URL}/positions?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Gagal mengambil data positions");
  }
  const result = await response.json();
  const rows = result.data ?? [];
  const positions = rows.map((p) => ({
    id: String(p.id),
    companyId: String(p.company_id),
    title: p.title,
    location: p.location,
    deadline: p.deadline,
    type: p.work_type,
    team: p.industry,
    salaryRange: p.salary_range,
    tags: [p.industry, p.work_type, p.intern_status].filter(Boolean),
    internStatus: p.intern_status,
    description: p.description,
    company: {
      id: String(p.company_id),
      name: p.company_name,
      industry: p.industry,
      size: p.company_size,
      brandColor: p.brand_color,
      website: p.website,
    },
  }));
  return {
    positions,
    pagination: result.pagination || { page: 1, totalPages: 1, totalItems: positions.length }
  };
}

export async function getPositionById(positionId) {
  const response = await fetch(
    `${API_BASE_URL}/positions/${encodeURIComponent(positionId)}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Position tidak ditemukan");
    }

    throw new Error("Gagal mengambil detail position");
  }

  const result = await response.json();
  const p = result.data ?? result;

  return {
    id: String(p.id),
    companyId: String(p.company_id),
    title: p.title,
    location: p.location,
    deadline: p.deadline,
    type: p.work_type,
    team: p.industry,
    salaryRange: p.salary_range,
    tags: [p.industry, p.work_type, p.intern_status].filter(Boolean),
    internStatus: p.intern_status,
    description: p.description,
    company: {
      id: String(p.company_id),
      name: p.company_name,
      industry: p.industry,
      size: p.company_size,
      brandColor: p.brand_color,
      website: p.website,
    },
  };
}



export async function getApplications() {
  const response = await fetch(`${API_BASE_URL}/applications`, {
    credentials: "include"
  });

  if (!response.ok) {
    throw new Error("Failed to fetch applications");
  }

  const result = await response.json();
  const data = result.data ?? result;

  return data.map((a) => ({
  id: String(a.id),
  userId: a.user_id,
  positionId: String(a.position_id),
  // `status` is the raw DB value (e.g. "Applied", "Withdrawn", "Rejected").
  // `stage` is kept as an alias for backward compatibility with existing components.
  status: a.status,
  stage: a.status,
  priority: a.priority,
  createdAt: a.created_at,
  updatedAt: a.updated_at,
  appliedDate: a.applied_date,
  deadline: a.application_deadline ?? a.position_deadline,
  notes: a.notes,

  position: {
    id: String(a.position_id),
    title: a.position_title,
    team: a.company_industry,
    deadline: a.position_deadline,
  },
  company: {
    name: a.company_name,
    industry: a.company_industry,
  },
}))};


export async function createApplication(payload) {
  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      position_id: Number(payload.position_id),
      status: payload.status ?? "Applied",
      priority: payload.priority ?? "Medium",
      deadline: payload.deadline ?? null,
      notes: payload.notes ?? null,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal menambahkan lamaran");
  }

  return result.data;
}



export async function updateApplication(applicationId, payload) {
  const response = await fetch(
    `${API_BASE_URL}/applications/${applicationId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(payload.priority !== undefined && {
          priority: payload.priority,
        }),
        ...(payload.deadline !== undefined && {
          deadline: payload.deadline || null,
        }),
        ...(payload.notes !== undefined && {
          notes: payload.notes,
        }),
        ...(payload.status !== undefined && {
          status: payload.status,
        }),
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal memperbarui application"
    );
  }

  return result.data;
}


export async function updateApplicationStatus(applicationId, status) {
  return updateApplication(applicationId, { status });
}

export async function deleteApplication(applicationId) {
  const response = await fetch(
    `${API_BASE_URL}/applications/${applicationId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete application");
  }

  return response.json();
}

export async function getInterviews() {
  try {
    const response = await fetch(`${API_BASE_URL}/interview`, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const result = await response.json();
      const rows = Array.isArray(result) ? result : (result.data || []);
      return rows.map((i) => ({
        id: String(i.id),
        applicationId: String(i.application_id ?? i.applicationId ?? ""),
        title: i.title || (i.position ? `${i.position} Interview` : "Interview"),
        position: i.position ?? "",
        company: i.company ?? "",
        contact: i.contact || i.company || "Hiring Team",
        location: i.location || i.type || "Online (Google Meet)",
        date: i.date || i.interview_date || new Date().toISOString(),
        interview_date: i.interview_date || i.date || new Date().toISOString(),
        type: i.type || "Online (Google Meet)",
        status: i.status || "Scheduled",
      }));
    }
  } catch (error) {
    console.warn("Failed to fetch interviews from REST API, using fallback:", error);
  }

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
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const result = await response.json();
      if (result.data) {
        return result.data;
      }
    }
  } catch (error) {
    console.warn("Failed to fetch dashboard data from REST API, using fallback:", error);
  }

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
  try {
    const apps = await getApplications();
    if (Array.isArray(apps) && apps.length > 0) {
      const byStage = apps.reduce((acc, a) => {
        const stage = a.status || a.stage;
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
      }, {});

      const byCompany = apps.reduce((acc, a) => {
        const key = a.company?.name || "Other";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      const byIndustry = apps.reduce((acc, a) => {
        const key = a.company?.industry || "Other";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      const weeks = Array.from({ length: 8 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (7 * (7 - i)));
        return d;
      });

      const growth = weeks.map((d, idx) => {
        const count = apps.filter(
          (a) => new Date(a.createdAt || a.appliedDate).getTime() <= d.getTime()
        ).length;
        return {
          week: `W${idx + 1}`,
          applications: count,
          interviews: apps.filter(
            (a) => (a.status === "Interview" || a.stage === "Interview") &&
                   new Date(a.updatedAt || a.createdAt).getTime() <= d.getTime()
          ).length,
          offers: apps.filter(
            (a) => (a.status === "Offer" || a.stage === "Offer") &&
                   new Date(a.updatedAt || a.createdAt).getTime() <= d.getTime()
          ).length,
        };
      });

      return {
        byStage,
        byCompany,
        byIndustry,
        growth,
      };
    }
  } catch (err) {
    console.warn("Analytics from applications failed, using mock:", err);
  }

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

// =========================================================================
// SUBSCRIPTION & RAW TRANSACTION API METHODS
// =========================================================================

export async function subscribeToTier({ tier, paymentMethod }) {
  const token = localStorage.getItem("token") || localStorage.getItem("access_token");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/subscriptions/subscribe`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ tier, paymentMethod }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Gagal memproses transaksi langganan.");
  }
  return data;
}

export async function getCurrentSubscription() {
  const token = localStorage.getItem("token") || localStorage.getItem("access_token");
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/subscriptions/current`, {
    headers,
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Gagal mengambil info langganan saat ini.");
  }
  return data;
}

export async function getTransactionHistory() {
  const token = localStorage.getItem("token") || localStorage.getItem("access_token");
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/subscriptions/history`, {
    headers,
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Gagal mengambil riwayat transaksi.");
  }
  return data;
}

