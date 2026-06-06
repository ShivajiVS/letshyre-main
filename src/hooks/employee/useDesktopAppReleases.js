import { useQuery } from "@tanstack/react-query";
import { getDesktopAppReleases } from "../../services/employee/desktopApp.service";

export const useDesktopAppReleases = () => {
  return useQuery({
    queryKey: ["desktopAppReleases"],
    queryFn: getDesktopAppReleases,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
