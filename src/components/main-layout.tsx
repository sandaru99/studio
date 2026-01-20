"use client";

import { useAppStore } from "@/hooks/use-app-store";
import { LoadingAnimation } from "./loading-animation";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { isInitialized } = useAppStore();

  if (!isInitialized) {
    return <LoadingAnimation />;
  }

  return (
    <main className="flex-1">
      {children}
    </main>
  );
}
