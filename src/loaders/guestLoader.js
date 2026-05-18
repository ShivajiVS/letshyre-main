import { redirect } from "react-router";
import { getUser } from "@/utils/getUser";

export async function guestLoader() {
  const user = getUser();

  if (user?.isAuthenticated) {
    // Redirect based on their specific role
    if (user.role === "employer") {
      throw redirect("/employer");
    }
    if (user.role === "admin") {
      throw redirect("/admin");
    }
    // Default to employee if that's your primary user
    throw redirect("/employee");
  }

  return null;
}
