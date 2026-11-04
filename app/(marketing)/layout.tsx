import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";

/**
 * The public shell.
 *
 * Marketing pages get a sticky header and a full footer. The member and
 * coach areas have their own shells — different navigation, different
 * posture — which is why they live in their own route groups.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
