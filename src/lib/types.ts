export type Project = {
  id: string; title: string; description: string; location_city: string;
  budget_min: string|null; budget_max: string|null; currency: string;
  deadline: string|null; status: string; category_name: string|null;
  bid_count: string; created_at: string; visibility: string;
};

export type Bid = {
  id: string; project_id: string; company_id: string; amount: string;
  currency: string; proposal_text: string; estimated_days: number|null;
  status: string; company_name: string; logo_url: string|null;
  is_verified: boolean; membership_tier: string;
};

export type User = {
  id: string; email: string; role: string; full_name: string;
  phone?: string; email_verified: boolean;
};
