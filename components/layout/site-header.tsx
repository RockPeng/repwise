import { Bell } from "lucide-react";
import { Suspense } from "react";
import { Navbar } from "@/components/nav/navbar";
import { AuthControls } from "@/components/layout/auth-controls";

export function SiteHeader() {
  return (
    <header className="vertex-site-header">
      <Navbar active="none" className="vertex-site-header__nav" />
      <div className="vertex-site-header__actions">
        <button className="vertex-site-header__notification" type="button" aria-label="Notifications">
          <Bell size={20} aria-hidden="true" />
        </button>
        <Suspense fallback={<div className="vertex-auth-placeholder" aria-hidden="true" />}>
          <AuthControls />
        </Suspense>
      </div>
    </header>
  );
}
