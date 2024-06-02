import Marquee from "react-fast-marquee";
import "./styles.module.css";

export default function WalletsUsingPayjoin() {
  return (
    <section className="flex flex-col justify-center gap-32 min-h-screen mb-40 w-full">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-6xl">Wallets Using Payjoin</h1>
 
      </div>
      <Marquee
        className="bg-tertiary w-32"
        gradient={true}
        gradientColor="#46192b"
      >
        <a href="https://www.mutinywallet.com/">
          <img
            src="/img/mutiny.svg"
            alt="Mutinywallet Logo"
            className="max-w-[200px] w-full h-full"
          />
        </a>
        <a href="https://bitmask.app">
          <img
            src="/img/bitmask.svg"
            alt="bitmasklogo"
            className="max-w-[200px] w-full h-full"
          />
        </a>
        <a href="https://bluewallet.io">
          <img src="/img/bluewallet.svg" alt="bluewallet logo" />
        </a>
        <a href="https://btcpayserver.org">
          <img src="/img/btcpay.svg" alt="btcpayserver logo" />
        </a>
        <a href="https://joinmarket.net">
          <img
            src="/img/joinmarket.png"
            alt="joinmarket logo"
            className="max-w-[200px]"
          />
        </a>
        <a href="https://sparrowwallet.com">
          <img
            src="/img/sparrow.png"
            alt="sparrow logo"
            className="max-w-[75px]"
          />
        </a>
        <a href="https://wasabiwallet.io">
          <img src="/img/wasabi.svg" alt="wasabi logo" />
        </a>
      </Marquee>
      {/* <div>
        <a href="https://payjoindevkit.org/" target="_blank">
          <button className="font-extrabold  bg-gradient-to-r bg-secondary border-white border-2 border-solid shadow-[0px_0px_10px_10px_rgba(0,0,0,0.3)] shadow-primary hover:scale-105 transition-all p-8 rounded-lg cursor-pointer text-5xl ">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-white">
              Integrate Payjoin
            </span>
          </button>
        </a>
      </div> */}
      <div className="flex flex-col gap-2 text-2xl">
        <span>If you are a developer seeking to enhance your wallet with Payjoin, check out</span>
        <a className="font-bold" href="https://payjoindevkit.org">Payjoin Dev kit</a>
      </div>
    </section>
  );
}
