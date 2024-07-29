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
  <div className="flex flex-col items-start mx-4 w-96 bg-tertiary rounded-lg p-6 shadow-lg">
    <p className="text-sm mb-4 text-left">{text}</p>
    <div className="flex items-center">
      <img src={image} alt={name} className="w-8 h-8 rounded-full mr-4" />
      <p className="font-bold text-primary">{name}</p>
    </div>
  </div>
);

export default function HeaderContent() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4 max-sm:m-20 overflow-hidden w-screen">
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
      <div className="w-full overflow-hidden">
        <Marquee
          gradient={true}
          gradientColor="#46192b"
   
        >
          <Testimonial
            text="Payjoin usage improves the privacy of all bitcoiners by breaking the common input ownership heuristic - you can no longer assume all inputs belong to the sender."
            name="ODELL"
            image="https://avatars.githubusercontent.com/u/50266466?v=4"
          />
          <Testimonial
            text="Payjoin doesn't even have to be widely used to make the common input ownership heuristic unusable. Since payjoins are indistinguishable on-chain, it should suffice to have payjoin optionally available in most wallets."
            name="El Flaco"
            image="https://pbs.twimg.com/profile_images/1361820690270273541/wAHR6yPI_400x400.jpg"
          />
          <Testimonial
            text="More payjoin adoption would be a good thing. payjoin = https"
            name="Gigi"
            image="https://dergigi.com/assets/images/avatar.jpg"
          />
          <Testimonial
            text="Wallet side p2p PayJoin is the future IMO... Bitcoin needs more PayJoin and p2p capable PayJoin wallet interop."
            name="Adam Back"
            image="https://pbs.twimg.com/profile_images/1364645619705511936/IGTT_tnL_400x400.jpg"
          />
        </Marquee>
      </div>
    </div>
  );
}