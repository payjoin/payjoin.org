import Marquee from "react-fast-marquee";
import { CircleScribble, Sparkle, SmileyDoodle } from "../Doodles";

/*
 * Avatar source URLs (for future updates):
 * - odell: https://avatars.githubusercontent.com/u/50266466
 * - elflaco: https://x.com/AureoliAugust
 * - gigi: https://dergigi.com/assets/images/avatar.jpg
 * - adamback: https://x.com/adam3us
 * - sethforprivacy: https://x.com/saborprivacy
 */

type TestimonialItem = {
  text: string;
  name: string;
  image: string;
};

const TESTIMONIALS: TestimonialItem[] = [
  {
    text: "Payjoin usage improves the privacy of all bitcoiners by breaking the common input ownership heuristic - you can no longer assume all inputs belong to the sender.",
    name: "ODELL",
    image: "/img/avatars/odell.jpg",
  },
  {
    text: "Payjoin doesn't even have to be widely used to make the common input ownership heuristic unusable. Since payjoins are indistinguishable on-chain, it should suffice to have payjoin optionally available in most wallets.",
    name: "El Flaco",
    image: "/img/avatars/elflaco.jpg",
  },
  {
    text: "More payjoin adoption would be a good thing. payjoin = https",
    name: "Gigi",
    image: "/img/avatars/gigi.jpg",
  },
  {
    text: "Wallet side p2p PayJoin is the future IMO... Bitcoin needs more PayJoin and p2p capable PayJoin wallet interop.",
    name: "Adam Back",
    image: "/img/avatars/adamback.jpg",
  },
  {
    text: `Using Payjoin when spending is so underrated.

The ability to break common-input-ownership heuristic *and* completely obfuscate amount sent is extremely powerful.`,
    name: "Seth For Privacy",
    image: "/img/avatars/sethforprivacy.jpg",
  },
];

/* Solid double-quote mark that opens each card, drawn on a 24x24 grid. */
function QuoteMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-10 w-10 text-white/15"
      fill="currentColor"
    >
      <path d="M4 4h5.5a1 1 0 0 1 1 1v6.6c0 3.6-1.7 6.4-5 8.2a.9.9 0 0 1-1.2-.4l-.5-.9a.9.9 0 0 1 .3-1.2c1.7-1 2.6-2.2 2.8-3.6H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
      <path d="M15.5 4H21a1 1 0 0 1 1 1v6.6c0 3.6-1.7 6.4-5 8.2a.9.9 0 0 1-1.2-.4l-.5-.9a.9.9 0 0 1 .3-1.2c1.7-1 2.6-2.2 2.8-3.6h-2.9a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
    </svg>
  );
}

/*
 * Width is viewport-relative below sm so a 375px phone shows one whole card plus
 * a sliver of the next, instead of a 24rem card running off both edges. The
 * narrower card wraps the longest quote onto more lines, hence the taller fixed
 * height there — fixed rather than auto so every card still aligns.
 */
function Testimonial({ text, name, image }: TestimonialItem) {
  return (
    <div
      className="group mx-3 flex h-[28rem] w-[80vw] max-w-96 flex-col items-start gap-5
        rounded-2xl p-6 text-left
        bg-[#3a1523] border border-solid border-white/10
        shadow-lg shadow-black/20
        transition-colors duration-300 hover:border-primary/50
        sm:mx-4 sm:h-[26rem] sm:gap-6 sm:p-7"
    >
      <QuoteMark />

      <blockquote className="m-0 whitespace-pre-line border-0 p-0 text-base leading-relaxed text-white/70">
        {text}
      </blockquote>

      {/* mt-auto pins every attribution to the card floor, so names line up
          across the row no matter how long the quote above them runs. */}
      <div className="mt-auto flex items-center gap-3">
        <img src={image} alt={name} className="h-8 w-8 rounded-full" />
        <span className="font-semibold text-white">{name}</span>
      </div>
    </div>
  );
}

/*
 * The band sits on the hero's ground colour rather than the page default, so the
 * cards read as raised the same way the Why Payjoin cards do — on the lighter
 * #46192b page background this exact card colour would look sunken instead.
 * BAND_COLOR is shared with the marquee, whose edge fade has to match it exactly.
 */
const BAND_COLOR = "#1c0e15";

/*
 * Two corner washes read as blotches on a narrow band, so phones get a single
 * soft glow behind the heading and the corner pair starts at sm.
 */
export default function Testimonials() {
  return (
    <div
      className="relative w-full overflow-hidden bg-[#1c0e15]
        bg-[radial-gradient(100%_35%_at_50%_0%,rgba(247,83,148,0.10)_0%,rgba(28,14,21,0)_70%)]
        sm:bg-[radial-gradient(55%_45%_at_15%_10%,rgba(247,83,148,0.10)_0%,rgba(28,14,21,0)_60%),radial-gradient(50%_45%_at_90%_95%,rgba(106,57,76,0.28)_0%,rgba(28,14,21,0)_70%)]"
    >
      <SmileyDoodle />

      {/* Full-bleed section: the marquee runs edge to edge, so only the heading
          takes the page gutter and max width the other sections use. */}
      <section className="relative flex w-full flex-col items-center gap-10 py-20 sm:gap-16 sm:py-32">
        <div className="mx-auto w-full max-w-7xl px-5 text-center sm:px-8 lg:px-10">
          <h2 className="mb-0 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            What people are{" "}
            {/* inline-block so the scribble and sparkle measure against the word
                itself rather than the whole heading line */}
            <span className="relative inline-block">
              <CircleScribble />
              <span className="relative bg-gradient-to-r from-[#f75394] from-35% to-[#6A394C] bg-clip-text text-transparent">
                saying
              </span>
              <Sparkle />
            </span>
          </h2>
        </div>

        {/* Percentage fade: the 200px default eats over half of a phone screen,
            washing out the cards it is supposed to be framing. */}
        <Marquee
          gradient={true}
          gradientColor={BAND_COLOR}
          gradientWidth="8%"
          pauseOnHover
        >
          <div className="flex items-stretch py-2">
            {TESTIMONIALS.map((testimonial) => (
              <Testimonial key={testimonial.name} {...testimonial} />
            ))}
          </div>
        </Marquee>
      </section>
    </div>
  );
}
