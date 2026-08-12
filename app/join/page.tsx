import { verifyJoinCode } from "@/app/actions/join";
import AuthShell from "@/components/AuthShell";

const fieldClass =
  "rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-black outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15";

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string }>;
}) {
  const { code, error } = await searchParams;

  return (
    <AuthShell
      eyebrow="Join a workspace"
      title="Enter your team's code"
      subtitle="Ask your workspace owner for the join code and password."
    >
      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      <form action={verifyJoinCode} className="flex flex-col gap-3.5">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-black/70">
          Join code
          <input
            name="code"
            required
            defaultValue={code ?? ""}
            className={`${fieldClass} font-mono uppercase tracking-wide`}
            placeholder="A1B2C3D4"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-black/70">
          Join password
          <input name="password" type="password" required className={fieldClass} />
        </label>
        <button
          type="submit"
          className="mt-2 rounded-full bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-blue/30 transition hover:-translate-y-0.5 hover:bg-brand-blue-deep active:translate-y-0"
        >
          Continue
        </button>
      </form>
    </AuthShell>
  );
}
