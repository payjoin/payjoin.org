import { PointingHand } from "../Doodles";

const PROTOTYPE_SRC =
  "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2F7BpOmi30JgG6gIaE0T7fL4%2FPayjoin-Designs-Bitcoin-Wallet-UI-Kit-%2526-Design-System%3Fpage-id%3D4263%253A62592%26node-id%3D4954%253A70101%26viewport%3D-4364%252C-2385%252C0.48%26scaling%3Dmin-zoom%26starting-point-node-id%3D4954%253A70101";

/*
 * Lightest band on the page: it lifts the demo out of the dark testimonial band
 * above and steps back down into the closing band below, so the page reads
 * darkest → lightest → settling rather than flat.
 */
export default function FigmaDemo() {
  return (
    <div
      className="w-full bg-[#46192b]
        bg-[radial-gradient(60%_50%_at_15%_10%,rgba(247,83,148,0.12)_0%,rgba(70,25,43,0)_60%),radial-gradient(50%_45%_at_95%_90%,rgba(106,57,76,0.45)_0%,rgba(70,25,43,0)_70%)]"
    >
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-5 py-20 text-center sm:px-8 sm:py-32 lg:px-10">
        <h2 className="mb-0 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          Try it{" "}
          <span className="bg-gradient-to-r from-[#f75394] from-35% to-[#6A394C] bg-clip-text text-transparent">
            Yourself
          </span>
        </h2>

        <p className="mb-0 max-w-[46ch] text-base text-white/70 sm:text-lg">
          Click through the app to see all it takes to payjoin
        </p>

        {/* The hand overlaps the frame's top-right corner and only its upper
            part breaks out above, so the wrapper owns the positioning context
            and needs just enough top margin to clear that part. */}
        <div className="relative mt-8 w-full sm:mt-14 lg:mt-16">
          <PointingHand />

          <div className="overflow-hidden rounded-2xl border border-solid border-white/10 bg-[#3a1523] p-2 shadow-lg shadow-black/20 sm:p-3">
            {/* Aspect ratio rather than viewport height: the prototype is a
                phone UI, so it gets a tall frame on phones and a wide one on
                desktop instead of a 66vh box that changes shape per device. */}
            <iframe
              title="Payjoin Demo"
              className="aspect-[3/4] w-full rounded-xl border-0 sm:aspect-[16/10]"
              src={PROTOTYPE_SRC}
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </div>
  );
}
