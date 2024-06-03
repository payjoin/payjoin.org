export default function FigmaDemo() {
  return (
    <div className="min-h-screen bg-tertiary w-full flex justify-center">
    <section className="flex flex-col gap-24 my-20 w-4/5">
      <h2 className="text-6xl">Try it Yourself</h2>
      <span className="text-4xl">
        Click through the app to see all it takes to payjoin
      </span>
      <iframe
        title="Payjoin Demo"
        className="w-full h-[66vh]"
        style={{ border: "1px solid rgba(0, 0, 0, 0.1)" }}
        src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2F7BpOmi30JgG6gIaE0T7fL4%2FPayjoin-Designs-Bitcoin-Wallet-UI-Kit-%2526-Design-System%3Fpage-id%3D4263%253A62592%26node-id%3D4954%253A70101%26viewport%3D-4364%252C-2385%252C0.48%26scaling%3Dmin-zoom%26starting-point-node-id%3D4954%253A70101"
        allowfullscreen
      />
    </section>
      </div>

  );
}
