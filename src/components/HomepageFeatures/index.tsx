import Heading from "@theme/Heading";
import type { ReactNode } from "react";

/*
 * Marks are drawn with currentColor on a 24x24 grid so they inherit the card
 * accent, echoing the stroke icons used in the hero diagram.
 */
const ICONS: Record<string, ReactNode> = {
  privacy: <path d="M12 3l7 3v5c0 4.4-3 8.3-7 10-4-1.7-7-5.6-7-10V6l7-3z" />,
  scaling: (
    <>
      <path d="M4 19V5M4 19h16" />
      <path d="M8 16v-4M13 16V8M18 16v-6" />
    </>
  ),
  lightning: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />,
};

type FeatureItem = {
  title: string;
  icon: keyof typeof ICONS;
  description: JSX.Element;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Preserve Privacy",
    icon: "privacy",
    description: (
      <>
        Payjoin preserves privacy by breaking the most common method used to spy
        on bitcoin users.
      </>
    ),
    link: "/docs/why-payjoin/privacy",
  },
  {
    title: "Scale Bitcoin, lower fees",
    icon: "scaling",
    description: (
      <>
        Payjoin can settle many transactions at once, allowing higher throughput,
        time savings, and lower fees.
      </>
    ),
    link: "/docs/why-payjoin/scaling",
  },
  {
    title: "Augment Lightning",
    icon: "lightning",
    description: (
      <>
        Payjoin enables Lightning nodes to fund and open all their channels in one
        transaction while maintaining privacy.
      </>
    ),
    link: "/docs/why-payjoin/lightning",
  },
];

function FeatureIcon({ icon }: { icon: keyof typeof ICONS }) {
  return (
    <div
      className="flex h-14 w-14 items-center justify-center rounded-2xl
        bg-gradient-to-b from-[#6A394C] to-[#46192b]
        border border-solid border-primary/40 text-primary
        transition-transform duration-300 group-hover:-translate-y-0.5"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {ICONS[icon]}
      </svg>
    </div>
  );
}

function Feature({ title, description, link, icon }: FeatureItem) {
  return (
    <a
      href={link}
      className="group relative flex flex-1 flex-col items-start gap-5 overflow-hidden
        rounded-2xl p-7 text-left no-underline hover:no-underline
        bg-[#3a1523] border border-solid border-white/10
        shadow-lg shadow-black/20
        transition-all duration-300
        hover:-translate-y-1 hover:border-primary/50 hover:shadow-primary/10"
    >
      {/* Accent wash that warms on hover, mirroring the hero gradients */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100
          bg-[radial-gradient(120%_80%_at_0%_0%,rgba(247,83,148,0.14)_0%,rgba(28,14,21,0)_60%)]"
      />

      <div className="relative flex w-full flex-col items-start gap-5">
        <FeatureIcon icon={icon} />

        <Heading as="h3" className="mb-0 text-2xl font-bold text-white">
          {title}
        </Heading>

        <p className="mb-0 text-base leading-relaxed text-white/70">
          {description}
        </p>

        <span className="mt-1 inline-flex items-center gap-1.5 text-base font-semibold text-primary">
          Learn more
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </a>
  );
}

export default function WhyPayjoin(): JSX.Element {
  return (
    <div
      id="whypayjoin"
      className="w-full bg-[#2a1520]
        bg-[radial-gradient(60%_50%_at_85%_10%,rgba(247,83,148,0.10)_0%,rgba(42,21,32,0)_60%),radial-gradient(50%_45%_at_5%_100%,rgba(106,57,76,0.30)_0%,rgba(42,21,32,0)_70%)]"
    >
      <section className="mx-auto flex w-full max-w-7xl flex-col items-center gap-16 px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/80">
            Why Payjoin
          </span>
          <h2 className="mb-0 max-w-[18ch] text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            One transaction,{" "}
            <span className="bg-gradient-to-r from-[#f75394] from-35% to-[#6A394C] bg-clip-text text-transparent">
              three wins
            </span>
          </h2>
          <p className="mb-0 mt-2 max-w-[46ch] text-base text-white/60 sm:text-lg">
            Sender and receiver collaborate on a single payment — and privacy,
            scaling, and Lightning all come along for free.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </section>
    </div>
  );
}
