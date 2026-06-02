import img01 from "@/assets/login-img011.png";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export function EmployerSignIn() {
  return (
    <AuthLayout image={img01} title="Employer Login">
      <LoginForm role="employer" registerLink="/employer/register" />
    </AuthLayout>
  );
}