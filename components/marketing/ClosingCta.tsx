import Link from "next/link";

export default function ClosingCta() {
  return (
    <section className="bg-bg-dark px-6 py-28 text-center">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
          Built for crews who&apos;d rather be working than managing software.
        </h2>
        <div className="mt-8">
          <Link
            href="/signup"
            className="inline-block rounded-lg bg-brand px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Start free
          </Link>
        </div>
      </div>
    </section>
  );
}
