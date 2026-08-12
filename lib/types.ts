export type MemberRole = "owner" | "teammate";
export type QuoteStatus = "draft" | "sent" | "approved";
export type InvoiceStatus = "draft" | "sent" | "viewed" | "paid" | "overdue";
export type LineItemType = "labor" | "materials" | "flat_fee";

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  join_code: string | null;
  join_password_hash: string | null;
  join_enabled: boolean;
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

export interface WorkspaceBranding {
  workspace_id: string;
  business_name: string | null;
  logo_url: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
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
  share_token: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  workspace_id: string;
  quote_id: string | null;
  client_id: string;
  assigned_to: string | null;
  status: InvoiceStatus;
  subtotal: number;
  tax_rate: number;
  total: number;
  due_date: string | null;
  payment_instructions: string | null;
  share_token: string;
  created_at: string;
}
