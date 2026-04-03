export function normalizeUserRole(role?: string | null) {
  return role?.trim().toUpperCase() ?? "STUDENT";
}

export function getDashboardPathFromRole(role?: string | null) {
  switch (normalizeUserRole(role)) {
    case "ADMIN":
      return "/admin-dashboard";
    case "TUTOR":
      return "/tutor/dashboard";
    default:
      return "/dashboard";
  }
}

export function isPathAllowedForRole(pathname: string, role?: string | null) {
  const normalizedRole = normalizeUserRole(role);

  if (normalizedRole === "ADMIN") {
    return pathname.startsWith("/admin-dashboard");
  }

  if (normalizedRole === "TUTOR") {
    return pathname.startsWith("/tutor");
  }

  return pathname.startsWith("/dashboard");
}
