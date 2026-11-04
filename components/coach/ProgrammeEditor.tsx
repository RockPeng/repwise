"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Chamfer } from "@/components/ui/Chamfer";
import { Icon } from "@/components/ui/Icon";
import { Toggle } from "@/components/coach/Toggle";
import { currentTrainer, type Program } from "@/lib/data";

/**
 * The programme editor.
 *
 * One component serves both the create page and the edit page, because the
 * fields are the same fields — only the values and the module manager
 * differ. The preview in the right-hand column is live, because a coach
 * writing a programme is writing a listing and needs to see the listing.
 */

type Lesson = {
  id: string;
  title: string;
  duration: string;
  preview: boolean;
};

type ModuleDraft = {
  id: string;
  title: string;
  lessons: Lesson[];
};

type Form = {
  title: string;
  summary: string;
  description: string;
  price: string;
  difficulty: string;
  weeks: string;
  tags: string;
};

const inputClass =
  "w-full rounded-field border border-line bg-surface-1 px-3.5 py-2.5 text-[15px] leading-normal text-ink transition-colors focus:border-accent";

const difficulties = ["Beginner", "Intermediate", "Advanced", "All levels"];

/** The demo programme the create page starts from. */
const seed: Form = {
  title: "Stronger in 12",
  summary:
    "Twelve weeks of barbell strength, built around three lifts and the boring work in between.",
  description:
    "Most programmes are a list of exercises. This one is a progression you can finish and a set of numbers to beat. You will train three days a week, log every set, and get a written adjustment every Sunday from me.",
  price: "149.00",
  difficulty: "Intermediate",
  weeks: "12",
  tags: "Barbell, 3 days a week, Video lessons, Weekly adjustments",
};

const seedModules: ModuleDraft[] = [
  {
    id: "m-1",
    title: "Week 1 — Foundation",
    lessons: [
      { id: "l-1", title: "The assessment week", duration: "12", preview: true },
      { id: "l-2", title: "Setting your working weights", duration: "17", preview: false },
      { id: "l-3", title: "Grip, brace and the boring warm-up", duration: "10", preview: false },
      { id: "l-4", title: "Reading your log", duration: "14", preview: false },
    ],
  },
  {
    id: "m-2",
    title: "Weeks 2–4 — Push",
    lessons: [
      { id: "l-5", title: "Pressing mechanics", duration: "22", preview: false },
      { id: "l-6", title: "Overhead pressing", duration: "16", preview: false },
      { id: "l-7", title: "Tempo work", duration: "19", preview: false },
      { id: "l-8", title: "The push test", duration: "4", preview: false },
    ],
  },
];

export function ProgrammeEditor({
  mode,
  program,
  aside,
}: {
  mode: "create" | "edit";
  program?: Program;
  /** Right-hand column for the edit page. The preview is used when absent. */
  aside?: ReactNode;
}) {
  const ids = useId();

  const [form, setForm] = useState<Form>(() =>
    program
      ? {
          title: program.title,
          summary: program.summary,
          description: program.description,
          price: (program.priceCents / 100).toFixed(2),
          difficulty: program.difficulty,
          weeks: String(program.durationWeeks),
          tags: program.tags.join(", "),
        }
      : seed,
  );

  const [modules, setModules] = useState<ModuleDraft[]>(() =>
    program
      ? [
          ...program.modules.map((module) => ({
            id: module.id,
            title: module.title,
            lessons: module.lessons.map((lesson) => ({
              id: lesson.id,
              title: lesson.title,
              duration: String(Math.round(lesson.durationSec / 60)),
              preview: lesson.preview,
            })),
          })),
          { id: "module-empty", title: "", lessons: [] },
        ]
      : seedModules,
  );

  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const price = Number.parseFloat(form.price);
  const safePrice = Number.isFinite(price) ? price : 0;
  const share = (safePrice * 0.8).toFixed(2);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-8">
        {/* The details ------------------------------------------------- */}
        <section className="rounded-panel border border-line bg-surface-1 p-5 sm:p-6">
          <h2 className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
            Details
          </h2>

          <div className="mt-5 space-y-5">
            <Field label="Title" htmlFor={`${ids}-title`}>
              <input
                id={`${ids}-title`}
                className={inputClass}
                value={form.title}
                onChange={(event) => set("title", event.target.value)}
              />
            </Field>

            <Field label="Summary" htmlFor={`${ids}-summary`}>
              <textarea
                id={`${ids}-summary`}
                rows={2}
                className={`${inputClass} resize-y`}
                value={form.summary}
                onChange={(event) => set("summary", event.target.value)}
              />
            </Field>

            <Field
              label="Description"
              htmlFor={`${ids}-description`}
              hint="This is the long copy shown on the programme page."
            >
              <textarea
                id={`${ids}-description`}
                rows={6}
                className={`${inputClass} resize-y`}
                value={form.description}
                onChange={(event) => set("description", event.target.value)}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-3">
              <Field
                label="Price"
                htmlFor={`${ids}-price`}
                hint={`You keep 80% — $${share} reaches your account.`}
              >
                <span className="relative block">
                  <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[15px] text-ink-3">
                    $
                  </span>
                  <input
                    id={`${ids}-price`}
                    inputMode="decimal"
                    className={`${inputClass} pl-7 tnum`}
                    value={form.price}
                    onChange={(event) => set("price", event.target.value)}
                  />
                </span>
              </Field>

              <Field label="Difficulty" htmlFor={`${ids}-difficulty`}>
                <span className="relative block">
                  <select
                    id={`${ids}-difficulty`}
                    className={`${inputClass} appearance-none pr-10`}
                    value={form.difficulty}
                    onChange={(event) => set("difficulty", event.target.value)}
                  >
                    {difficulties.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  <Icon
                    name="chevron-down"
                    size={16}
                    className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-ink-3"
                  />
                </span>
              </Field>

              <Field label="Duration in weeks" htmlFor={`${ids}-weeks`}>
                <input
                  id={`${ids}-weeks`}
                  type="number"
                  min={1}
                  max={52}
                  className={`${inputClass} tnum`}
                  value={form.weeks}
                  onChange={(event) => set("weeks", event.target.value)}
                />
              </Field>
            </div>

            <Field
              label="Tags"
              htmlFor={`${ids}-tags`}
              hint="Separate tags with commas. Four tags is the most that reads well on a card."
            >
              <input
                id={`${ids}-tags`}
                className={inputClass}
                value={form.tags}
                onChange={(event) => set("tags", event.target.value)}
              />
            </Field>
          </div>
        </section>

        {/* The cover --------------------------------------------------- */}
        <section className="rounded-panel border border-line bg-surface-1 p-5 sm:p-6">
          <h2 className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
            Cover image
          </h2>

          <div className="mt-4 rounded-panel border border-dashed border-line bg-surface-2/40 px-5 py-8 text-center">
            <p className="text-[14px] font-medium text-ink">cover.jpg</p>
            <p className="mt-1 text-[13px] text-ink-3">
              Up to 100 MB. JPG or PNG, 1600 by 900 pixels.
            </p>
            <div className="mt-4">
              <Button variant="secondary" size="sm" icon="plus">
                Choose a file
              </Button>
            </div>
          </div>
        </section>

        {/* The modules ------------------------------------------------- */}
        {mode === "edit" ? (
          <ModuleManager modules={modules} setModules={setModules} />
        ) : (
          <ModuleBuilder modules={modules} setModules={setModules} />
        )}
      </div>

      {/* The right-hand column ---------------------------------------- */}
      <div className="min-w-0">
        {aside ?? (
          <Preview
            title={form.title}
            summary={form.summary}
            price={safePrice}
            weeks={form.weeks}
            cover={program?.cover}
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Fields                                                             */
/* ------------------------------------------------------------------ */

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-[13px] font-medium text-ink-2"
      >
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {hint ? <p className="mt-1.5 text-[12px] text-ink-3">{hint}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The modules builder, for a draft                                    */
/* ------------------------------------------------------------------ */

function ModuleBuilder({
  modules,
  setModules,
}: {
  modules: ModuleDraft[];
  setModules: Dispatch<SetStateAction<ModuleDraft[]>>;
}) {
  return (
    <section className="rounded-panel border border-line bg-surface-1 p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
          Modules and lessons
        </h2>
        <p className="text-[13px] text-ink-3">
          {modules.length} modules /{" "}
          {modules.reduce((total, module) => total + module.lessons.length, 0)}{" "}
          lessons
        </p>
      </div>

      <div className="mt-5 space-y-5">
        {modules.map((module, index) => (
          <div key={module.id} className="rounded-panel border border-line p-4">
            <div className="flex items-center gap-3">
              <span className="tnum text-[12px] text-ink-3">
                Module {index + 1}
              </span>
              <input
                aria-label={`Module ${index + 1} title`}
                className="min-w-0 flex-1 border-0 bg-transparent font-display text-[15px] font-bold tracking-[-0.01em] text-ink focus:outline-none"
                value={module.title}
                onChange={(event) =>
                  setModules((current) =>
                    current.map((item) =>
                      item.id === module.id
                        ? { ...item, title: event.target.value }
                        : item,
                    ),
                  )
                }
              />
            </div>

            <ul className="mt-3 space-y-2">
              {module.lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className="grid grid-cols-[minmax(0,1fr)_76px_32px] items-center gap-2"
                >
                  <input
                    aria-label="Lesson title"
                    className="min-w-0 rounded-field border border-line bg-surface-1 px-3 py-2 text-[14px] text-ink focus:border-accent"
                    value={lesson.title}
                    onChange={(event) =>
                      setModules((current) =>
                        current.map((item) =>
                          item.id === module.id
                            ? {
                                ...item,
                                lessons: item.lessons.map((entry) =>
                                  entry.id === lesson.id
                                    ? { ...entry, title: event.target.value }
                                    : entry,
                                ),
                              }
                            : item,
                        ),
                      )
                    }
                  />
                  <span className="relative block">
                    <input
                      aria-label="Lesson duration in minutes"
                      type="number"
                      min={1}
                      className="w-full rounded-field border border-line bg-surface-1 px-3 py-2 text-[14px] text-ink tnum focus:border-accent"
                      value={lesson.duration}
                      onChange={(event) =>
                        setModules((current) =>
                          current.map((item) =>
                            item.id === module.id
                              ? {
                                  ...item,
                                  lessons: item.lessons.map((entry) =>
                                    entry.id === lesson.id
                                      ? { ...entry, duration: event.target.value }
                                      : entry,
                                  ),
                                },
                              }
                            : item,
                          ),
                        )
                      }
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[12px] text-ink-3">
                      min
                    </span>
                  </span>
                  <IconButton
                    icon="x"
                    label={`Remove ${lesson.title}`}
                    onClick={() =>
                      setModules((current) =>
                        current.map((item) =>
                          item.id === module.id
                            ? {
                                ...item,
                                lessons: item.lessons.filter(
                                  (entry) => entry.id !== lesson.id,
                                ),
                              }
                            : item,
                        ),
                      )
                    }
                  />
                </li>
              ))}
            </ul>

            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                icon="plus"
                onClick={() =>
                  setModules((current) =>
                    current.map((item) =>
                      item.id === module.id
                        ? {
                            ...item,
                            lessons: [
                              ...item.lessons,
                              {
                                id: `${item.id}-${item.lessons.length + 1}`,
                                title: "New lesson",
                                duration: "10",
                                preview: false,
                              },
                            ],
                          }
                        : item,
                    ),
                  )
                }
              >
                Add lesson
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <Button
          variant="secondary"
          size="sm"
          icon="plus"
          onClick={() =>
            setModules((current) => [
              ...current,
              {
                id: `m-${current.length + 1}`,
                title: "New module",
                lessons: [],
              },
            ])
          }
        >
          Add module
        </Button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The module manager, for a programme that already exists            */
/* ------------------------------------------------------------------ */

function ModuleManager({
  modules,
  setModules,
}: {
  modules: ModuleDraft[];
  setModules: Dispatch<SetStateAction<ModuleDraft[]>>;
}) {
  return (
    <section className="rounded-panel border border-line bg-surface-1 p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
          Modules and lessons
        </h2>
        <p className="text-[13px] text-ink-3">Drag a lesson to reorder it</p>
      </div>

      <div className="mt-5 space-y-4">
        {modules.map((module, index) => (
          <div key={module.id} className="rounded-panel border border-line p-4">
            <div className="flex items-center gap-3">
              <span className="tnum text-[12px] text-ink-3">
                Module {index + 1}
              </span>
              <input
                aria-label={`Module ${index + 1} title`}
                placeholder="Module title"
                className="min-w-0 flex-1 border-0 bg-transparent font-display text-[15px] font-bold tracking-[-0.01em] text-ink placeholder:text-ink-3 focus:outline-none"
                value={module.title}
                onChange={(event) =>
                  setModules((current) =>
                    current.map((item) =>
                      item.id === module.id
                        ? { ...item, title: event.target.value }
                        : item,
                    ),
                  )
                }
              />
            </div>

            {module.lessons.length > 0 ? (
              <ul className="mt-3 divide-y divide-line border-t border-line">
                {module.lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    className="flex items-center gap-3 py-2.5"
                  >
                    <span aria-hidden="true" className="shrink-0 text-ink-3">
                      <DragHandle />
                    </span>

                    <span className="min-w-0 flex-1 truncate text-[14px] text-ink">
                      {lesson.title}
                    </span>

                    <span className="tnum shrink-0 text-[13px] text-ink-3">
                      {lesson.duration} min
                    </span>

                    <span className="hidden shrink-0 items-center gap-2 sm:flex">
                      <span className="text-[12px] text-ink-3">Preview</span>
                      <Toggle
                        checked={lesson.preview}
                        label={`${lesson.title} is a preview lesson`}
                        onChange={(next) =>
                          setModules((current) =>
                            current.map((item) =>
                              item.id === module.id
                                ? {
                                    ...item,
                                    lessons: item.lessons.map((entry) =>
                                      entry.id === lesson.id
                                        ? { ...entry, preview: next }
                                        : entry,
                                    ),
                                  }
                                : item,
                            ),
                          )
                        }
                      />
                    </span>

                    <IconButton
                      icon="edit"
                      label={`Edit ${lesson.title}`}
                      onClick={() => undefined}
                    />
                    <IconButton
                      icon="x"
                      label={`Delete ${lesson.title}`}
                      onClick={() =>
                        setModules((current) =>
                          current.map((item) =>
                            item.id === module.id
                              ? {
                                  ...item,
                                  lessons: item.lessons.filter(
                                    (entry) => entry.id !== lesson.id,
                                  ),
                                }
                              : item,
                          ),
                        )
                      }
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3 rounded-field border border-dashed border-line px-4 py-6 text-center">
                <p className="text-[13px] text-ink-3">
                  This module has no lessons yet.
                </p>
                <div className="mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="plus"
                    onClick={() =>
                      setModules((current) =>
                        current.map((item) =>
                          item.id === module.id
                            ? {
                                ...item,
                                lessons: [
                                  {
                                    id: `${item.id}-1`,
                                    title: "New lesson",
                                    duration: "10",
                                    preview: false,
                                  },
                                ],
                              }
                            : item,
                        ),
                      )
                    }
                  >
                    Add lesson
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5">
        <Button
          variant="secondary"
          size="sm"
          icon="plus"
          onClick={() =>
            setModules((current) => [
              ...current,
              { id: `m-${current.length + 1}`, title: "New module", lessons: [] },
            ])
          }
        >
          Add module
        </Button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The live preview                                                    */
/* ------------------------------------------------------------------ */

function Preview({
  title,
  summary,
  price,
  weeks,
  cover,
}: {
  title: string;
  summary: string;
  price: number;
  weeks: string;
  cover?: string;
}) {
  return (
    <div className="lg:sticky lg:top-8">
      <p className="text-[13px] font-medium text-ink-3">Preview</p>

      <article className="mt-3 rounded-panel border border-line bg-surface-1 p-4">
        {cover ? (
          <Chamfer
            cut={20}
            accent
            className="aspect-[16/9] w-full overflow-hidden bg-surface-2"
          >
            <Image
              src={cover}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 288px"
              className="object-cover"
            />
          </Chamfer>
        ) : (
          <Chamfer
            cut={20}
            accent
            className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 bg-surface-2"
          >
            <Icon name="layers" size={22} className="text-ink-3" />
            <span className="text-[12px] text-ink-3">Cover image</span>
          </Chamfer>
        )}

        <h3 className="mt-4 font-display text-[19px] font-bold tracking-[-0.02em] text-ink">
          {title || "Untitled programme"}
        </h3>

        <div className="mt-2.5 flex items-center gap-2">
          <Avatar name={currentTrainer.name} src={currentTrainer.avatar} size={24} />
          <span className="text-[13px] text-ink-2">{currentTrainer.name}</span>
        </div>

        <p className="mt-3 line-clamp-2 text-[14px] leading-relaxed text-ink-2">
          {summary}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
          <span className="tnum text-[13px] text-ink-3">{weeks} weeks</span>
          <span className="tnum font-display text-[17px] font-bold tracking-tight text-ink">
            ${price.toFixed(2)}
          </span>
        </div>
      </article>

      <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
        This is how the programme appears in the marketplace.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small parts                                                         */
/* ------------------------------------------------------------------ */

function IconButton({
  icon,
  label,
  onClick,
}: {
  icon: "x" | "edit";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line text-ink-3 transition-colors hover:border-line-2 hover:text-ink"
    >
      <Icon name={icon} size={15} />
    </button>
  );
}

/** Six dots in two columns. The grip on a draggable row. */
function DragHandle() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
      <circle cx="2" cy="2" r="1.3" />
      <circle cx="8" cy="2" r="1.3" />
      <circle cx="2" cy="8" r="1.3" />
      <circle cx="8" cy="8" r="1.3" />
      <circle cx="2" cy="14" r="1.3" />
      <circle cx="8" cy="14" r="1.3" />
    </svg>
  );
}
