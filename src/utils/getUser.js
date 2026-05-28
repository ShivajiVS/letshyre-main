export function getUser() {
  const user = localStorage.getItem("user");

  if (!user) return { isAuthenticated: false, role: null };

  const parsed = JSON.parse(user);

  return {
    isAuthenticated: true,
    role: parsed.role,
    user: parsed,
  };
}
