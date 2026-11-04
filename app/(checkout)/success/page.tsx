import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { programById, trainerById } from "@/lib/data";
import { moneyExact } from "@/lib/format";

export const metadata: Metadata = {
  title: "You're in",
  description:
    "Stronger in 12 by Maya Okafor is now in your FitCoach dashboard. Lesson one is ready when you are.",
  robots: { index: false, follow: false },
};

const program = programById("stronger-in-12");
const coach = trainerById(program.trainerId);

/** The three things that happen next, in the order they happen. */
const steps = [
  {
    title: "Watch the assessment week",
    body: "Five movements, two attempts each, filmed from the side. It sets every load in the programme, so do it before you touch a barbell.",
  },
  {
    title: "Log your first session",
    body: "Record your sets against the plan. Maya reads the log and writes your week-two adjustment on Sunday.",
  },
  {
    title: "Book your first check-in call",
    body: "Fifty minutes, video, in the browser. Pick a slot from your dashboard and it lands in both calendars.",
  },
];

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-[640px]">
      {/* The mark. */}
      <span
        aria-hidden="true"
        className="chamfer-tl flex size-8 items-center justify-center bg-accent text-accent-ink"
        style={{ "--cut": "10px" } as React.CSSProperties}
      >
        <Icon name="check" size={16} strokeWidth={2.6} />
      </span>

      <h1 className="mt-6 font-display text-[clamp(1.9rem,3.4vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
        You&apos;re in.
      </h1>
      <p className="mt-3 text-[16px] leading-relaxed text-ink-2">
        {coach.name}&apos;s {program.title} is now in your dashboard. Lesson one
        is ready when you are.
      </p>

      {/* The order. */}
      <div className="mt-9 overflow-hidden rounded-panel border border-line bg-surface-1">
        <dl className="divide-y divide-line">
          <Row label="Programme" value={`${program.title}, by ${coach.name}`} />
          <Row label="Coach" value={coach.name} />
          <Row label="Price paid" value={moneyExact(program.priceCents)} />
          <Row label="Platform fee" value="Included" />
          <Row label="VAT" value="Included" />
          <Row
            label="Total"
            value={moneyExact(program.priceCents)}
            emphasis
          />
        </dl>
      </div>

      {/* What happens next. */}
      <section className="mt-12">
        <h2 className="font-display text-[19px] font-bold tracking-[-0.02em] text-ink">
          What happens next
        </h2>

        <ol className="mt-6 grid gap-x-8 gap-y-8">
          {steps.map((step, index) => (
            <li key={step.title} className="border-t border-line pt-4">
              <p className="tnum font-display text-[13px] font-bold tracking-[0.12em] text-accent">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-[16px] font-bold tracking-[-0.01em] text-ink">
                {step.title}
              </h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-11 flex flex-col gap-3 sm:flex-row">
        <ButtonLink
          href="/learn/stronger-in-12"
          size="lg"
          className="w-full sm:w-auto"
        >
          Start week one
        </ButtonLink>
        <ButtonLink
          href="/dashboard"
          variant="secondary"
          size="lg"
          className="w-full sm:w-auto"
        >
          Go to dashboard
        </ButtonLink>
      </div>

      <p className="mt-8 text-[13px] leading-relaxed text-ink-3">
        A receipt is on its way to your inbox. The programme stays in your
        account permanently — you can rewatch every lesson you have finished,
        and the rest unlock as you reach them.
      </p>
    </div>
  );
}

/**
 * One line of the order summary: a label on the left, a value on the right,
 * with the total given the weight it deserves.
 */
function Row({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-4 py-3.5 sm:gap-6 sm:px-5">
      <dt className="text-[14px] text-ink-2">{label}</dt>
      <dd
        className={
          emphasis
            ? "tnum font-display text-[19px] font-extrabold tracking-[-0.02em] text-ink"
            : "text-[14px] text-ink"
        }
      >
        {value}
      </dd>
    </div>
  );
}
