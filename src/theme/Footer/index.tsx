import type { ReactNode } from "react";
import Footer from "@theme-original/Footer";
import type FooterType from "@theme/Footer";
import type { WrapperProps } from "@docusaurus/types";

type Props = WrapperProps<typeof FooterType>;

/*
 * Oversized wordmark that closes the page. SVG text rather than a styled <h*>:
 * textLength with lengthAdjust="spacing" makes the letters span the full width
 * exactly by opening the gaps between them, at any viewport, without stretching
 * the glyphs themselves — a vw-sized heading can only approximate that, and
 * overshoots into a horizontal scrollbar when it guesses wrong.
 *
 * The whole thing scales with the viewBox, so one size covers every breakpoint.
 */
function PayjoinWordmark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none select-none overflow-hidden px-5 sm:px-8 lg:px-10"
    >
      <svg viewBox="0 0 1000 210" className="block w-full" role="presentation">
        <defs>
          {/* Fades down the letterforms so they dissolve into the page edge
              rather than stopping at a hard baseline. */}
          <linearGradient id="pjWordmarkFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f75394" stopOpacity="0.7" />
            <stop offset="55%" stopColor="#f75394" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#f75394" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/*
          fontSize caps out around 200 here: "PAYJOIN" set at that size nearly
          fills the 1000-unit textLength on its own, and past that the spacing
          adjustment would have to go negative and overlap the letters.
        */}
        <text
          x="0"
          y="180"
          textLength="1000"
          lengthAdjust="spacing"
          fontSize="200"
          fontWeight="800"
          fill="url(#pjWordmarkFade)"
        >
          PAYJOIN
        </text>
      </svg>
    </div>
  );
}

/*
 * Wrapper swizzle: the footer's links and copyright stay entirely
 * config-driven in docusaurus.config.ts. This only adds the wordmark beneath
 * them, on the same background so the two read as one block.
 */
export default function FooterWrapper(props: Props): ReactNode {
  return (
    <div className="bg-[#2a1520]">
      <Footer {...props} />
      <PayjoinWordmark />
    </div>
  );
}
