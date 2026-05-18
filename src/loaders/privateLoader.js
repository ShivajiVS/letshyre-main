import { redirect } from "react-router";
import { getUser } from "@/utils/getUser";

export async function privateLoader({ request }) {
  const user = getUser();
  const url = new URL(request.url);

  // 1. Basic Auth Check
  if (!user?.isAuthenticated) {
    throw redirect("/get-started");
  }

  if (url.pathname.startsWith("/employer") && user.role !== "employer") {
    throw redirect("/employee/dashboard");
  }

  // 2. Strict Admin Protection
  if (url.pathname.startsWith("/admin") && user.role !== "admin") {
    // If they aren't an admin, kick them to their own dashboard
    const redirectPath = user.role === "employer" ? "/employer" : "/employee";
    throw redirect(redirectPath);
  }

  // 3. Prevent Admin from accessing User Portals
  if (
    (url.pathname.startsWith("/employee") ||
      url.pathname.startsWith("/employer")) &&
    user.role === "admin"
  ) {
    throw redirect("/admin");
  }

  return user;
}
