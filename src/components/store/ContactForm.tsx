"use client";
import { useActionState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { sendMessage } from "@/app/actions";

export default function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, null);
  if (state?.ok)
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card flex flex-col items-center p-12 text-center">
        <CheckCircle2 className="h-14 w-14 text-brand-500" />
        <p className="mt-4 font-display text-2xl">Message sent</p>
        <p className="mt-1 text-neutral-600">Thanks for reaching out — we'll reply shortly.</p>
      </motion.div>
    );
  return (
    <form action={action} className="card grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
      <div><label className="label">Name</label><input name="name" required className="input" /></div>
      <div><label className="label">Email</label><input name="email" type="email" required className="input" /></div>
      <div className="sm:col-span-2"><label className="label">Phone (optional)</label><input name="phone" className="input" /></div>
      <div className="sm:col-span-2"><label className="label">Message</label><textarea name="message" rows={5} required className="input" /></div>
      {state?.error && <p className="text-sm text-red-600 sm:col-span-2">{state.error}</p>}
      <button disabled={pending} className="btn-primary sm:col-span-2">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send message</button>
    </form>
  );
}
