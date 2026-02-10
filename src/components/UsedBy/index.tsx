import Marquee from "react-fast-marquee";
import styles from"./styles.module.css";

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

export default function WalletsUsingPayjoin() {
  return (
    <section className="flex flex-col justify-center gap-32 min-h-screen mb-40 w-full">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-6xl">Wallets Using Payjoin</h1>
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
      <div className="flex flex-col gap-2 text-2xl">
        <span>If you are a developer seeking to enhance your wallet with Payjoin, check out</span>
        <a className="font-bold" target="_blank" href="https://payjoindevkit.org">Payjoin Dev kit</a>
      </div>
    </section>
  );
}
