export const ADMIN_USERNAME = "veloe";
export const ADMIN_PASSWORD = "veloe2026";
export const ADMIN_COOKIE = "veloe_admin_session";
export const ADMIN_SESSION_VALUE = "veloe_admin_authenticated";

export function validateAdminCredentials(
  username: string,
  password: string
): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function isAdminAuthenticated(session: string | undefined): boolean {
  return session === ADMIN_SESSION_VALUE;
}
