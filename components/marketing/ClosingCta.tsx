import Link from "next/link";

export default function ClosingCta() {
  return (
    <section className="bg-hero-gradient relative overflow-hidden px-6 py-28 text-center">
      <div className="glow-blob left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 bg-brand/25" />
      <div className="relative mx-auto max-w-2xl">
        <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
          Built for crews who&apos;d rather be working than managing software.
        </h2>
        <div className="mt-8">
          <Link href="/signup" className="btn-primary px-7 py-3 text-base">
            Start free
          </Link>
        </div>
      </div>
    </section>
  );
}
