export interface PlanDetailApi {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  billing_period: string;
  billing_period_display: string;
  max_branches: number | null;
  max_professionals: number | null;
  max_bookings_per_month: number | null;
  max_whatsapp_per_month: number | null;
  whatsapp_enabled: boolean;
  custom_branding_enabled: boolean;
  api_access_enabled: boolean;
  analytics_enabled: boolean;
}

export interface PlanDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  billingPeriod: string;
  billingPeriodDisplay: string;
  maxBranches: number | null;
  maxProfessionals: number | null;
  maxBookingsPerMonth: number | null;
  maxWhatsappPerMonth: number | null;
  whatsappEnabled: boolean;
  customBrandingEnabled: boolean;
  apiAccessEnabled: boolean;
  analyticsEnabled: boolean;
}

export interface EffectiveLimits {
  branches: number | null;
  professionals: number | null;
  bookings: number | null;
  whatsapp: number | null;
}

export interface SubscriptionApi {
  id: number;
  business: number;
  plan: number;
  plan_detail: PlanDetailApi;
  status: string;
  status_display: string;
  started_at: string;
  expires_at: string | null;
  auto_renew: boolean;
  trial_ends_at: string | null;
  cancelled_at: string | null;
  is_first_month: boolean;
  effective_limits: EffectiveLimits;
}

export interface Subscription {
  id: number;
  business: number;
  plan: number;
  planDetail: PlanDetail;
  status: string;
  statusDisplay: string;
  startedAt: string;
  expiresAt: string | null;
  autoRenew: boolean;
  trialEndsAt: string | null;
  cancelledAt: string | null;
  isFirstMonth: boolean;
  effectiveLimits: EffectiveLimits;
}

export interface UsagePercentages {
  branches: number | null;
  professionals: number | null;
  bookings: number | null;
  whatsapp: number | null;
}

export interface UsageSubscriptionInfo {
  id: number;
  plan_name: string;
  status: string;
  is_first_month: boolean;
}

export interface UsageSubscriptionInfoCamel {
  id: number;
  planName: string;
  status: string;
  isFirstMonth: boolean;
}

export interface UsageApi {
  id: number;
  business: number;
  period_start: string;
  period_end: string;
  branches_count: number;
  professionals_count: number;
  bookings_count: number;
  whatsapp_messages_sent: number;
  email_messages_sent: number;
  last_updated: string;
  subscription: UsageSubscriptionInfo;
  usage_percentages: UsagePercentages;
}

export interface Usage {
  id: number;
  business: number;
  periodStart: string;
  periodEnd: string;
  branchesCount: number;
  professionalsCount: number;
  bookingsCount: number;
  whatsappMessagesSent: number;
  emailMessagesSent: number;
  lastUpdated: string;
  subscription: UsageSubscriptionInfoCamel;
  usagePercentages: UsagePercentages;
}

export interface SubscriptionOverviewApi {
  subscription: SubscriptionApi;
  usage: UsageApi;
}

export interface SubscriptionOverview {
  subscription: Subscription;
  usage: Usage;
}
