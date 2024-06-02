import { Button } from "../HeaderContent";

export function LearnMore() {
  return (
    <section className="flex flex-col justify-center gap-32 min-h-screen mb-40 w-full">
      <div>
        <h1 className="text-7xl">Pay it Forward</h1>
        <h1 className="text-7xl">Join the Community</h1>
      </div>
      <span className="text-4xl">Payjoin can bring many benefits to Bitcoin, but it needs your help</span>
      <span className="text-4xl">
        Join our <a href="https://payjoin.substack.com/">newsletter</a> and the <a href="https://discord.gg/6rJD9R684h">Discord</a> to stay up to date with Payjoin development
      </span>
      {/* <div>
        <a href="/docs/intro">
          <Button variant="primary">Get Started</Button>
        </a>
      </div> */}
    </section>
  );
}
