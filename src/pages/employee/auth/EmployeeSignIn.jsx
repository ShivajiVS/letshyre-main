import img01 from "@/assets/login-img01.png";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export function EmployeeSignIn() {
  return (
    <AuthLayout image={img01} title="Login">
      <LoginForm role="employee" registerLink="/employee/register" />
    </AuthLayout>
  );
}
