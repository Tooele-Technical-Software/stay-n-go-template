import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Log in — Stay N Go",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-surface via-accent to-vivid-light/30 px-6 py-12">
      <AuthForm />
    </div>
  );
}
