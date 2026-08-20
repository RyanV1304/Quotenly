export type MemberRole = "owner" | "teammate";
export type QuoteStatus = "draft" | "sent" | "approved" | "declined";
export type InvoiceStatus = "draft" | "sent" | "viewed" | "paid" | "overdue";
export type LineItemType = "labor" | "materials" | "flat_fee";
export type InviteStatus = "pending" | "accepted" | "cancelled";

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string | null;
  role: MemberRole;
  invited_email: string;
  invite_token: string;
  invited_at: string;
  joined_at: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  email_verified: boolean;
  created_at: string;
}

export interface Invite {
  id: string;
  workspace_id: string;
  email: string;
  token: string;
  status: InviteStatus;
  expires_at: string;
  created_at: string;
  last_resent_at: string | null;
}

export interface WorkspaceBranding {
  workspace_id: string;
  business_name: string | null;
  logo_url: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  default_tax_percent: number | null;
  payment_instructions: string | null;
  invoice_number_start: number;
  next_invoice_number: number;
  review_link: string | null;
  review_requests_enabled: boolean;
  overdue_digest_enabled: boolean;
}

export interface Client {
  id: string;
  workspace_id: string;
  name: string;
  contact_email: string | null;
  contact_phone: string | null;
  job_address: string | null;
  notes: string | null;
  created_at: string;
}

export type JobStatus = "active" | "completed";

export interface Job {
  id: string;
  workspace_id: string;
  client_id: string;
  assigned_to: string | null;
  quote_id: string | null;
  invoice_id: string | null;
  title: string;
  status: JobStatus;
  created_at: string;
}

export interface JobPhoto {
  id: string;
  job_id: string;
  url: string;
  uploaded_by: string | null;
  created_at: string;
}

export interface JobExpense {
  id: string;
  job_id: string;
  description: string;
  amount: number;
  date: string;
  created_at: string;
}

export interface ClientNote {
  id: string;
  client_id: string;
  author_user_id: string | null;
  note_text: string;
  created_at: string;
}

export interface LineItemTemplate {
  id: string;
  workspace_id: string;
  label: string;
  type: LineItemType;
  default_rate: number;
}

export interface LineItem {
  id: string;
  description: string;
  type: LineItemType;
  quantity: number;
  rate: number;
  amount: number;
  sort_order: number;
}

export interface Quote {
  id: string;
  workspace_id: string;
  client_id: string;
  assigned_to: string | null;
  status: QuoteStatus;
  subtotal: number;
  tax_rate: number;
  total: number;
  notes: string | null;
  signature_url: string | null;
  share_token: string;
  viewed_at: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  workspace_id: string;
  quote_id: string | null;
  client_id: string;
  assigned_to: string | null;
  invoice_number: number | null;
  status: InvoiceStatus;
  subtotal: number;
  tax_rate: number;
  total: number;
  due_date: string | null;
  payment_instructions: string | null;
  share_token: string;
  paid_at: string | null;
  paid_note: string | null;
  sent_at: string | null;
  created_at: string;
}
