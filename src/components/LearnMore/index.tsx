import { SubscribeForm } from "../SubscribeForm";

export function LearnMore() {
  return (
    <div className="min-h-screen w-full flex justify-center">
    <section className="flex flex-col gap-24 my-20 w-4/5">
      <div>
        <h1 className="text-6xl max-md:text-5xl">Stay in the Loop</h1>
      </div>
      <span className="text-4xl">Get updates on Payjoin development, integrations, and research.</span>
      <div className="flex flex-col gap-8">
        <SubscribeForm variant="stacked" />
        <span className="text-2xl">
          Join the <a target="_blank" href="https://discord.gg/6rJD9R684h">Discord</a> to chat with the community
        </span>
      </div>
    </section>
    </div>
  );
}
