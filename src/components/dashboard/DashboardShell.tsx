import LogoLink from "@/components/LogoLink";
import { DashboardHeaderActions } from "@/components/dashboard/DashboardHeaderActions";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-primary/15 bg-card">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <LogoLink />
          <DashboardHeaderActions />
        </nav>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">{children}</div>
    </div>
  );
}
