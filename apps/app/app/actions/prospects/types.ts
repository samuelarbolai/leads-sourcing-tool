export type Prospect = {
  id: string;
  name: string;
  organization: string;
  role_title: string;
  location?: string;
  emails?: string[];
  priority_bucket?: string;
  priority_reason?: string;
  list_ids?: string[];
  batch_id?: string;
  social?: string[];
  created_at?: string;
  updated_at?: string;
};

export type ProspectSearchParams = {
  pageSize?: number;
  pageToken?: string;
  listIds?: string[];
  priorities?: string[];
  statuses?: string[];
  search?: string;
};

export type EnrichmentStatus = {
  status: "pending" | "queued" | "in_progress" | "completed" | "failed";
  linkedin_status?: string;
  domain_status?: string;
  linkedin_run_id?: string;
  domain_run_id?: string;
  linkedin_queue_timestamp?: string;
  domain_queue_timestamp?: string;
  linkedin_updated_at?: string;
  domain_updated_at?: string;
};

export type OutreachStatus = {
  ready: boolean;
  ready_at?: string;
  updated_at?: string;
};
