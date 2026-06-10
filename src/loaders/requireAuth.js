import { redirect } from "react-router";
import { getUser } from "@/utils/getUser";
import { ROLES, ROLE_HOME } from "@/constants";

export const requireAuth =
  ({ allowedRoles = [] } = {}) =>
  async ({ request }) => {
    const authData = getUser();

    // 1. Not logged in
    if (!authData?.isAuthenticated) {
      throw redirect("/get-started");
    }

    // 2. Role not allowed
    if (allowedRoles.length > 0 && !allowedRoles.includes(authData.role)) {
      throw redirect(ROLE_HOME[authData.role]); //employer
    }

    // 3. Onboarding Redirects
    if (request && request.url) {
      const url = new URL(request.url);
      const isOnboardingPath = url.pathname.includes("/onboarding");

      const isProfileCompleted = authData.user?.is_profile_completed;

      if (authData.role === ROLES.EMPLOYER) {
        if (isProfileCompleted === false && !isOnboardingPath) {
          throw redirect("/employer/onboarding");
        }
        if (isProfileCompleted === true && isOnboardingPath) {
          throw redirect("/employer");
        }
      }
    }

    return authData;
  };

export const requireGuest = async () => {
  const authData = getUser();

  if (authData?.isAuthenticated) {
    if (
      authData.role === ROLES.EMPLOYER &&
      authData.user?.is_profile_completed === false
    ) {
      throw redirect("/employer/onboarding");
    }
    throw redirect(ROLE_HOME[authData.role]);
  }

  return null;
};
