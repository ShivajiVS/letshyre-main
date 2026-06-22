import img01 from "@/assets/login-img011.png";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export function EmployerSignIn() {
  return (
    <AuthLayout image={img01} title="Employer Login">
      <LoginForm role="Employer" registerLink="/employer/register" />
    </AuthLayout>
  );
}
