import Image from "next/image";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Badge, Dot } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Chamfer } from "@/components/ui/Chamfer";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/Progress";
import { ProgramCard } from "@/components/marketing/ProgramCard";
import { SectionHead } from "@/components/marketing/SectionHead";
import { programsByTrainer, trainerById } from "@/lib/data";
import { money } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const trainer = trainerById(id);

  return {
    title: `${trainer.name} — FitCoach`,
    description: `${trainer.headline}. ${trainer.sessionDurationMin}-minute sessions at ${money(trainer.sessionPriceCents)}.`,
  };
}

/**
 * A coach's public profile.
 *
 * The portrait leads because the coach is the product — the programmes come
 * after the person, not the other way round. The booking card sits on the
 * right because "what does a session cost" is the second thing anyone asks.
 */
export default async function TrainerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trainer = trainerById(id);
  const programs = programsByTrainer(trainer.id);

  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 pb-14 pt-12 sm:px-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] lg:gap-16 lg:pb-20 lg:pt-16">
          <Chamfer
            cut={44}
            accent
            className="aspect-[4/5] w-full overflow-hidden bg-surface-2"
          >
            <Image
              src={trainer.image}
              alt={`${trainer.name} training a client`}
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </Chamfer>

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-[clamp(2rem,4.4vw,3.25rem)] font-extrabold leading-[1] tracking-[-0.035em] text-ink stretch-wide">
                {trainer.name}
              </h1>
              {trainer.verified ? (
                <Badge tone="accent" icon={<Icon name="shield" size={13} />}>
                  Verified
                </Badge>
              ) : null}
            </div>

            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink-2">
              {trainer.headline}
            </p>

            <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-2">
              <li className="flex items-center gap-1.5">
                <Stars value={trainer.rating} size={14} />
                <span className="tnum">{trainer.rating.toFixed(1)}</span>
                <span className="text-ink-3">({trainer.reviewCount} reviews)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Icon name="map-pin" size={14} className="text-ink-3" />
                {trainer.location}
              </li>
              <li className="flex items-center gap-1.5">
                <Icon name="award" size={14} className="text-ink-3" />
                {trainer.yearsExperience} years coaching
              </li>
              <li className="flex items-center gap-1.5">
                <Icon name="users" size={14} className="text-ink-3" />
                {trainer.clientCount} clients
              </li>
            </ul>

            <ul className="mt-6 flex flex-wrap gap-2">
              {trainer.specialties.map((specialty) => (
                <li
                  key={specialty}
                  className="rounded-full border border-line px-3 py-1.5 text-[13px] text-ink-2"
                >
                  {specialty}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={`/book/${trainer.id}`} size="lg" icon="arrow-right">
                Book a session
              </ButtonLink>
              <ButtonLink href="/messages" variant="secondary" size="lg">
                Message {trainer.name.split(" ")[0]}
              </ButtonLink>
            </div>

            <p className="mt-6 flex items-center gap-2 text-[13px] text-ink-3">
              <Dot tone="accent" />
              Replies {trainer.responds.toLowerCase()}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1240px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.42fr)] lg:gap-16">
        <div>
          <h2 className="font-display text-[clamp(1.5rem,2.6vw,1.9rem)] font-extrabold tracking-[-0.03em] text-ink">
            About {trainer.name.split(" ")[0]}
          </h2>
          <p className="mt-4 max-w-2xl text-[16px] leading-[1.75] text-ink-2">
            {trainer.bio}
          </p>

          <h3 className="mt-10 font-display text-[15px] font-bold tracking-tight text-ink">
            Credentials
          </h3>
          <dl className="mt-4 border-t border-line">
            {trainer.credentials.map((credential) => (
              <div
                key={credential.label}
                className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-line py-3.5"
              >
                <dt className="w-28 shrink-0 text-[13px] text-ink-3">
                  {credential.label}
                </dt>
                <dd className="text-[15px] text-ink">{credential.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-panel border border-line bg-surface-1 p-6">
            <p className="text-[13px] font-medium text-ink-3">
              One-to-one session
            </p>
            <p className="tnum mt-2 font-display text-[2.25rem] font-extrabold leading-none tracking-[-0.03em] text-ink">
              {money(trainer.sessionPriceCents)}
            </p>
            <p className="mt-2 text-[13px] text-ink-2">
              {trainer.sessionDurationMin} minutes · video call · notes added to
              your programme
            </p>

            <ul className="mt-6 space-y-3 border-t border-line pt-5 text-[14px] text-ink-2">
              <li className="flex gap-3">
                <Icon name="calendar" size={17} className="mt-0.5 shrink-0 text-accent" />
                Slots from their published weekly hours
              </li>
              <li className="flex gap-3">
                <Icon name="video" size={17} className="mt-0.5 shrink-0 text-accent" />
                Runs in the browser — nothing to install
              </li>
              <li className="flex gap-3">
                <Icon name="message" size={17} className="mt-0.5 shrink-0 text-accent" />
                Messages stay open between sessions
              </li>
            </ul>

            <ButtonLink href={`/book/${trainer.id}`} className="mt-6 w-full">
              Book a session
            </ButtonLink>
            <p className="mt-3 text-center text-[12px] text-ink-3">
              You pay when you pick a slot. Nothing is charged to enquire.
            </p>
          </div>
        </aside>
      </section>

      {programs.length > 0 ? (
        <section className="border-t border-line bg-surface-1">
          <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:py-20">
            <SectionHead
              title={`Programmes by ${trainer.name.split(" ")[0]}`}
              body="Written from the work, not from a template. Buy the whole programme and the coach answers for the full run."
            />
            <div className="mt-12 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8">
        <div className="flex flex-col gap-6 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={trainer.name} src={trainer.avatar} size={48} ring />
            <div>
              <p className="font-display text-[16px] font-bold tracking-tight text-ink">
                Train with {trainer.name}
              </p>
              <p className="mt-0.5 text-[13px] text-ink-3">
                {trainer.programCount} programmes · {trainer.clientCount} clients
                coached
              </p>
            </div>
          </div>
          <ButtonLink href={`/book/${trainer.id}`} variant="secondary" icon="arrow-right">
            See available slots
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
