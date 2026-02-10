import Marquee from "react-fast-marquee";

/*
 * Avatar source URLs (for future updates):
 * - odell: https://avatars.githubusercontent.com/u/50266466
 * - elflaco: https://x.com/AureoliAugust
 * - gigi: https://dergigi.com/assets/images/avatar.jpg
 * - adamback: https://x.com/adam3us
 * - sethforprivacy: https://x.com/saborprivacy
 */

const Testimonial = ({ text, name, image }) => (
  <div className="flex flex-col items-start justify-between gap-4 mx-4 w-96 bg-tertiary rounded-lg p-6 shadow-lg">
    <blockquote className="border-l-secondary text-left italic text-sm">{text}</blockquote>
    <div className="flex items-center">
      <img src={image} alt={name} className="w-8 h-8 rounded-full mr-4" />
      <span className="font-bold">{name}</span>
    </div>
  </div>
);

export default function Testimonials() {
  return (
    <section className="flex flex-col items-center justify-center gap-12 py-20 w-full">
      <h2 className="text-4xl">What people are saying</h2>
      <Marquee
        gradient={true}
        gradientColor="#46192b"
      >
        <div className="flex items-stretch">
          <Testimonial
            text="Payjoin usage improves the privacy of all bitcoiners by breaking the common input ownership heuristic - you can no longer assume all inputs belong to the sender."
            name="ODELL"
            image="/img/avatars/odell.jpg"
          />
          <Testimonial
            text="Payjoin doesn't even have to be widely used to make the common input ownership heuristic unusable. Since payjoins are indistinguishable on-chain, it should suffice to have payjoin optionally available in most wallets."
            name="El Flaco"
            image="/img/avatars/elflaco.jpg"
          />
          <Testimonial
            text="More payjoin adoption would be a good thing. payjoin = https"
            name="Gigi"
            image="/img/avatars/gigi.jpg"
          />
          <Testimonial
            text="Wallet side p2p PayJoin is the future IMO... Bitcoin needs more PayJoin and p2p capable PayJoin wallet interop."
            name="Adam Back"
            image="/img/avatars/adamback.jpg"
          />
          <Testimonial
            text="Using Payjoin when spending is so underrated.

The ability to break common-input-ownership heuristic *and* completely obfuscate amount sent is extremely powerful."
            name="Seth For Privacy"
            image="/img/avatars/sethforprivacy.jpg"
          />
        </div>
      </Marquee>
    </section>
  );
}
