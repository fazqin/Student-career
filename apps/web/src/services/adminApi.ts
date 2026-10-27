/**
 * Service API Layer for CareerTrack Admin Management
 * 
 * Strict Architecture Rules:
 * - NO direct Supabase connection from frontend.
 * - HTTP client (fetch) calls to backend REST API.
 * - Robust mock API contracts with local persistence fallback if backend endpoints
 *   are not yet available or offline.
 */

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
}

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminAuthResponse {
  token: string;
  user: AdminUser;
}

export interface Company {
  id: string | number;
  name: string;
  industry?: string;
  size?: string;
  location?: string;
  brandColor?: string;
  website?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type PositionStatus = "Draft" | "Published" | "Closed";

export interface Position {
  id: string | number;
  companyId: string | number;
  companyName?: string;
  title: string;
  description: string;
  location: string;
  type: string; // e.g. "Full-time", "Part-time", "Internship", "Contract"
  deadline: string;
  status: PositionStatus;
  salaryRange?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:3000/api";
const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

const TOKEN_KEY = "careertrack_admin_token";
const USER_KEY = "careertrack_admin_user";
const COMPANIES_STORAGE_KEY = "careertrack_mock_companies";
const POSITIONS_STORAGE_KEY = "careertrack_mock_positions";

// Default initial mock data for fallback
const INITIAL_COMPANIES: Company[] = [
  {
    id: "c_aurora",
    name: "Aurora Labs",
    industry: "Data & Infrastructure",
    size: "201–500",
    location: "Singapore (Hybrid)",
    brandColor: "#6366F1",
    website: "https://example.com/aurora",
    description: "Cloud data infrastructure and AI accelerator platform.",
  },
  {
    id: "c_nova",
    name: "Nova Fintech",
    industry: "FinTech",
    size: "51–200",
    location: "London (Remote)",
    brandColor: "#38BDF8",
    website: "https://example.com/nova",
    description: "Next-gen banking infrastructure and borderless payments.",
  },
  {
    id: "c_helio",
    name: "Helio Health",
    industry: "HealthTech",
    size: "1001+",
    location: "Berlin (On-site)",
    brandColor: "#22C55E",
    website: "https://example.com/helio",
    description: "Pioneering personalized medicine and genomic analytics.",
  },
  {
    id: "c_pulse",
    name: "Pulse AI Studio",
    industry: "Product & ML",
    size: "11–50",
    location: "San Francisco (Hybrid)",
    brandColor: "#A855F7",
    website: "https://example.com/pulse",
    description: "Generative AI interfaces and agent workflow builders.",
  },
];

const INITIAL_POSITIONS: Position[] = [
  {
    id: "p_01",
    companyId: "c_aurora",
    companyName: "Aurora Labs",
    title: "Software Engineering Intern",
    description: "Build robust distributed data ingestion pipelines with TypeScript, Go, and PostgreSQL.",
    location: "Singapore (Hybrid)",
    type: "Internship",
    deadline: "2026-11-30",
    status: "Published",
    salaryRange: "$1,800–$2,400 /mo",
    tags: ["TypeScript", "API", "PostgreSQL"],
  },
  {
    id: "p_02",
    companyId: "c_nova",
    companyName: "Nova Fintech",
    title: "Product Analytics Intern",
    description: "Design experiment frameworks, analyze user funnel cohorts, and craft executive dashboards.",
    location: "London (Remote)",
    type: "Internship",
    deadline: "2026-12-15",
    status: "Published",
    salaryRange: "£1,700–£2,100 /mo",
    tags: ["SQL", "Analytics", "Dashboards"],
  },
  {
    id: "p_03",
    companyId: "c_pulse",
    companyName: "Pulse AI Studio",
    title: "Fullstack AI Engineer",
    description: "Work on cutting-edge agent orchestration frameworks with React, FastAPI, and LLM tool-calling.",
    location: "San Francisco (Hybrid)",
    type: "Full-time",
    deadline: "2026-12-31",
    status: "Draft",
    salaryRange: "$110,000–$140,000 /yr",
    tags: ["React", "Python", "LLMs"],
  },
];

/* Helper to get persisted mock store */
function getStoredCompanies(): Company[] {
  try {
    const raw = localStorage.getItem(COMPANIES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return [...INITIAL_COMPANIES];
}

function saveStoredCompanies(list: Company[]): void {
  try {
    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    // ignore
  }
}

function getStoredPositions(): Position[] {
  try {
    const raw = localStorage.getItem(POSITIONS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return [...INITIAL_POSITIONS];
}

function saveStoredPositions(list: Position[]): void {
  try {
    localStorage.setItem(POSITIONS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    // ignore
  }
}

/* =========================================================================
 * AUTHENTICATION SESSION UTILITIES
 * ========================================================================= */

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getAdminUser(): AdminUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAdminSession(token: string, user: AdminUser): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export function clearAdminSession(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // ignore
  }
}

export function isAdminAuthenticated(): boolean {
  return Boolean(getAdminToken());
}

/* =========================================================================
 * ADMIN AUTHENTICATION API
 * ========================================================================= */

/**
 * Log in admin using email and password.
 * Queries backend REST endpoint if present, with mock contract fallback.
 */
export async function adminLogin(payload: AdminLoginPayload): Promise<AdminAuthResponse> {
  const email = payload.email.trim().toLowerCase();
  const password = payload.password;

  // 1. Tembak ke endpoint autentikasi resmi backend & Supabase
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include", // 👈 Wajib agar Cookie JWT diset ke browser
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Email atau password salah.");
  }

  const user = result.data?.user;

  // 2. Verifikasi keamanan: Pastikan akun tersebut memang bertipe 'admin'
  if (user?.role !== "admin") {
    throw new Error("Akses ditolak: Akun ini bukan administrator.");
  }

  const authData: AdminAuthResponse = {
    token: `admin_token_${Date.now()}`,
    user: {
      id: user.id,
      name: user.email.split("@")[0],
      email: user.email,
      role: user.role,
    },
  };

  setAdminSession(authData.token, authData.user);
  return authData;
}


export async function adminLogout(): Promise<void> {
  await delay(200);
  clearAdminSession();
}

export async function getAdminProfile(): Promise<AdminUser> {
  await delay(200);
  const user = getAdminUser();
  if (!user) {
    throw new Error("Admin session expired or unauthenticated.");
  }
  return user;
}

/* =========================================================================
 * COMPANY MANAGEMENT API CONTRACT
 * ========================================================================= */

export async function getAdminCompanies(): Promise<Company[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/companies`);
    if (res.ok) {
      const data = await res.json();
      const rows = data.data ?? data;
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map((c: any) => ({
          id: String(c.id),
          name: c.name,
          industry: c.industry || "Technology",
          size: c.size || c.company_size || "50-200",
          location: c.location || "Indonesia",
          brandColor: c.brand_color || "#14b8a6",
          website: c.website || "",
          description: c.description || "",
        }));
      }
    }
  } catch (e) {
    // fallback
  }

  await delay(300);
  return getStoredCompanies();
}

export async function getAdminCompanyById(id: string | number): Promise<Company> {
  try {
    const res = await fetch(`${API_BASE_URL}/companies/${encodeURIComponent(id)}`);
    if (res.ok) {
      const data = await res.json();
      const c = data.data ?? data;
      return {
        id: String(c.id),
        name: c.name,
        industry: c.industry || "Technology",
        size: c.size || c.company_size || "50-200",
        location: c.location || "Indonesia",
        brandColor: c.brand_color || "#14b8a6",
        website: c.website || "",
        description: c.description || "",
      };
    }
  } catch (e) {
    // fallback
  }

  await delay(200);
  const found = getStoredCompanies().find((c) => String(c.id) === String(id));
  if (!found) throw new Error("Company not found.");
  return found;
}

export async function createAdminCompany(
  payload: Omit<Company, "id" | "createdAt" | "updatedAt">
): Promise<Company> {
  try {
    const res = await fetch(`${API_BASE_URL}/companies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      return data.data ?? data;
    }
  } catch (e) {
    // fallback
  }

  await delay(400);
  const current = getStoredCompanies();
  const newCompany: Company = {
    ...payload,
    id: `c_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveStoredCompanies([newCompany, ...current]);
  return newCompany;
}

export async function updateAdminCompany(
  id: string | number,
  payload: Partial<Company>
): Promise<Company> {
  try {
    const res = await fetch(`${API_BASE_URL}/companies/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      return data.data ?? data;
    }
  } catch (e) {
    // fallback
  }

  await delay(400);
  const current = getStoredCompanies();
  const index = current.findIndex((c) => String(c.id) === String(id));
  if (index === -1) {
    throw new Error("Company to update not found.");
  }
  const updated = {
    ...current[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  current[index] = updated;
  saveStoredCompanies(current);
  return updated;
}

export async function deleteAdminCompany(
  id: string | number
): Promise<{ success: boolean; id: string | number }> {
  try {
    const res = await fetch(`${API_BASE_URL}/companies/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      return { success: true, id };
    }
  } catch (e) {
    // fallback
  }

  await delay(400);
  const current = getStoredCompanies();
  const filtered = current.filter((c) => String(c.id) !== String(id));
  saveStoredCompanies(filtered);
  return { success: true, id };
}

/* =========================================================================
 * POSITION MANAGEMENT API CONTRACT
 * ========================================================================= */

export async function getAdminPositions(): Promise<Position[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/positions`);
    if (res.ok) {
      const data = await res.json();
      const rows = data.data ?? data;
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map((p: any) => ({
          id: String(p.id),
          companyId: String(p.company_id),
          companyName: p.company_name || "Company",
          title: p.title,
          description: p.description || "",
          location: p.location || "Remote",
          type: p.work_type || "Internship",
          deadline: p.deadline ? p.deadline.slice(0, 10) : "",
          status: (p.status as PositionStatus) || "Published",
          salaryRange: p.salary_range || "",
          tags: [p.industry, p.work_type].filter(Boolean),
        }));
      }
    }
  } catch (e) {
    // fallback
  }

  await delay(300);
  return getStoredPositions();
}

export async function getAdminPositionById(id: string | number): Promise<Position> {
  try {
    const res = await fetch(`${API_BASE_URL}/positions/${encodeURIComponent(id)}`);
    if (res.ok) {
      const data = await res.json();
      const p = data.data ?? data;
      return {
        id: String(p.id),
        companyId: String(p.company_id),
        companyName: p.company_name,
        title: p.title,
        description: p.description,
        location: p.location,
        type: p.work_type,
        deadline: p.deadline ? p.deadline.slice(0, 10) : "",
        status: (p.status as PositionStatus) || "Published",
        salaryRange: p.salary_range,
      };
    }
  } catch (e) {
    // fallback
  }

  await delay(200);
  const found = getStoredPositions().find((p) => String(p.id) === String(id));
  if (!found) throw new Error("Position not found.");
  return found;
}

export async function createAdminPosition(
  payload: Omit<Position, "id" | "createdAt" | "updatedAt">
): Promise<Position> {
  try {
    const res = await fetch(`${API_BASE_URL}/positions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_id: payload.companyId,
        title: payload.title,
        description: payload.description,
        location: payload.location,
        work_type: payload.type,
        deadline: payload.deadline,
        status: payload.status,
        salary_range: payload.salaryRange,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.data ?? data;
    }
  } catch (e) {
    // fallback
  }

  await delay(400);
  const current = getStoredPositions();
  const newPos: Position = {
    ...payload,
    id: `p_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveStoredPositions([newPos, ...current]);
  return newPos;
}

export async function updateAdminPosition(
  id: string | number,
  payload: Partial<Position>
): Promise<Position> {
  try {
    const res = await fetch(`${API_BASE_URL}/positions/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      return data.data ?? data;
    }
  } catch (e) {
    // fallback
  }

  await delay(400);
  const current = getStoredPositions();
  const index = current.findIndex((p) => String(p.id) === String(id));
  if (index === -1) {
    throw new Error("Position to update not found.");
  }
  const updated = {
    ...current[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  current[index] = updated;
  saveStoredPositions(current);
  return updated;
}

export async function deleteAdminPosition(
  id: string | number
): Promise<{ success: boolean; id: string | number }> {
  try {
    const res = await fetch(`${API_BASE_URL}/positions/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      return { success: true, id };
    }
  } catch (e) {
    // fallback
  }

  await delay(400);
  const current = getStoredPositions();
  const filtered = current.filter((p) => String(p.id) !== String(id));
  saveStoredPositions(filtered);
  return { success: true, id };
}

/* =========================================================================
 * APPLICATION BOT API CONTRACT
 * ========================================================================= */

export interface BotActionDetail {
  type: string;
  applicationId: number;
  studentName?: string;
  studentEmail?: string;
  positionTitle?: string;
  companyName?: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
}

export interface BotResponse {
  success: boolean;
  reply: string;
  aiEngine: string;
  actionsTaken: BotActionDetail[];
  data: any[];
}

export interface BotStatus {
  success: boolean;
  hasKey: boolean;
  provider: string;
  model: string;
  connectedDb: boolean;
}

export async function sendAdminBotMessage(message: string): Promise<BotResponse> {
  const res = await fetch(`${API_BASE_URL}/admin/bot/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Gagal memproses pesan bot");
  }
  return result;
}

export async function getAdminBotStatus(): Promise<BotStatus> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/bot/status`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  return {
    success: true,
    hasKey: false,
    provider: "Smart Rule Engine (No Key)",
    model: "heuristic-nlp",
    connectedDb: true,
  };
}

export async function getAdminBotApplications(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/bot/applications`);
    if (res.ok) {
      const result = await res.json();
      return result.data || [];
    }
  } catch {
    // fallback
  }
  return [];
}

export async function updateAdminApplicationStatus(
  id: number | string,
  data: { status?: string; priority?: string; deadline?: string | null; notes?: string | null }
): Promise<any> {
  const token = getAdminToken() || localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}/applications/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Gagal memperbarui lamaran");
  }
  return result.data;
}

