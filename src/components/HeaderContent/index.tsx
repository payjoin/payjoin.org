import { useEffect, type ReactNode } from "react";
import Marquee from "react-fast-marquee";

export function Button({ children, variant }) {
  const base =
    "text-lg font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all w-full sm:w-auto";

  return (
    <button
      className={
        variant === "primary"
          ? `${base} text-white bg-primary border-none shadow-lg shadow-primary/25 hover:bg-pink-500 hover:-translate-y-0.5`
          : `${base} text-white bg-transparent border border-solid border-white/25 hover:border-primary hover:text-primary`
      }
    >
      {children}
    </button>
  );
}

/*
 * The navbar renders outside this component, so we only borrow it while the
 * hero is in view: transparent at the top so the hero gradient reads through,
 * then reverted to its Infima defaults once the user scrolls past.
 */
function useTransparentNavbarOverHero() {
  useEffect(() => {
    const navbar = document.querySelector<HTMLElement>(".navbar");
    if (!navbar) return;

    const previousTransition = navbar.style.transition;
    navbar.style.transition = "background-color 200ms ease, box-shadow 200ms ease";

    const reset = () => {
      navbar.style.removeProperty("--ifm-navbar-background-color");
      navbar.style.backgroundColor = "";
      navbar.style.boxShadow = "";
    };

    const onScroll = () => {
      if (window.scrollY > 40) {
        reset();
      } else {
        // Infima paints the navbar from this variable; override it as well as
        // the resolved colour so the hero gradient shows through untinted.
        navbar.style.setProperty("--ifm-navbar-background-color", "transparent");
        navbar.style.backgroundColor = "transparent";
        navbar.style.boxShadow = "none";
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      navbar.style.transition = previousTransition;
      reset();
    };
  }, []);
}

/*
 * ADDING A NEW WALLET LOGO:
 * 1. Add logo image to /static/img/ (PNG or SVG)
 * 2. Crop image tightly - no excess padding
 * 3. For square/tall logos (aspect ratio < 2:1), add text prop for visual balance
 *    Example: text="Wallet Name"
 * 4. Wide horizontal logos (aspect ratio > 2:1) don't need text
 */
const WalletLogo = ({
  href,
  src,
  alt,
  text,
}: {
  href: string;
  src: string;
  alt: string;
  text?: string;
}) => (
  <a
    href={href}
    className="flex items-center gap-2 mx-8 no-underline hover:no-underline opacity-70 hover:opacity-100 transition-opacity"
  >
    <img className="h-8 sm:h-9 w-auto" src={src} alt={alt} />
    {text && (
      <span className="text-white text-base sm:text-lg font-semibold whitespace-nowrap">
        {text}
      </span>
    )}
  </a>
);

/*
 * Keyframes cannot come from Tailwind without editing the shared config, so the
 * two hero animations are scoped here. Both keep the centring translate inside
 * the keyframe, otherwise the transform would drop the bubble to the corner.
 */
const heroMotion = `
  /*
   * Emission: the wrapper spans the whole square, so scaling it about its
   * centre carries the bubble outward from the middle to its resting spot and
   * grows it on the way. The slight rotate settle bends that path into a curve.
   * Both run once with fill mode both, so everything stays put afterwards.
   */
  @keyframes pjEmit {
    from { transform: scale(0.24) rotate(12deg); }
    to   { transform: scale(1) rotate(0deg); }
  }
  @keyframes pjFade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes pjGrow {
    from { transform: translate(-50%, -50%) scale(0.86); opacity: 0; }
    to   { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  }
  @keyframes pjPulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50%      { transform: translate(-50%, -50%) scale(1.03); }
  }

  .pjEmit { animation: pjEmit 900ms cubic-bezier(0.16, 1, 0.3, 1) both; }
  .pjFade { opacity: 1; animation: pjFade 700ms ease-out both; }
  .pjCore {
    animation:
      pjGrow 800ms cubic-bezier(0.16, 1, 0.3, 1) both,
      pjPulse 6s ease-in-out 900ms infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .pjEmit, .pjFade, .pjCore { animation: none; }
  }
`;

/* Simple marks, drawn with currentColor so they take the label colour. */
const ICONS: Record<string, ReactNode> = {
  privacy: <path d="M12 3l7 3v5c0 4.4-3 8.3-7 10-4-1.7-7-5.6-7-10V6l7-3z" />,
  fees: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8" />
    </>
  ),
  transaction: (
    <>
      <circle cx="9" cy="12" r="6" />
      <circle cx="15" cy="12" r="6" />
    </>
  ),
  standard: <path d="m8 6-6 6 6 6M16 6l6 6-6 6" />,
  lightning: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />,
};

/*
 * Circular formation: the concepts ring the mark, each with its own angle,
 * radius and size so the sizes stay mixed rather than uniform. Radius minus half
 * the size is the gap from the mark. Positions land in inline styles because
 * Tailwind cannot see class names built at runtime.
 */
const CORE = { x: 50, y: 50, size: 22 };

const CONCEPTS = [
  { label: "Privacy", icon: "privacy", angle: -112, radius: 44, size: 26 },
  { label: "Lower Fees", icon: "fees", angle: -42, radius: 42, size: 20 },
  { label: "One Transaction", icon: "transaction", angle: 22, radius: 45, size: 28 },
  { label: "Open Standard", icon: "standard", angle: 98, radius: 43, size: 21 },
  { label: "Lightning", icon: "lightning", angle: 162, radius: 45, size: 23 },
];

const bubbles = CONCEPTS.map((concept, i) => {
  const radians = concept.angle * (Math.PI / 180);
  return {
    ...concept,
    x: CORE.x + concept.radius * Math.cos(radians),
    y: CORE.y + concept.radius * Math.sin(radians),
    delay: 260 + i * 110,
  };
});

/*
 * The Payjoin mark is three concentric circles, so the visual scales that motif
 * up: rings radiating from the logo, each bubble naming what the protocol gives.
 */
const PayjoinDiagram = () => (
  <div className="relative w-full max-w-[285px] sm:max-w-[400px] lg:max-w-none aspect-square">
    <style>{heroMotion}</style>

    <div
      style={{ left: `${CORE.x}%`, top: `${CORE.y}%`, width: `${CORE.size}%` }}
      className="pjCore absolute aspect-square rounded-full
        flex items-center justify-center
        bg-gradient-to-b from-[#6A394C] to-[#46192b] border-2 border-solid border-primary/50"
    >
      <img src="/svg/monad.svg" alt="Payjoin" className="w-[54%]" />
    </div>

    {bubbles.map(({ label, icon, size, x, y, delay }) => (
      <div
        key={label}
        className="pjEmit absolute inset-0"
        // scale out from the mark, not the middle of the box
        style={{
          animationDelay: `${delay}ms`,
          transformOrigin: `${CORE.x}% ${CORE.y}%`,
        }}
      >
        <div
          style={{
            width: `${size}%`,
            left: `${x}%`,
            top: `${y}%`,
            animationDelay: `${delay}ms`,
          }}
          className="pjFade absolute -translate-x-1/2 -translate-y-1/2 aspect-square rounded-full p-1.5 sm:p-2
            flex flex-col items-center justify-center gap-1 sm:gap-1.5 text-center
            bg-[#46192b] border border-solid border-primary/30 text-white"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="w-[24%] h-auto"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {ICONS[icon]}
          </svg>
          <span className="text-[9px] sm:text-xs lg:text-[13px] font-bold uppercase tracking-normal sm:tracking-wide leading-tight">
            {label}
          </span>
        </div>
      </div>
    ))}
  </div>
);

export default function HeaderContent() {
  useTransparentNavbarOverHero();

  return (
    <header
      className="relative w-full overflow-hidden flex flex-col lg:min-h-screen
        mt-[calc(var(--ifm-navbar-height)*-1)] pt-[var(--ifm-navbar-height)]
        bg-[#1c0e15]
        bg-[radial-gradient(55%_45%_at_80%_32%,rgba(247,83,148,0.16)_0%,rgba(106,57,76,0.10)_45%,rgba(28,14,21,0)_100%),radial-gradient(50%_45%_at_6%_6%,rgba(106,57,76,0.28)_0%,rgba(28,14,21,0)_100%)]"
    >
      <div className="flex-1 flex items-center mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-10 lg:gap-8 items-center">
          {/* Message: spans three of the five columns, and keeps the vertical
              padding the visual is exempt from */}
          <div className="lg:col-span-3 pt-14 pb-2 sm:py-14 lg:py-20 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="mt-0 mb-0 text-[2rem] sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight max-w-[16ch]">
              Bitcoin payments that{" "}
              <span className="inline lg:block bg-gradient-to-r from-[#f75394] from-35% to-[#6A394C] bg-clip-text text-transparent">
                don&apos;t leak your history
              </span>
            </h1>

            <p className="mt-5 sm:mt-6 mb-0 text-base sm:text-xl leading-relaxed text-white/70 max-w-[44ch]">
              Sender and receiver build one transaction together. Surveillance
              breaks, fees drop.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <a href="./docs/how-payjoin-saves" className="no-underline hover:no-underline">
                <Button variant="primary">See how it works</Button>
              </a>
              <a
                target="_blank"
                href="https://payjoindevkit.org/"
                className="no-underline hover:no-underline"
              >
                <Button variant="secondary">Developer Kit</Button>
              </a>
            </div>
          </div>

          {/* Concept: spans the remaining two columns and pulls past the page
              gutter so the cluster runs out toward the edge. Order-first would
              flip it above the text, so it stays after and gets bottom room on
              mobile where it sits between the text and the supporter band */}
          <div className="lg:col-span-2 py-8 sm:pt-2 sm:pb-8 lg:py-0 flex justify-center lg:justify-end lg:-mr-10 xl:-mr-20">
            <PayjoinDiagram />
          </div>
        </div>
      </div>

      {/* Social proof: lighter full width band that lifts off the dark hero */}
      <div className="w-full bg-[#46192b] py-3 sm:py-6">
        <p className="mb-4 text-xs uppercase tracking-[0.18em] text-white/45">
          Already supported by
        </p>
        <Marquee gradient={true} gradientColor="#46192b" speed={40}>
          <WalletLogo href="https://bitmask.app" src="/img/bitmask.svg" alt="bitmasklogo" />
          <WalletLogo href="https://bluewallet.io" src="/img/bluewallet.svg" alt="bluewallet logo" />
          <WalletLogo href="https://btcpayserver.org" src="/img/btcpay.svg" alt="btcpayserver logo" />
          <WalletLogo href="https://cakewallet.com" src="/img/cakewallet.svg" alt="Cake Wallet logo" />
          <WalletLogo href="https://wallet.bullbitcoin.com" src="/img/bullbitcoin.png" alt="BULL wallet logo" />
          <WalletLogo href="https://github.com/JoinMarket-Org/joinmarket-clientserver" src="/img/joinmarket.png" alt="joinmarket logo" />
          <WalletLogo href="https://sparrowwallet.com" src="/img/sparrow.png" alt="sparrow logo" text="Sparrow Wallet" />
          <WalletLogo href="https://wasabiwallet.io" src="/img/wasabi.svg" alt="wasabi logo" />
        </Marquee>
      </div>
    </header>
  );
}

