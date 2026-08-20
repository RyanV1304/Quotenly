"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireMembership } from "@/lib/workspace";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function qs(params: Record<string, string | undefined>) {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) usp.set(k, v);
  const s = usp.toString();
  return s ? `?${s}` : "";
}

export async function createJob(formData: FormData) {
  const membership = await requireMembership();
  const title = String(formData.get("title") || "").trim();
  const clientId = String(formData.get("client_id") || "");
  const assignedTo = String(formData.get("assigned_to") || "") || null;

  if (!title) redirect("/app/jobs" + qs({ error: "Job title is required." }));
  if (!clientId) redirect("/app/jobs" + qs({ error: "Select a client for this job." }));

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("jobs")
    .insert({
      workspace_id: membership.workspaceId,
      client_id: clientId,
      title,
      assigned_to: assignedTo,
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect("/app/jobs" + qs({ error: error?.message || "Could not create job." }));
  }

  redirect(`/app/jobs/${data!.id}`);
}

export async function updateJobStatus(jobId: string, formData: FormData) {
  await requireMembership();
  const supabase = await createClient();
  const status = String(formData.get("status") || "active");

  await supabase.from("jobs").update({ status }).eq("id", jobId);

  revalidatePath(`/app/jobs/${jobId}`);
  redirect(`/app/jobs/${jobId}`);
}

export async function uploadJobPhoto(jobId: string, formData: FormData) {
  const membership = await requireMembership();
  const supabase = await createClient();

  const { data: job } = await supabase.from("jobs").select("id, workspace_id").eq("id", jobId).maybeSingle();
  if (!job) redirect("/app/jobs");

  const photoFile = formData.get("photo") as File | null;
  if (!photoFile || photoFile.size === 0) {
    redirect(`/app/jobs/${jobId}` + qs({ error: "Choose a photo to upload." }));
  }

  const admin = createAdminClient();
  const ext = photoFile!.name.split(".").pop() || "jpg";
  const path = `${job!.workspace_id}/${jobId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await admin.storage.from("job-photos").upload(path, photoFile!, {
    contentType: photoFile!.type || undefined,
  });

  if (uploadError) {
    redirect(`/app/jobs/${jobId}` + qs({ error: uploadError.message }));
  }

  const { data: pub } = admin.storage.from("job-photos").getPublicUrl(path);

  await supabase.from("job_photos").insert({
    job_id: jobId,
    url: pub.publicUrl,
    uploaded_by: membership.userId,
  });

  revalidatePath(`/app/jobs/${jobId}`);
  redirect(`/app/jobs/${jobId}`);
}

export async function deleteJobPhoto(jobId: string, photoId: string) {
  await requireMembership();
  const supabase = await createClient();

  const { data: photo } = await supabase.from("job_photos").select("url").eq("id", photoId).maybeSingle();

  await supabase.from("job_photos").delete().eq("id", photoId);

  if (photo?.url) {
    const admin = createAdminClient();
    const path = photo.url.split("/job-photos/")[1];
    if (path) await admin.storage.from("job-photos").remove([path]);
  }

  revalidatePath(`/app/jobs/${jobId}`);
  redirect(`/app/jobs/${jobId}`);
}

export async function addJobExpense(jobId: string, formData: FormData) {
  await requireMembership();
  const supabase = await createClient();

  const description = String(formData.get("description") || "").trim();
  const amount = Number(formData.get("amount") || 0);
  const date = String(formData.get("date") || "") || new Date().toISOString().slice(0, 10);

  if (!description || amount <= 0) {
    redirect(`/app/jobs/${jobId}` + qs({ error: "Enter a description and an amount greater than 0." }));
  }

  await supabase.from("job_expenses").insert({ job_id: jobId, description, amount, date });

  revalidatePath(`/app/jobs/${jobId}`);
  redirect(`/app/jobs/${jobId}`);
}

export async function deleteJobExpense(jobId: string, expenseId: string) {
  await requireMembership();
  const supabase = await createClient();

  await supabase.from("job_expenses").delete().eq("id", expenseId);

  revalidatePath(`/app/jobs/${jobId}`);
  redirect(`/app/jobs/${jobId}`);
}
