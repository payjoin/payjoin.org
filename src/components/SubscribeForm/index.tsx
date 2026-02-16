import { useState } from "react";

type Variant = "inline" | "stacked";

export function SubscribeForm({ variant = "stacked" }: { variant?: Variant }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const body = new URLSearchParams({
        email,
        embed: "1",
        newsletter: "payjoin",
      });
      const res = await fetch(
        "https://buttondown.com/api/emails/newsletter-subscribe",
        { method: "POST", body },
      );
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <span className="text-xl text-green-400">Check your email to confirm.</span>;
  }

  const isInline = variant === "inline";

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex ${isInline ? "flex-row" : "flex-col sm:flex-row gap-4 max-w-xl"}`}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        required
        className={`text-xl text-white px-4 py-4 bg-secondary border-solid border-white outline-none placeholder-gray-400 ${
          isInline
            ? "rounded-l-lg border-r-0 w-48"
            : "rounded-lg flex-1 px-6"
        }`}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={`text-xl text-white cursor-pointer transition-all ${
          isInline
            ? "px-6 py-4 rounded-r-lg bg-secondary border-solid border-white border-l-0 hover:border-pink-200 hover:text-pink-200"
            : "px-8 py-4 rounded-lg bg-primary hover:bg-pink-500 border-none"
        }`}
      >
        {status === "loading" ? "..." : "Subscribe"}
      </button>
      {status === "error" && (
        <span className="text-red-400 text-sm self-center ml-2">Something went wrong. Try again.</span>
      )}
    </form>
  );
}
