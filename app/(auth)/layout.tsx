import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Chamfer } from "@/components/ui/Chamfer";
import { Wordmark } from "@/components/marketing/SiteHeader";
import { marketplaceStats, testimonials } from "@/lib/data";

/**
 * The authentication shell.
 *
 * Two columns and nothing else — no site header, no footer, no navigation
 * out of the flow. The left column is the form on the page background; the
 * right column is a panel that only exists on a wide screen, because a
 * photograph and a quote are a good reason to sign in and a bad reason to
 * scroll a phone.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const story = testimonials[0];
  const stats = marketplaceStats.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* The form. */}
      <div className="flex min-h-screen flex-1 flex-col px-5 py-7 sm:px-8 lg:px-12 lg:py-9">
        <Link href="/" className="inline-flex w-fit shrink-0">
          <Wordmark />
          <span className="sr-only">FitCoach home</span>
        </Link>

        <div className="flex flex-1 items-center py-10">
          <div className="mx-auto w-full max-w-[420px] lg:mx-0">{children}</div>
        </div>
      </div>

      {/* The panel. */}
      <aside className="hidden bg-surface-1 lg:sticky lg:top-0 lg:block lg:h-screen lg:w-[46%] lg:shrink-0 lg:overflow-y-auto">
        <div className="mx-auto flex min-h-full max-w-[460px] flex-col justify-center gap-9 px-10 py-14 xl:px-12">
          <Chamfer
            cut={40}
            accent
            className="aspect-[4/5] w-full overflow-hidden bg-surface-2"
          >
            <Image
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80"
              alt="Barbells loaded with plates on the racks of a dimly lit training hall"
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover"
            />
          </Chamfer>

          <figure>
            <blockquote className="font-display text-[18px] font-bold leading-[1.4] tracking-[-0.02em] text-ink">
              “{story.quote}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <Avatar name={story.name} src={story.avatar} size={34} />
              <span className="text-[13px] leading-snug text-ink-2">
                {story.name}
                <span className="block text-ink-3">{story.detail}</span>
              </span>
            </figcaption>
          </figure>

          <dl className="grid grid-cols-3 gap-5 border-t border-line pt-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="order-2 mt-1 text-[12px] leading-snug text-ink-3">
                  {stat.label}
                </dt>
                <dd className="tnum order-1 font-display text-[21px] font-extrabold tracking-[-0.02em] text-ink">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>
    </div>
  );
}
