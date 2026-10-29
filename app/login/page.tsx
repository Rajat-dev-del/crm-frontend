import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      quote="A clear view of your customers helps your whole team build better relationships."
      author="CRM WORKSPACE"
      role="Customer relationship management"
      linkText="New to CRM Workspace?"
      linkLabel="Create an account"
      linkHref="/"
    >
      <LoginForm />
    </AuthShell>
  );
}
