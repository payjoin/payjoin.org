import { Button } from "../HeaderContent";

export function LearnMore() {
  return (
    <section className="flex flex-col justify-center gap-32 min-h-screen mb-40 w-full">
      {/* <div className="flex flex-col items-center gap-12"> */}
      <h1 className="text-6xl">Ready to go down the Rabbit Hole?</h1>
      <span className="text-4xl  font-extrabold">
        Try the <a href="/docs/intro">tutorial</a>, join the{" "}
        <a target="_blank" href="https://discord.gg/y4y4G3Jm">
          Discord
        </a>
        , check out{" "}
        <a target="_blank" href="https://payjoindevkit.org/">
          PDK
        </a>
        , or{" "}
        <a target="_blank" href="https://geyser.fund/project/payjoin/">
          Donate
        </a>
      </span>
      {/* </div> */}

      <div>
        <a href="/docs/intro">
          <Button variant="primary">Get Started</Button>
        </a>
      </div>
    </section>
  );
}
