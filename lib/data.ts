/**
 * The demo dataset.
 *
 * Everything the UI renders comes from this module. There is no database and
 * no API behind it — the shapes mirror the schema in `plan.md` (money in
 * cents, dates as pre-formatted strings) so that swapping in a real query
 * layer later is a change of import, not a change of shape.
 *
 * Dates are pre-formatted strings rather than `Date` objects on purpose: a
 * server render and a client hydration must produce byte-identical text, and
 * formatting a `Date` in two different timezones is the classic way to break
 * that.
 */

export type Trainer = {
  id: string;
  name: string;
  headline: string;
  bio: string;
  specialties: string[];
  location: string;
  yearsExperience: number;
  sessionPriceCents: number;
  sessionDurationMin: number;
  rating: number;
  reviewCount: number;
  clientCount: number;
  /** Response time, as a coach would put it. */
  responds: string;
  /** Programme count on the marketplace. */
  programCount: number;
  image: string;
  avatar: string;
  /** The coach's own accent — a single hue per coach, used only on their card. */
  hue: string;
  verified: boolean;
  /** Awards and credentials, shown as a definition list. */
  credentials: { label: string; value: string }[];
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  durationSec: number;
  /** A preview lesson can be watched before buying. */
  preview: boolean;
  image: string;
};

export type ProgramModule = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type Program = {
  id: string;
  title: string;
  summary: string;
  description: string;
  trainerId: string;
  cover: string;
  priceCents: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "All levels";
  durationWeeks: number;
  modules: ProgramModule[];
  tags: string[];
  studentCount: number;
  rating: number;
  reviewCount: number;
};

export type Client = {
  id: string;
  name: string;
  avatar: string;
  programTitle: string;
  programId: string;
  /** 0–100. */
  progress: number;
  sessionsCompleted: number;
  joined: string;
  lastActive: string;
  status: "active" | "paused" | "finished";
  nextSession?: string;
  lifetimeValueCents: number;
};

export type Booking = {
  id: string;
  clientName: string;
  clientAvatar: string;
  /** Pre-formatted date and time. */
  when: string;
  day: string;
  time: string;
  durationMin: number;
  priceCents: number;
  status: "confirmed" | "pending_payment" | "completed" | "cancelled";
  kind: "session" | "program";
  programTitle?: string;
};

export type AvailabilityRule = {
  id: string;
  weekday: string;
  start: string;
  end: string;
  durationMin: number;
  active: boolean;
};

export type Slot = {
  id: string;
  day: string;
  date: string;
  time: string;
  status: "open" | "booked" | "blocked";
  clientName?: string;
};

export type EarningEntry = {
  id: string;
  date: string;
  source: "Programme sale" | "1:1 session";
  counterparty: string;
  detail: string;
  grossCents: number;
  feeCents: number;
  netCents: number;
  status: "paid" | "pending" | "refunded";
};

export type Payout = {
  id: string;
  date: string;
  amountCents: number;
  status: "paid" | "in_transit" | "failed";
  destination: string;
};

export type Conversation = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
  online: boolean;
  programTitle?: string;
};

export type Message = {
  id: string;
  author: "me" | "them";
  text: string;
  time: string;
  /** A message can carry a shared workout, a slot or a video call. */
  attachment?: {
    kind: "program" | "slot" | "video";
    title: string;
    detail: string;
  };
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  kind: "sale" | "booking" | "message" | "lesson";
};

export type Enrollment = {
  id: string;
  programId: string;
  progress: number;
  lessonsDone: number;
  lessonsTotal: number;
  lastLesson: string;
  lastLessonId: string;
  purchased: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  detail: string;
  avatar: string;
  result: string;
};

/* ------------------------------------------------------------------ */
/* Trainers                                                            */
/* ------------------------------------------------------------------ */

export const trainers: Trainer[] = [
  {
    id: "maya-okafor",
    name: "Maya Okafor",
    headline: "Strength coach for people who got strong on their own and want a plan",
    bio: "I spent nine years as a strength-and-conditioning coach in Lagos and Manchester, mostly working with people who had been training alone for years and were stuck. My programmes start with an honest look at what you can actually do this week — not what you did in 2019 — and build from there. You will get a plan you can print, a coach who answers within a day, and a session every fortnight where we look at the numbers together.",
    specialties: ["Strength", "Return to training", "Women in strength"],
    location: "Lagos, NG",
    yearsExperience: 9,
    sessionPriceCents: 9500,
    sessionDurationMin: 50,
    rating: 4.9,
    reviewCount: 128,
    clientCount: 86,
    responds: "Within a day",
    programCount: 2,
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
    hue: "158°",
    verified: true,
    credentials: [
      { label: "Certified", value: "NSCA–CSCS, UKSCA" },
      { label: "Specialism", value: "Barbell strength, return to training" },
      { label: "Groups", value: "Women's strength, post-injury return" },
    ],
  },
  {
    id: "diego-ramirez",
    name: "Diego Ramirez",
    headline: "Powerlifter who teaches the boring lifts properly",
    bio: "Competitive powerlifter for a decade, now full-time coaching. I coach people who want to compete and people who just want a big number — the difference is that both need the technique to be right before the load goes up. Every session is recorded and you get the notes afterwards.",
    specialties: ["Powerlifting", "Fat loss", "Nutrition"],
    location: "Austin, US",
    yearsExperience: 12,
    sessionPriceCents: 12000,
    sessionDurationMin: 60,
    rating: 4.8,
    reviewCount: 94,
    clientCount: 61,
    responds: "Within a few hours",
    programCount: 2,
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=80",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    hue: "28°",
    verified: true,
    credentials: [
      { label: "Certified", value: "USAPL Level 3" },
      { label: "Specialism", value: "Squat, bench, competition prep" },
      { label: "Groups", value: "Meet prep, masters lifters" },
    ],
  },
  {
    id: "hanna-lindqvist",
    name: "Hanna Lindqvist",
    headline: "Pre and postnatal strength, pelvic health, no small talk",
    bio: "I work almost entirely with people who are training through pregnancy, recovering after birth, or returning to lifting after years away. The sessions are clinical in the way you want and human in the way you need. I trained as a physiotherapist before I coached, and I will tell you when something needs a doctor, not a coach.",
    specialties: ["Pre & postnatal", "Mobility", "Pelvic health"],
    location: "Stockholm, SE",
    yearsExperience: 7,
    sessionPriceCents: 8500,
    sessionDurationMin: 45,
    rating: 5.0,
    reviewCount: 76,
    clientCount: 52,
    responds: "Same day",
    programCount: 2,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    hue: "330°",
    verified: true,
    credentials: [
      { label: "Certified", value: "Physiotherapist, RKF" },
      { label: "Specialism", value: "Pelvic floor, prenatal strength" },
      { label: "Groups", value: "Postpartum return to lifting" },
    ],
  },
  {
    id: "kenji-sato",
    name: "Kenji Sato",
    headline: "Hypertrophy and food, in that order of honesty",
    bio: "Most people are not eating enough to grow. I spend the first three weeks of every programme fixing that before I touch a single set, because a plan that ignores food is a plan that stalls at week four. After that we build muscle in the two-to-three rep range that actually works, and I check your log every week.",
    specialties: ["Hypertrophy", "Nutrition", "Body recomposition"],
    location: "Osaka, JP",
    yearsExperience: 11,
    sessionPriceCents: 11000,
    sessionDurationMin: 50,
    rating: 4.9,
    reviewCount: 142,
    clientCount: 104,
    responds: "Within a day",
    programCount: 1,
    image:
      "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=1200&q=80",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    hue: "200°",
    verified: true,
    credentials: [
      { label: "Certified", value: "NASM-CPT, ISSN Sports Nutrition" },
      { label: "Specialism", value: "Hypertrophy, recomposition" },
      { label: "Groups", value: "Plant-based lifters, underweight" },
    ],
  },
  {
    id: "priya-raman",
    name: "Priya Raman",
    headline: "Move better first. Everything else follows.",
    bio: "Six years of yoga and mobility teaching, and a strong opinion that most people are training around a problem instead of fixing it. My short programmes are mostly assessment, then the six or eight movements that will change how you feel. People come to me when lifting hurts and they keep training anyway.",
    specialties: ["Mobility", "Yoga", "Breathwork"],
    location: "Bengaluru, IN",
    yearsExperience: 8,
    sessionPriceCents: 7500,
    sessionDurationMin: 45,
    rating: 4.9,
    reviewCount: 63,
    clientCount: 44,
    responds: "Within a day",
    programCount: 1,
    image:
      "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=1200&q=80",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    hue: "265°",
    verified: true,
    credentials: [
      { label: "Certified", value: "RYT-500, FRCms" },
      { label: "Specialism", value: "Mobility, breathing, pain-free lifting" },
      { label: "Groups", value: "Desk workers, older lifters" },
    ],
  },
  {
    id: "tom-weaver",
    name: "Tom Weaver",
    headline: "Endurance for people who also have a job",
    bio: "Fourteen years of coaching runners and triathletes, most of whom work full time and train in the dark. I coach the plan around the alarm clock, not the other way round. If you have never run a 10K without stopping, we will start there and it will go faster than you expect.",
    specialties: ["Endurance", "Running", "Home strength"],
    location: "Brighton, UK",
    yearsExperience: 14,
    sessionPriceCents: 9000,
    sessionDurationMin: 45,
    rating: 4.7,
    reviewCount: 51,
    clientCount: 39,
    responds: "Within a day",
    programCount: 2,
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    hue: "48°",
    verified: true,
    credentials: [
      { label: "Certified", value: "UESCA Run Coach, B.A. Exercise Science" },
      { label: "Specialism", value: "10K and half marathon, triathlon" },
      { label: "Groups", value: "Beginner runners, shift workers" },
    ],
  },
];

export const trainerById = (id: string): Trainer =>
  trainers.find((t) => t.id === id) ?? trainers[0];

/* ------------------------------------------------------------------ */
/* Programmes                                                           */
/* ------------------------------------------------------------------ */

export const programs: Program[] = [
  {
    id: "stronger-in-12",
    title: "Stronger in 12",
    summary:
      "Twelve weeks of barbell strength, built around three lifts and the boring work in between.",
    description:
      "Most programmes are a list of exercises. This one is a progression you can finish and a set of numbers to beat. You will train three days a week, log every set, and get a written adjustment every Sunday from me. The programme starts with an assessment week so the loads are yours, not a stranger's. By week twelve most people add 15 to 25 kilos to their squat and, more usefully, stop dreading the gym.",
    trainerId: "maya-okafor",
    cover:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80",
    priceCents: 14900,
    difficulty: "Intermediate",
    durationWeeks: 12,
    tags: ["Barbell", "3 days a week", "Video lessons", "Weekly adjustments"],
    studentCount: 1240,
    rating: 4.9,
    reviewCount: 218,
    modules: [
      {
        id: "s12-foundation",
        title: "Week 1 — Foundation",
        lessons: [
          {
            id: "s12-l1",
            title: "The assessment week",
            description:
              "Five movements, two attempts each, video from the side. This sets every load in the programme.",
            durationSec: 742,
            preview: true,
            image:
              "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "s12-l2",
            title: "Setting your working weights",
            description:
              "How I turn an assessment into a starting load that is hard but repeatable.",
            durationSec: 1043,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "s12-l3",
            title: "Grip, brace and the boring warm-up",
            description:
              "Six minutes that decide whether your first working set is honest.",
            durationSec: 618,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "s12-l4",
            title: "Reading your log",
            description:
              "What a good set, a borderline set and a bad set look like on paper.",
            durationSec: 856,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      {
        id: "s12-push",
        title: "Weeks 2–4 — Push",
        lessons: [
          {
            id: "s12-l5",
            title: "Pressing mechanics",
            description: "Where the bar goes, where the elbows go, why your chest stalls.",
            durationSec: 1310,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "s12-l6",
            title: "Overhead pressing",
            description:
              "The press is a moving target. Here is how I find yours on day one.",
            durationSec: 976,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "s12-l7",
            title: "Tempo work",
            description: "Three seconds down. It is the cheapest strength you will ever buy.",
            durationSec: 1122,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "s12-l8",
            title: "The push test",
            description: "A two-minute benchmark at the end of week four.",
            durationSec: 264,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      {
        id: "s12-pull",
        title: "Weeks 5–7 — Pull",
        lessons: [
          {
            id: "s12-l9",
            title: "Row mechanics",
            description: "Five rows, one principle: pull the elbows, not the hands.",
            durationSec: 1204,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "s12-l10",
            title: "Pull-ups, or the pulldown if you must",
            description: "Progressions for a grip that is not there yet.",
            durationSec: 1088,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "s12-l11",
            title: "Rows and tempo together",
            description: "Slower pulls, more rows, better back.",
            durationSec: 934,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "s12-l12",
            title: "The pull test",
            description: "Bench your row against where you started in week one.",
            durationSec: 248,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      {
        id: "s12-legs",
        title: "Weeks 8–10 — Legs and core",
        lessons: [
          {
            id: "s12-l13",
            title: "Squat mechanics",
            description: "Depth, stance, bracing. Three decisions, one lift.",
            durationSec: 1402,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "s12-l14",
            title: "The hinge",
            description: "Deadlifts without a spine that hates you.",
            durationSec: 1156,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "s12-l15",
            title: "Carries and core",
            description: "The unglamorous work that keeps you lifting.",
            durationSec: 812,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "s12-l16",
            title: "Conditioning, the short version",
            description: "Twenty minutes, twice a week, and nothing more.",
            durationSec: 690,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      {
        id: "s12-repeat",
        title: "Weeks 11–12 — Repeat and move on",
        lessons: [
          {
            id: "s12-l17",
            title: "Deloading and why it makes you stronger",
            description: "A week off the load is a week the adaptation lands.",
            durationSec: 588,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "s12-l18",
            title: "Where to go next",
            description:
              "Three routes out of this programme, and how to pick the one that suits you.",
            durationSec: 1022,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
    ],
  },
  {
    id: "the-big-three",
    title: "The Big Three",
    summary:
      "Ten weeks of competition-grade technique for the squat, bench and deadlift.",
    description:
      "A meet-prep programme for serious lifters and an unusually good one for people who are not yet serious. Ten weeks, four sessions a week, and a deload in week nine that will make or break the whole block. I review your videos every week and you will never wonder what to change.",
    trainerId: "diego-ramirez",
    cover:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1400&q=80",
    priceCents: 12900,
    difficulty: "Advanced",
    durationWeeks: 10,
    tags: ["Powerlifting", "4 days a week", "Video review", "Meet prep"],
    studentCount: 640,
    rating: 4.8,
    reviewCount: 91,
    modules: [
      {
        id: "bt3-a",
        title: "Weeks 1–3 — Volume",
        lessons: [
          {
            id: "bt3-l1",
            title: "Meet rules and your weight class",
            description: "Choosing a class, and why it decides everything else.",
            durationSec: 902,
            preview: true,
            image:
              "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "bt3-l2",
            title: "Squat: bracing and descent",
            description: "Start every rep the same way or you will not finish it.",
            durationSec: 1266,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "bt3-l3",
            title: "Bench: the pause and the press",
            description: "Your strongest lift is decided at the chest.",
            durationSec: 1148,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      {
        id: "bt3-b",
        title: "Weeks 4–7 — Strength",
        lessons: [
          {
            id: "bt3-l4",
            title: "Deadlift: off the floor",
            description: "The hardest six inches in the sport.",
            durationSec: 1342,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "bt3-l5",
            title: "Accessory work that earns its place",
            description: "Four accessories, four reasons.",
            durationSec: 768,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "bt3-l6",
            title: "Fatigue management and the fourth day",
            description: "When to train tired and when to sleep instead.",
            durationSec: 1024,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      {
        id: "bt3-c",
        title: "Weeks 8–10 — Peaking",
        lessons: [
          {
            id: "bt3-l7",
            title: "Openers, second and third attempts",
            description: "Choosing numbers that leave you something to do.",
            durationSec: 1086,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "bt3-l8",
            title: "Meet day",
            description: "Warm-ups, timing, and what to eat.",
            durationSec: 942,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
    ],
  },
  {
    id: "lose-it-keep-it",
    title: "Lose It, Keep It",
    summary:
      "Eight weeks of food habits and training that do not need a kitchen scale.",
    description:
      "A fat-loss programme for people who have done the aggressive thing and lost the muscle too. No meal plan you will hate, no 6am cardio. Three sessions a week, a plate rule, and a weekly weigh-in that means something.",
    trainerId: "diego-ramirez",
    cover:
      "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1400&q=80",
    priceCents: 9900,
    difficulty: "Beginner",
    durationWeeks: 8,
    tags: ["Fat loss", "3 days a week", "No equipment", "Nutrition"],
    studentCount: 1870,
    rating: 4.7,
    reviewCount: 302,
    modules: [
      {
        id: "lik-a",
        title: "Weeks 1–2 — Habits",
        lessons: [
          {
            id: "lik-l1",
            title: "The plate rule",
            description: "How to build a meal without weighing anything.",
            durationSec: 634,
            preview: true,
            image:
              "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "lik-l2",
            title: "Protein, and how much you actually need",
            description: "The number, and how to hit it when you do not want to eat chicken.",
            durationSec: 812,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      {
        id: "lik-b",
        title: "Weeks 3–6 — Training",
        lessons: [
          {
            id: "lik-l3",
            title: "Three full-body sessions",
            description: "The whole programme on one page.",
            durationSec: 1156,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "lik-l4",
            title: "Walking, properly",
            description: "Why 8,000 steps beats an hour on a bike.",
            durationSec: 548,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "lik-l5",
            title: "Weighing in without obsessing",
            description: "The weekly average, not the daily number.",
            durationSec: 702,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      {
        id: "lik-c",
        title: "Weeks 7–8 — Keeping it",
        lessons: [
          {
            id: "lik-l6",
            title: "Reverse dieting without the drama",
            description: "How to add food back without adding it all back.",
            durationSec: 884,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
    ],
  },
  {
    id: "postpartum-strong",
    title: "Postpartum Strong",
    summary:
      "A gentle, progressive return to lifting after birth — with a pelvic health physiotherapist on the plan.",
    description:
      "Twelve weeks designed with a pelvic health physiotherapist, for anyone training through or after pregnancy. The first three weeks are breathing and core reconnection; from there the loads climb. Nothing in this programme will ask you to leak, or to jump back into what you used to do.",
    trainerId: "hanna-lindqvist",
    cover:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80",
    priceCents: 13900,
    difficulty: "Beginner",
    durationWeeks: 12,
    tags: ["Pre & postnatal", "Pelvic health", "2 days a week", "Physio reviewed"],
    studentCount: 410,
    rating: 5.0,
    reviewCount: 58,
    modules: [
      {
        id: "pp-a",
        title: "Weeks 1–3 — Breath and core",
        lessons: [
          {
            id: "pp-l1",
            title: "What actually changed",
            description: "The anatomy, in plain language, and what it means for lifting.",
            durationSec: 1024,
            preview: true,
            image:
              "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "pp-l2",
            title: "Breathing and pressure",
            description: "The exhale pattern that makes everything after it safer.",
            durationSec: 866,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "pp-l3",
            title: "Your first loaded session",
            description: "Genuinely light, genuinely worthwhile.",
            durationSec: 712,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      {
        id: "pp-b",
        title: "Weeks 4–8 — Building",
        lessons: [
          {
            id: "pp-l4",
            title: "Squatting after birth",
            description: "Depth, stance and the return to a full range.",
            durationSec: 1188,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "pp-l5",
            title: "Carrying your baby and your groceries",
            description: "Loading the core in real life.",
            durationSec: 644,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      {
        id: "pp-c",
        title: "Weeks 9–12 — Strong",
        lessons: [
          {
            id: "pp-l6",
            title: "Progressing to real loads",
            description: "The last third is where it starts to feel like training again.",
            durationSec: 1094,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
    ],
  },
  {
    id: "move-without-pain",
    title: "Move Without Pain",
    summary:
      "Six weeks of mobility for people whose shoulders, hips or back have started making decisions for them.",
    description:
      "Short, twice-weekly sessions built around assessment. You will find out which direction you are actually restricted, and then fix that specific thing. People usually notice the difference in the first fortnight and keep going because the sessions are short.",
    trainerId: "hanna-lindqvist",
    cover:
      "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=1400&q=80",
    priceCents: 7900,
    difficulty: "All levels",
    durationWeeks: 6,
    tags: ["Mobility", "2 days a week", "15 minutes", "Assessment"],
    studentCount: 720,
    rating: 4.9,
    reviewCount: 84,
    modules: [
      {
        id: "mwp-a",
        title: "Weeks 1–3 — Find the restriction",
        lessons: [
          {
            id: "mwp-l1",
            title: "Where are you actually stuck?",
            description: "A twenty-minute screen of hips, shoulders and thoracic spine.",
            durationSec: 812,
            preview: true,
            image:
              "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "mwp-l2",
            title: "Hips that move again",
            description: "The four positions that unlock most people.",
            durationSec: 704,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "mwp-l3",
            title: "Shoulders that overhead",
            description: "Why pressing hurts, and what to do about it.",
            durationSec: 892,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      {
        id: "mwp-b",
        title: "Weeks 4–6 — Keep it",
        lessons: [
          {
            id: "mwp-l4",
            title: "The fifteen-minute routine",
            description: "Everything from the first three weeks, condensed.",
            durationSec: 916,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
    ],
  },
  {
    id: "mobility-reset",
    title: "Mobility Reset",
    summary:
      "Four weeks of daily fifteen-minute mobility, for the parts of you that sit at a desk.",
    description:
      "A daily fifteen-minute routine that takes care of the hips, thoracic spine and shoulders that eight hours of sitting quietly ruin. No equipment, no gym, and short enough that you will actually do it on a bad week.",
    trainerId: "priya-raman",
    cover:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1400&q=80",
    priceCents: 5900,
    difficulty: "All levels",
    durationWeeks: 4,
    tags: ["Mobility", "15 minutes a day", "No equipment", "Yoga"],
    studentCount: 2310,
    rating: 4.9,
    reviewCount: 412,
    modules: [
      {
        id: "mr-a",
        title: "The daily fifteen",
        lessons: [
          {
            id: "mr-l1",
            title: "Hips",
            description: "Eight minutes of the routine.",
            durationSec: 502,
            preview: true,
            image:
              "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "mr-l2",
            title: "Thoracic spine and shoulders",
            description: "Seven more minutes.",
            durationSec: 448,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "mr-l3",
            title: "Breathing and the nervous system",
            description: "The part that makes the rest stick.",
            durationSec: 634,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
    ],
  },
  {
    id: "hypertrophy-split",
    title: "Hypertrophy Split",
    summary:
      "Sixteen weeks of four-day muscle building, with the food maths worked out first.",
    description:
      "Sixteen weeks, four sessions a week, and a nutrition block that comes before the training block because that is the order that works. Loads climb in waves and the programme assumes you will eat more than you think you need to.",
    trainerId: "kenji-sato",
    cover:
      "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=1400&q=80",
    priceCents: 15900,
    difficulty: "Intermediate",
    durationWeeks: 16,
    tags: ["Hypertrophy", "4 days a week", "Nutrition", "Weekly check-in"],
    studentCount: 980,
    rating: 4.9,
    reviewCount: 176,
    modules: [
      {
        id: "hs-a",
        title: "Weeks 1–4 — Food and foundations",
        lessons: [
          {
            id: "hs-l1",
            title: "The calorie target",
            description: "How to work out where to start, and how to check.",
            durationSec: 986,
            preview: true,
            image:
              "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "hs-l2",
            title: "Protein, and the boring middle of the day",
            description: "Making the numbers work when you work shifts.",
            durationSec: 844,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "hs-l3",
            title: "Your first four weeks of training",
            description: "Volume, frequency and the split.",
            durationSec: 1204,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      {
        id: "hs-b",
        title: "Weeks 5–12 — Accumulation",
        lessons: [
          {
            id: "hs-l4",
            title: "Progressing the loads",
            description: "When to add weight, when to add sets, when to do neither.",
            durationSec: 1042,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "hs-l5",
            title: "Deload weeks and why they are not optional",
            description: "Week eight, and what it buys you.",
            durationSec: 726,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      {
        id: "hs-c",
        title: "Weeks 13–16 — Intensification",
        lessons: [
          {
            id: "hs-l6",
            title: "Moving into the harder range",
            description: "Heavier, fewer, better.",
            durationSec: 1142,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "hs-l7",
            title: "What you built and what to do next",
            description: "A maintenance plan for the two months after.",
            durationSec: 668,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
    ],
  },
  {
    id: "run-your-first-10k",
    title: "Run Your First 10K",
    summary:
      "Eight weeks from walking a kilometre to running ten, without a running injury.",
    description:
      "Eight weeks built on run-walk, which is how almost everyone should start. You will run for thirty minutes by week three and finish the ten kilometres by week eight. The plan assumes a full-time job and a pair of trainers that have been resoled.",
    trainerId: "tom-weaver",
    cover:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=80",
    priceCents: 8900,
    difficulty: "Beginner",
    durationWeeks: 8,
    tags: ["Running", "3 runs a week", "Run-walk", "No kit needed"],
    studentCount: 1520,
    rating: 4.7,
    reviewCount: 165,
    modules: [
      {
        id: "rf10k-a",
        title: "Weeks 1–3 — Running again",
        lessons: [
          {
            id: "rf10k-l1",
            title: "Why run-walk",
            description: "The unglamorous method that keeps people injury-free.",
            durationSec: 604,
            preview: true,
            image:
              "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "rf10k-l2",
            title: "Shoes, and the only kit that matters",
            description: "How to buy running shoes without being sold to.",
            durationSec: 748,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "rf10k-l3",
            title: "Your first thirty minutes",
            description: "Week three, and what it feels like.",
            durationSec: 512,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      {
        id: "rf10k-b",
        title: "Weeks 4–8 — The distance",
        lessons: [
          {
            id: "rf10k-l4",
            title: "Building to five kilometres",
            description: "Week five.",
            durationSec: 664,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "rf10k-l5",
            title: "The long run",
            description: "One session a week does most of the work.",
            durationSec: 722,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "rf10k-l6",
            title: "Race day",
            description: "Pacing, what to wear, and what to eat.",
            durationSec: 588,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
    ],
  },
  {
    id: "return-to-training",
    title: "Return to Training",
    summary:
      "Six weeks for people coming back after a long gap — or after an injury, a baby, or a decade of excuses.",
    description:
      "The programme I wrote for people who used to train and stopped. Six weeks, two sessions a week, and a first week that is almost entirely assessment. We find out what still works, rebuild the basics, and finish with a plan you would actually keep doing once the twelve weeks are up.",
    trainerId: "maya-okafor",
    cover:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80",
    priceCents: 8900,
    difficulty: "Beginner",
    durationWeeks: 6,
    tags: ["Return to training", "2 days a week", "Assessment first", "Video lessons"],
    studentCount: 690,
    rating: 4.8,
    reviewCount: 96,
    modules: [
      {
        id: "rtt-a",
        title: "Weeks 1–3 — What still works",
        lessons: [
          {
            id: "rtt-l1",
            title: "The honest assessment",
            description:
              "Twelve movements, and the version of you that shows up on the day.",
            durationSec: 884,
            preview: true,
            image:
              "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "rtt-l2",
            title: "Rebuilding the pattern",
            description: "Two sessions a week, and what happens in each one.",
            durationSec: 706,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "rtt-l3",
            title: "Soreness, and what it means",
            description: "How to tell the good kind from the kind that stops you.",
            durationSec: 542,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      {
        id: "rtt-b",
        title: "Weeks 4–6 — Back in it",
        lessons: [
          {
            id: "rtt-l4",
            title: "Adding load",
            description: "The progression, week by week, with the numbers.",
            durationSec: 962,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "rtt-l5",
            title: "The plan after the six weeks",
            description: "How to keep going once the programme ends.",
            durationSec: 618,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
    ],
  },
  {
    id: "strong-at-home",
    title: "Strong at Home",
    summary:
      "Six weeks of full-body strength with a backpack and a bottle of water.",
    description:
      "Six weeks, three sessions a week, and nothing to buy. A backpack full of books is a perfectly good barbell. The exercises are the ones you can do in a hotel room, which is where you will actually be training.",
    trainerId: "tom-weaver",
    cover:
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1400&q=80",
    priceCents: 6900,
    difficulty: "Beginner",
    durationWeeks: 6,
    tags: ["Home strength", "3 days a week", "No equipment", "Bodyweight"],
    studentCount: 2040,
    rating: 4.6,
    reviewCount: 288,
    modules: [
      {
        id: "sah-a",
        title: "The six weeks",
        lessons: [
          {
            id: "sah-l1",
            title: "Your home gym",
            description: "What a backpack, a bottle and a table can do.",
            durationSec: 528,
            preview: true,
            image:
              "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "sah-l2",
            title: "Push, pull, carry",
            description: "The three patterns every session uses.",
            durationSec: 812,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "sah-l3",
            title: "Progressing without weights",
            description: "Tempo, range and volume do the work.",
            durationSec: 676,
            preview: false,
            image:
              "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
    ],
  },
];

export const programById = (id: string): Program =>
  programs.find((p) => p.id === id) ?? programs[0];

export const programsByTrainer = (trainerId: string): Program[] =>
  programs.filter((p) => p.trainerId === trainerId);

/* ------------------------------------------------------------------ */
/* The signed-in member                                                */
/* ------------------------------------------------------------------ */

export const member = {
  name: "Alex Moreau",
  firstName: "Alex",
  email: "alex.moreau@example.com",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  joined: "March 2026",
  streakWeeks: 6,
  sessionsThisMonth: 3,
};

export const enrollments: Enrollment[] = [
  {
    id: "en-1",
    programId: "stronger-in-12",
    progress: 68,
    lessonsDone: 13,
    lessonsTotal: 18,
    lastLesson: "Hinge — deadlifts without a spine that hates you",
    lastLessonId: "s12-l14",
    purchased: "14 Aug 2026",
  },
  {
    id: "en-2",
    programId: "move-without-pain",
    progress: 25,
    lessonsDone: 1,
    lessonsTotal: 4,
    lastLesson: "Hips that move again",
    lastLessonId: "mwp-l2",
    purchased: "2 Nov 2026",
  },
];

/* ------------------------------------------------------------------ */
/* Messaging                                                            */
/* ------------------------------------------------------------------ */

export const conversations: Conversation[] = [
  {
    id: "conv-maya",
    name: "Maya Okafor",
    role: "Your coach · Stronger in 12",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
    lastMessage: "Your squat looked 5kg heavy on Thursday — drop it to 70 and film it.",
    lastMessageAt: "9:42",
    unread: 2,
    online: true,
    programTitle: "Stronger in 12",
  },
  {
    id: "conv-hanna",
    name: "Hanna Lindqvist",
    role: "Coach · Move Without Pain",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    lastMessage: "I have moved your session to Thursday, same time. Does that still work?",
    lastMessageAt: "Yesterday",
    unread: 0,
    online: false,
    programTitle: "Move Without Pain",
  },
  {
    id: "conv-kenji",
    name: "Kenji Sato",
    role: "Coach · Support",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    lastMessage: "Send me three days of food and I will build you a starting target.",
    lastMessageAt: "Mon",
    unread: 0,
    online: false,
  },
  {
    id: "conv-support",
    name: "FitCoach support",
    role: "Billing and accounts",
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=200&q=80",
    lastMessage: "Your receipt for Stronger in 12 is attached.",
    lastMessageAt: "3 Nov",
    unread: 0,
    online: true,
  },
];

export const messages: Record<string, Message[]> = {
  "conv-maya": [
    {
      id: "m1",
      author: "them",
      text: "Morning. How did Thursday's session go? I saw the log came through.",
      time: "9:12",
    },
    {
      id: "m2",
      author: "me",
      text: "Went well. Four sets at 60, felt it on the last two.",
      time: "9:20",
    },
    {
      id: "m3",
      author: "them",
      text: "Good. Film it from the side next week and I will look at the descent — that is the part I want to fix before we add load.",
      time: "9:26",
    },
    {
      id: "m4",
      author: "them",
      text: "Here is the session I have written for Friday. I dropped the top set by 5kg.",
      time: "9:31",
      attachment: {
        kind: "program",
        title: "Week 9 — Legs and core",
        detail: "4 exercises · 16 working sets · 52 minutes",
      },
    },
    {
      id: "m5",
      author: "me",
      text: "Got it. Booking Thursday for a session to go through it.",
      time: "9:38",
    },
    {
      id: "m6",
      author: "them",
      text: "Your squat looked 5kg heavy on Thursday — drop it to 70 and film it. I have moved your slot to 4:30pm so we can go through the video together.",
      time: "9:42",
      attachment: {
        kind: "slot",
        title: "Thu 12 Nov, 4:30pm",
        detail: "50 minutes · video call · $95",
      },
    },
  ],
  "conv-hanna": [
    {
      id: "h1",
      author: "them",
      text: "I have moved your session to Thursday, same time. Does that still work?",
      time: "Yesterday",
    },
    {
      id: "h2",
      author: "me",
      text: "Thursday is good, thank you.",
      time: "Yesterday",
    },
  ],
  "conv-kenji": [
    {
      id: "k1",
      author: "them",
      text: "Send me three days of food and I will build you a starting target.",
      time: "Mon",
    },
  ],
  "conv-support": [
    {
      id: "s1",
      author: "them",
      text: "Your receipt for Stronger in 12 is attached.",
      time: "3 Nov",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Trainer console — Maya Okafor                                        */
/* ------------------------------------------------------------------ */

export const currentTrainer = trainers[0];

export const clients: Client[] = [
  {
    id: "cl-1",
    name: "Daniel Reyes",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    programTitle: "Stronger in 12",
    programId: "stronger-in-12",
    progress: 84,
    sessionsCompleted: 7,
    joined: "14 Aug 2026",
    lastActive: "Today, 08:40",
    status: "active",
    nextSession: "Thu 12 Nov, 4:30pm",
    lifetimeValueCents: 14400,
  },
  {
    id: "cl-2",
    name: "Priya Shah",
    avatar:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=160&q=80",
    programTitle: "Stronger in 12",
    programId: "stronger-in-12",
    progress: 52,
    sessionsCompleted: 4,
    joined: "21 Aug 2026",
    lastActive: "Yesterday, 19:05",
    status: "active",
    nextSession: "Tue 11 Nov, 8:00am",
    lifetimeValueCents: 9500,
  },
  {
    id: "cl-3",
    name: "Marcus Bell",
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=160&q=80",
    programTitle: "Stronger in 12",
    programId: "stronger-in-12",
    progress: 31,
    sessionsCompleted: 2,
    joined: "29 Sep 2026",
    lastActive: "2 days ago",
    status: "active",
    nextSession: "Fri 14 Nov, 6:00pm",
    lifetimeValueCents: 14900,
  },
  {
    id: "cl-4",
    name: "Sofia Almeida",
    avatar:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=160&q=80",
    programTitle: "Return to Training",
    programId: "return-to-training",
    progress: 12,
    sessionsCompleted: 1,
    joined: "1 Nov 2026",
    lastActive: "4 days ago",
    status: "active",
    lifetimeValueCents: 9500,
  },
  {
    id: "cl-5",
    name: "Tom Whitfield",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80",
    programTitle: "Stronger in 12",
    programId: "stronger-in-12",
    progress: 100,
    sessionsCompleted: 9,
    joined: "3 Jun 2026",
    lastActive: "12 Oct 2026",
    status: "finished",
    lifetimeValueCents: 23900,
  },
  {
    id: "cl-6",
    name: "Ruth Adeyemi",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80",
    programTitle: "Return to Training",
    programId: "return-to-training",
    progress: 68,
    sessionsCompleted: 5,
    joined: "18 Sep 2026",
    lastActive: "Today, 07:15",
    status: "paused",
    nextSession: "Mon 17 Nov, 7:30pm",
    lifetimeValueCents: 14900,
  },
];

export const bookings: Booking[] = [
  {
    id: "bk-1",
    clientName: "Daniel Reyes",
    clientAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    when: "Tue 11 Nov, 8:00am",
    day: "Tue 11",
    time: "8:00am",
    durationMin: 50,
    priceCents: 9500,
    status: "confirmed",
    kind: "session",
  },
  {
    id: "bk-7",
    clientName: "Ruth Adeyemi",
    clientAvatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80",
    when: "Tue 11 Nov, 10:00am",
    day: "Tue 11",
    time: "10:00am",
    durationMin: 50,
    priceCents: 9500,
    status: "confirmed",
    kind: "session",
  },
  {
    id: "bk-2",
    clientName: "Priya Shah",
    clientAvatar:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=160&q=80",
    when: "Thu 12 Nov, 4:30pm",
    day: "Thu 12",
    time: "4:30pm",
    durationMin: 50,
    priceCents: 9500,
    status: "confirmed",
    kind: "session",
  },
  {
    id: "bk-3",
    clientName: "Marcus Bell",
    clientAvatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=160&q=80",
    when: "Fri 14 Nov, 6:00pm",
    day: "Fri 14",
    time: "6:00pm",
    durationMin: 50,
    priceCents: 9500,
    status: "pending_payment",
    kind: "session",
  },
  {
    id: "bk-4",
    clientName: "Ruth Adeyemi",
    clientAvatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80",
    when: "Mon 17 Nov, 7:30pm",
    day: "Mon 17",
    time: "7:30pm",
    durationMin: 50,
    priceCents: 9500,
    status: "confirmed",
    kind: "session",
  },
  {
    id: "bk-5",
    clientName: "Sofia Almeida",
    clientAvatar:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=160&q=80",
    when: "6 Nov, 7:00pm",
    day: "6 Nov",
    time: "7:00pm",
    durationMin: 50,
    priceCents: 9500,
    status: "completed",
    kind: "session",
  },
  {
    id: "bk-6",
    clientName: "Daniel Reyes",
    clientAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    when: "29 Oct, 8:00am",
    day: "29 Oct",
    time: "8:00am",
    durationMin: 50,
    priceCents: 9500,
    status: "completed",
    kind: "session",
  },
];

export const availabilityRules: AvailabilityRule[] = [
  {
    id: "av-1",
    weekday: "Monday",
    start: "07:00",
    end: "13:00",
    durationMin: 50,
    active: true,
  },
  {
    id: "av-2",
    weekday: "Tuesday",
    start: "07:00",
    end: "11:00",
    durationMin: 50,
    active: true,
  },
  {
    id: "av-3",
    weekday: "Wednesday",
    start: "12:00",
    end: "18:00",
    durationMin: 50,
    active: false,
  },
  {
    id: "av-4",
    weekday: "Thursday",
    start: "15:00",
    end: "20:00",
    durationMin: 50,
    active: true,
  },
  {
    id: "av-5",
    weekday: "Friday",
    start: "16:00",
    end: "20:00",
    durationMin: 50,
    active: true,
  },
];

export const slots: Slot[] = [
  { id: "s1", day: "Mon", date: "10 Nov", time: "7:00am", status: "open" },
  { id: "s2", day: "Mon", date: "10 Nov", time: "8:00am", status: "booked", clientName: "Tom Whitfield" },
  { id: "s3", day: "Mon", date: "10 Nov", time: "9:00am", status: "open" },
  { id: "s4", day: "Mon", date: "10 Nov", time: "10:00am", status: "open" },
  { id: "s5", day: "Tue", date: "11 Nov", time: "7:00am", status: "open" },
  { id: "s6", day: "Tue", date: "11 Nov", time: "8:00am", status: "booked", clientName: "Priya Shah" },
  { id: "s7", day: "Tue", date: "11 Nov", time: "9:00am", status: "open" },
  { id: "s8", day: "Tue", date: "11 Nov", time: "10:00am", status: "open" },
  { id: "s9", day: "Wed", date: "12 Nov", time: "1:00pm", status: "blocked" },
  { id: "s10", day: "Wed", date: "12 Nov", time: "2:00pm", status: "blocked" },
  { id: "s11", day: "Thu", date: "13 Nov", time: "3:00pm", status: "open" },
  { id: "s12", day: "Thu", date: "13 Nov", time: "4:30pm", status: "booked", clientName: "Daniel Reyes" },
  { id: "s13", day: "Fri", date: "14 Nov", time: "4:00pm", status: "open" },
  { id: "s14", day: "Fri", date: "14 Nov", time: "6:00pm", status: "booked", clientName: "Marcus Bell" },
];

export const earnings: EarningEntry[] = [
  {
    id: "e-1",
    date: "4 Nov 2026",
    source: "1:1 session",
    counterparty: "Sofia Almeida",
    detail: "Return to Training — 50 minutes",
    grossCents: 9500,
    feeCents: 1900,
    netCents: 7600,
    status: "paid",
  },
  {
    id: "e-2",
    date: "3 Nov 2026",
    source: "Programme sale",
    counterparty: "Sofia Almeida",
    detail: "Stronger in 12",
    grossCents: 14900,
    feeCents: 2980,
    netCents: 11920,
    status: "paid",
  },
  {
    id: "e-3",
    date: "1 Nov 2026",
    source: "1:1 session",
    counterparty: "Tom Whitfield",
    detail: "Return to Training — 50 minutes",
    grossCents: 9500,
    feeCents: 1900,
    netCents: 7600,
    status: "paid",
  },
  {
    id: "e-4",
    date: "29 Oct 2026",
    source: "Programme sale",
    counterparty: "Ruth Adeyemi",
    detail: "Stronger in 12",
    grossCents: 14900,
    feeCents: 2980,
    netCents: 11920,
    status: "paid",
  },
  {
    id: "e-5",
    date: "29 Oct 2026",
    source: "1:1 session",
    counterparty: "Daniel Reyes",
    detail: "Stronger in 12 — 50 minutes",
    grossCents: 9500,
    feeCents: 1900,
    netCents: 7600,
    status: "paid",
  },
  {
    id: "e-6",
    date: "26 Oct 2026",
    source: "Programme sale",
    counterparty: "Marcus Bell",
    detail: "Stronger in 12",
    grossCents: 14900,
    feeCents: 2980,
    netCents: 11920,
    status: "refunded",
  },
  {
    id: "e-7",
    date: "24 Oct 2026",
    source: "1:1 session",
    counterparty: "Priya Shah",
    detail: "Stronger in 12 — 50 minutes",
    grossCents: 9500,
    feeCents: 1900,
    netCents: 7600,
    status: "paid",
  },
];

export const payouts: Payout[] = [
  {
    id: "po-1",
    date: "1 Nov 2026",
    amountCents: 28440,
    status: "paid",
    destination: "•••• 4821",
  },
  {
    id: "po-2",
    date: "18 Oct 2026",
    amountCents: 31260,
    status: "paid",
    destination: "•••• 4821",
  },
  {
    id: "po-3",
    date: "4 Oct 2026",
    amountCents: 19880,
    status: "paid",
    destination: "•••• 4821",
  },
  {
    id: "po-4",
    date: "20 Sep 2026",
    amountCents: 24120,
    status: "paid",
    destination: "•••• 4821",
  },
];

/**
 * Monthly earnings for the console chart. The values are net — what actually
 * lands in the trainer's account after the platform fee.
 */
export const earningsByMonth = [
  { month: "Jun", netCents: 182400, salesCents: 149000, sessionsCents: 33400 },
  { month: "Jul", netCents: 214800, salesCents: 178000, sessionsCents: 36800 },
  { month: "Aug", netCents: 246200, salesCents: 208000, sessionsCents: 38200 },
  { month: "Sep", netCents: 228400, salesCents: 178000, sessionsCents: 50400 },
  { month: "Oct", netCents: 289600, salesCents: 238000, sessionsCents: 51600 },
  { month: "Nov", netCents: 61200, salesCents: 41800, sessionsCents: 19400 },
];

/**
 * Sessions per weekday for the week bar. The console uses this to show load
 * at a glance rather than a table of times.
 */
export const weekLoad = [
  { day: "Mon", sessions: 5, minutes: 250 },
  { day: "Tue", sessions: 4, minutes: 200 },
  { day: "Wed", sessions: 0, minutes: 0 },
  { day: "Thu", sessions: 6, minutes: 300 },
  { day: "Fri", sessions: 3, minutes: 150 },
  { day: "Sat", sessions: 0, minutes: 0 },
  { day: "Sun", sessions: 0, minutes: 0 },
];

export const notifications: Notification[] = [
  {
    id: "n-1",
    title: "Daniel Reyes booked a session",
    body: "Thursday 12 November at 4:30pm. Video call.",
    time: "12 min ago",
    read: false,
    kind: "booking",
  },
  {
    id: "n-2",
    title: "New programme sale",
    body: "Sofia Almeida bought Stronger in 12 for $149.00.",
    time: "1 hr ago",
    read: false,
    kind: "sale",
  },
  {
    id: "n-3",
    title: "Priya Shah finished week 8",
    body: "All 13 lessons complete. Sent the next week's programme.",
    time: "Yesterday",
    read: true,
    kind: "lesson",
  },
  {
    id: "n-4",
    title: "Message from Marcus Bell",
    body: "Can we move Friday's session to the week after?",
    time: "Yesterday",
    read: true,
    kind: "message",
  },
  {
    id: "n-5",
    title: "Payout sent",
    body: "$284.40 is on its way to •••• 4821.",
    time: "2 days ago",
    read: true,
    kind: "sale",
  },
];

/* ------------------------------------------------------------------ */
/* Marketing content                                                    */
/* ------------------------------------------------------------------ */

export const specialties = [
  "Strength",
  "Fat loss",
  "Hypertrophy",
  "Mobility",
  "Endurance",
  "Nutrition",
  "Pre & postnatal",
  "Home strength",
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "Twelve weeks on Stronger in 12 and my deadlift went from 60 kilos to 92. What actually changed it was Maya rewriting week three after I told her my shoulder was still sore. Nobody had done that for me before.",
    name: "Daniel Reyes",
    detail: "Week 11 of Stronger in 12",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    result: "+32kg deadlift",
  },
  {
    quote:
      "I had trained for six years and never once had somebody look at my log. Kenji read three weeks of it and found I was eating about 900 calories under what I needed. I gained six kilos and finally stopped being tired.",
    name: "Sofia Almeida",
    detail: "Hypertrophy Split, 9 months in",
    avatar:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=160&q=80",
    result: "+6kg muscle",
  },
  {
    quote:
      "The fifteen-minute routine from Mobility Reset is the only thing I have kept for more than a month. My back stopped hurting in the second week, which I did not expect at all.",
    name: "Marcus Bell",
    detail: "Mobility Reset, 4 weeks in",
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=160&q=80",
    result: "No more back pain",
  },
];

export const howItWorks = [
  {
    title: "Find a coach",
    body: "Browse coaches by what they actually coach. Every one of them sets their own price, their own hours and their own programmes.",
  },
  {
    title: "Buy the plan",
    body: "Take the programme as a whole or lesson by lesson. One payment, and the lessons are yours for good.",
  },
  {
    title: "Train and log it",
    body: "Every set is recorded against the plan, so you and your coach are looking at the same numbers.",
  },
  {
    title: "Book the person",
    body: "When a week goes sideways, book a session with the coach who wrote the plan. Video, in the browser.",
  },
];

export const marketplaceStats = [
  { value: "1,240", label: "Coaches on the platform" },
  { value: "9,800", label: "Programmes sold" },
  { value: "4.9", label: "Average coach rating" },
  { value: "50 min", label: "Standard session length" },
];
