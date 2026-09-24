"use client";
import { useActionState } from "react";
import { subscribe } from "@/app/actions";
import { ArrowRight, Check } from "lucide-react";

export default function Newsletter() {
  const [state, action, pending] = useActionState(subscribe, null);
  if (state?.ok) {
    return <p className="flex items-center gap-2 text-brand-200"><Check className="h-5 w-5 text-brand-400" /> You're on the list — welcome!</p>;
  }
  return (
    <form action={action} className="flex w-full max-w-lg rounded-full bg-white/10 p-1.5 ring-1 ring-white/15 focus-within:ring-brand-400 lg:ml-auto">
      <input name="email" type="email" required placeholder="Your email address" className="flex-1 bg-transparent px-5 text-sm text-white placeholder:text-brand-200/60" />
      <button disabled={pending} className="btn bg-brand-500 text-white hover:bg-brand-400">
        {pending ? "…" : <>Subscribe <ArrowRight className="h-4 w-4" /></>}
      </button>
      {state?.error && <span className="sr-only">{state.error}</span>}
    </form>
  );
}
