// Hardcoded admin auth — per user request.
// NOTE: This is client-side only and visible in the bundle. Anyone can see these.
const ADMIN_USER = "mrfrankofc";
const ADMIN_PASS = "darex123";
const KEY = "synapex_admin_session";

export function adminLogin(username: string, password: string): boolean {
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    if (typeof window !== "undefined") {
      localStorage.setItem(KEY, "1");
    }
    return true;
  }
  return false;
}

export function adminLogout() {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}

export function isAdmin(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) === "1";
}
