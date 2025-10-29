import Marquee from "react-fast-marquee";

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

const Testimonial = ({ text, name, image }) => (
  <div className="flex flex-col items-start justify-between gap-4 mx-4 w-96 bg-tertiary rounded-lg p-6 shadow-lg">
    <blockquote className="border-l-secondary text-left italic text-sm">{text}</blockquote>
    <div className="flex items-center">
      <img src={image} alt={name} className="w-8 h-8 rounded-full mr-4" />
      <span className="font-bold">{name}</span>
    </div>
  </div>
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
        <div className="flex gap-4 flex-col sm:flex-row">
          <a href="./docs/how-payjoin-saves">
            <Button variant="primary">Learn More</Button>
          </a>
          <a target="_blank" href="https://payjoindevkit.org/">
            <Button variant="secondary">Developer Kit</Button>
          </a>
        </div>
      </div>
      <div className="w-full overflow-hidden">
        <Marquee
          gradient={true}
          gradientColor="#46192b"   
        >
          <div className="flex items-start">
            <Testimonial
              text="Payjoin usage improves the privacy of all bitcoiners by breaking the common input ownership heuristic - you can no longer assume all inputs belong to the sender."
              name="Matt Odell, Chairman, Co-Founder, OpenSats, Ten31"
              image="https://avatars.githubusercontent.com/u/50266466?v=4"
            />
            <Testimonial
              text="Payjoin doesn't even have to be widely used to make the common input ownership heuristic unusable. Since payjoins are indistinguishable on-chain, it should suffice to have payjoin optionally available in most wallets."
              name="Kemal Yaşar, CEO, Blink"
              image="https://pbs.twimg.com/profile_images/1819046599768612871/S2BADZaw_400x400.jpg"
            />
            <Testimonial
              text="More payjoin adoption would be a good thing. payjoin = https"
              name="Gigi, President, OpenSats"
              image="https://dergigi.com/assets/images/avatar.jpg"
            />
            <Testimonial
              text="Wallet side p2p PayJoin is the future IMO... Bitcoin needs more PayJoin and p2p capable PayJoin wallet interop."
              name="Adam Back, CEO, Blockstream"
              image="https://pbs.twimg.com/profile_images/1364645619705511936/IGTT_tnL_400x400.jpg"
            />
            <Testimonial
              text="Using Payjoin when spending is so underrated.

The ability to break common-input-ownership heuristic *and* completely obfuscate amount sent is extremely powerful."
              name="Seth For Privacy, VP of Operations, Cake"
              image="https://pbs.twimg.com/profile_images/1507020330954489862/MNnJ320U_400x400.jpg"
            />
            <Testimonial
              text="Payjoin adoption improves the privacy of even the people who don’t use it."
              name="Arthur Hayes, Co-founder, BitMEX"
              image="https://pbs.twimg.com/profile_images/1945370420191875072/o5Ep8CTf.png"
            />
            <Testimonial
              text="Imagine if an exchange somehow managed to make every Bitcoin deposit a Payjoin by default... Valhalla secured."
              name="Francis Pouliot, CEO, Bull Bitcoin"
              image="https://nitter.net/pic/pbs.twimg.com%2Fprofile_images%2F1749492773990916096%2FLL6AQfdo.jpg"
            />
            
          </div>
        </Marquee>
      </div>
    </div>
  );
}