import { redirect } from "react-router";
import { getUser } from "@/utils/getUser";
import { ROLE_HOME } from "@/constants";

export const requireAuth =
  ({ allowedRoles = [] } = {}) =>
  async () => {
    const user = getUser();

    // 1. Not logged in
    if (!user?.isAuthenticated) {
      throw redirect("/get-started");
    }

    // 2. Role not allowed
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      throw redirect(ROLE_HOME[user.role]); //employer
    }

    return user;
  };

export const requireGuest = async () => {
  const user = getUser();

  if (user?.isAuthenticated) {
    throw redirect(ROLE_HOME[user.role]);
  }

  return null;
};
