export type User = {
  id: number;
  name: string;
  email: string;
  role: "citizen" | "officer" | "admin";
  preferred_language: string;
  ward?: string | null;
};

export type Complaint = {
  id: number;
  complaint_code: string;
  incident_id: number | null;
  title: string;
  description: string;
  original_language: string;
  category: string;
  department: string;
  ward: string;
  address: string;
  priority: string;
  status: string;
  confidence: number;
  routing_reason: string;
  citizen_verification: string;
  resolution_note?: string | null;
  created_at: string;
  updated_at: string;
  citizen_name?: string | null;
};

export type Incident = {
  id: number;
  incident_code: string;
  title: string;
  category: string;
  department: string;
  ward: string;
  priority: string;
  status: string;
  linked_complaints: number;
  summary: string;
  created_at: string;
  updated_at: string;
};

export type Overview = {
  total_complaints: number;
  active_complaints: number;
  awaiting_verification?: number;
  closed_complaints?: number;
  resolved_complaints?: number;
  resolution_rate?: number;
  open_incidents?: number;
  disputed_resolutions?: number;
  priority_one?: number;
};

export type ComplaintEvent = {
  event_type: string;
  note: string;
  created_at: string;
};
