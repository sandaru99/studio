"use client";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="container flex-1">
      {children}
    </main>
  );
}
