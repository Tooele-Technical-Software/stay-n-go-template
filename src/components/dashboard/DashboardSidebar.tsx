"use client";

export type DashboardTab = "trips" | "hosting" | "profile";

const tabs: { id: DashboardTab; label: string; description: string }[] = [
  { id: "profile", label: "Profile", description: "Account details" },
  { id: "trips", label: "Trips", description: "Upcoming and past stays" },
  { id: "hosting", label: "Hosting", description: "Your listed properties" },
];

export default function DashboardSidebar({
  active,
  onChange,
  userName,
}: {
  active: DashboardTab;
  onChange: (tab: DashboardTab) => void;
  userName: string;
}) {
  return (
    <aside className="lg:w-64 lg:shrink-0">
      <div className="mb-6 hidden lg:block">
        <p className="text-sm text-muted">Account</p>
        <p className="text-lg font-semibold text-foreground">{userName}</p>
      </div>

      <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`shrink-0 rounded-xl px-4 py-3 text-left transition-colors lg:w-full ${
              active === tab.id
                ? "bg-primary text-white shadow-sm shadow-primary/25"
                : "bg-card text-foreground/80 hover:bg-accent"
            }`}
          >
            <span className="block text-sm font-semibold">{tab.label}</span>
            <span
              className={`hidden text-xs lg:block ${
                active === tab.id ? "text-blue-100" : "text-muted"
              }`}
            >
              {tab.description}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
