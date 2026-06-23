export type UserRole = "ADMIN" | "USER";

export const EDIT_WINDOW_HOURS = 48;

export function isAdmin(role: UserRole) {
  return role === "ADMIN";
}

export function canDeleteCarnet(role: UserRole) {
  return role === "ADMIN";
}

export function canEditCarnet(role: UserRole, createdAt: Date | string) {
  if (role === "ADMIN") return true;

  const created = new Date(createdAt).getTime();
  const deadline = created + EDIT_WINDOW_HOURS * 60 * 60 * 1000;
  return Date.now() <= deadline;
}

export function getEditDeadline(createdAt: Date | string) {
  return new Date(
    new Date(createdAt).getTime() + EDIT_WINDOW_HOURS * 60 * 60 * 1000
  );
}
