import type { Complaint, ComplaintEvent, Incident, Overview, User } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
  : "/api/v1";
const TOKEN_KEY = "jansutra_access_token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window !== "undefined") window.localStorage.removeItem(TOKEN_KEY);
}

export async function api<T>(path: string, init: RequestInit = {}, token?: string | null): Promise<T> {
  const access = token ?? getToken();
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (access) headers.set("Authorization", `Bearer ${access}`);
  const response = await fetch(`${API_BASE}${path}`, { ...init, headers, cache: "no-store" });
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body.detail || message;
    } catch { /* response was not JSON */ }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export async function login(email: string, password: string) {
  const result = await api<{ access_token: string; user: User }>("/auth/login", {
    method: "POST", body: JSON.stringify({ email, password })
  }, null);
  saveToken(result.access_token);
  return result.user;
}

export async function register(input: { name: string; email: string; password: string; preferred_language: string; ward: string }) {
  const result = await api<{ access_token: string; user: User }>("/auth/register", { method: "POST", body: JSON.stringify(input) }, null);
  saveToken(result.access_token);
  return result.user;
}

export const getMe = () => api<User>("/auth/me");
export const getComplaints = (mine = false) => api<Complaint[]>(`/complaints?mine=${mine}`);
export const getComplaint = (id: number) => api<Complaint & { events: ComplaintEvent[] }>(`/complaints/${id}`);
export const getIncidents = () => api<Incident[]>("/incidents");
export const getOverview = () => api<Overview>("/analytics/overview");
