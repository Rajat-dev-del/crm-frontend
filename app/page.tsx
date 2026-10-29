import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function Home() {
  return (
    <AuthShell
      quote="A clear view of your customers helps your whole team build better relationships."
      author="CRM WORKSPACE"
      role="Customer relationship management"
      linkText="Already have an account?"
      linkLabel="Sign in"
      linkHref="/login"
    >
      <RegisterForm />
    </AuthShell>
  );
}
