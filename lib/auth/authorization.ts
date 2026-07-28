export type AdminRole = "super_admin" | "admin" | "editor";

export const canManageEditorialContent = (role: AdminRole | null) => role !== null;

export const canManageCampaigns = (role: AdminRole | null) =>
  role === "admin" || role === "super_admin";

export const canManageAdminRoles = (role: AdminRole | null) => role === "super_admin";
