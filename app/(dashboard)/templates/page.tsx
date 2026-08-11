import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { createTemplate, deleteTemplate } from "@/app/actions/templates";
import { formatCurrency } from "@/lib/format";

export default async function TemplatesPage() {
  const membership = await requireMembership();
  const supabase = await createClient();

  const { data: templates } = await supabase
    .from("line_item_templates")
    .select("*")
    .eq("workspace_id", membership.workspaceId)
    .order("label");

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold">Line-item templates</h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Reusable items for fast repeat quoting.
        </p>
      </div>

      <form action={createTemplate} className="grid grid-cols-4 gap-3">
        <input name="label" required placeholder="Label" className="col-span-2 rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20" />
        <select name="type" className="rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20">
          <option value="labor">Labor</option>
          <option value="materials">Materials</option>
          <option value="flat_fee">Flat fee</option>
        </select>
        <input name="default_rate" type="number" step="0.01" placeholder="Rate" className="rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20" />
        <button type="submit" className="col-span-4 w-fit rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black">
          Add template
        </button>
      </form>

      <table className="w-full text-left text-sm">
        <tbody>
          {templates?.map((t) => (
            <tr key={t.id} className="border-b border-black/5 dark:border-white/5">
              <td className="py-2">{t.label}</td>
              <td className="py-2 capitalize">{t.type}</td>
              <td className="py-2">{formatCurrency(t.default_rate)}</td>
              <td className="py-2 text-right">
                <form action={deleteTemplate.bind(null, t.id)}>
                  <button type="submit" className="text-red-600 underline dark:text-red-400">
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
          {templates?.length === 0 && (
            <tr>
              <td colSpan={4} className="py-4 text-black/50 dark:text-white/50">
                No templates yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
