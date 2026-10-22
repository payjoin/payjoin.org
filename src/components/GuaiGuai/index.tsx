import { useEffect, useRef, useState } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

const SPARKLES = [
  { left: "14%", top: "22%", delay: "0s", size: "1.4rem" },
  { left: "82%", top: "16%", delay: "0.7s", size: "1rem" },
  { left: "86%", top: "62%", delay: "1.3s", size: "1.6rem" },
  { left: "10%", top: "68%", delay: "1.9s", size: "1.1rem" },
  { left: "70%", top: "84%", delay: "0.4s", size: "0.9rem" },
  { left: "26%", top: "8%", delay: "2.4s", size: "0.8rem" },
];

export default function GuaiGuaiPrize() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const front = useBaseUrl("/img/guaiguai/front.jpg");
  const back = useBaseUrl("/img/guaiguai/back.jpg");
  const [noGl, setNoGl] = useState(false);

  useEffect(() => {
    let handle: { stop: () => void } | null = null;
    let cancelled = false;
    import("./bag").then(({ startBag }) => {
      if (cancelled || !canvas.current) return;
      handle = startBag(canvas.current, front, back);
      if (!handle) setNoGl(true);
    });
    return () => {
      cancelled = true;
      handle?.stop();
    };
  }, [front, back]);

  return (
    <div className={styles.stage}>
      <div className={styles.rays} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className={styles.sparkle}
          style={{ left: s.left, top: s.top, animationDelay: s.delay, fontSize: s.size }}
          aria-hidden="true"
        >
          ✦
        </span>
      ))}
      <div className={styles.shadow} aria-hidden="true" />
      {noGl ? (
        <img className={styles.fallback} src={front} alt="A green 乖乖 bag with a Payjoin sticker" />
      ) : (
        <canvas
          ref={canvas}
          className={styles.canvas}
          role="img"
          aria-label="A green 乖乖 bag with a sticker reading MIND YOUR OWN BITS, PAYJOIN.ORG, spinning slowly"
        />
      )}
    </div>
  );
}
