import Marquee from "react-fast-marquee";
import styles from "./styles.module.css";
import { SubscribeForm } from "../SubscribeForm";

// Button component remains unchanged
export function Button({ children, variant }) {
  return (
    <button
      className={`text-xl text-white px-12 py-4 rounded-lg cursor-pointer transition-all w-80 ${
        variant === "primary"
          ? "bg-primary  hover:bg-pink-500 border-none"
          : "border-solid bg-secondary border-white hover:border-pink-200 hover:text-pink-200"
      } `}
    >
      {children}
    </button>
  );
}

/*
 * ADDING A NEW WALLET LOGO:
 * 1. Add logo image to /static/img/ (PNG or SVG)
 * 2. Crop image tightly - no excess padding
 * 3. For square/tall logos (aspect ratio < 2:1), add text prop for visual balance
 *    Example: text="Wallet Name"
 * 4. Wide horizontal logos (aspect ratio > 2:1) don't need text
 */
const WalletLogo = ({ href, src, alt, text }) => (
  <a href={href} className="flex items-center gap-3 mx-10 no-underline hover:no-underline">
    <img className={styles.logoImg} src={src} alt={alt} />
    {text && <span className={styles.logoText}>{text}</span>}
  </a>
);

export default function HeaderContent() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-24 max-sm:m-20 overflow-hidden w-screen">
      <div className="flex flex-col gap-4 justify-center items-center">
        <img
          src="/svg/monad.svg"
          alt="Monad Logo"
          className="w-24 text-primary"
        />
        <h1 className="text-6xl">Payjoin</h1>
        <div className="flex flex-col">
          <h2 className="text-2xl">
            Scale Bitcoin, save fees, and preserve privacy all at once.
          </h2>
        </div>
        <div className="flex gap-4 flex-col sm:flex-row items-center">
          <a href="./docs/how-payjoin-saves">
            <Button variant="primary">Learn More</Button>
          </a>
          <SubscribeForm variant="inline" />
        </div>
      </div>
      <Marquee
        className="bg-tertiary w-32 h-[24vh]"
        gradient={true}
        gradientColor="#46192b"
      >
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
  );
}