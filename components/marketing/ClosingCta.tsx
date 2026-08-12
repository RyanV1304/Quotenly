import Link from "next/link";

export default function ClosingCta() {
  return (
    <section className="bg-dot-grid relative overflow-hidden bg-brand-dark px-6 py-28 text-center text-white">
      <div className="relative mx-auto max-w-2xl">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Built for crews who&apos;d rather be{" "}
          <span className="font-serif italic font-normal text-white">working</span> than managing
          software.
        </h2>
        <div className="mt-8">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-brand-dark shadow-lg transition hover:bg-white/90"
          >
            Start free
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
