import { apiClient } from "@/lib/api/client";
import { apiRequest } from "@/lib/api/apiRequest";
import {
  PlanDetailApi,
  PlanDetail,
  SubscriptionApi,
  Subscription,
  UsageApi,
  Usage,
  SubscriptionOverviewApi,
  SubscriptionOverview,
} from "../types/subscription.types";

export const mapPlanDetail = (api: PlanDetailApi): PlanDetail => ({
  id: api.id,
  name: api.name,
  slug: api.slug,
  description: api.description,
  price: api.price,
  billingPeriod: api.billing_period,
  billingPeriodDisplay: api.billing_period_display,
  maxBranches: api.max_branches,
  maxProfessionals: api.max_professionals,
  maxBookingsPerMonth: api.max_bookings_per_month,
  maxWhatsappPerMonth: api.max_whatsapp_per_month,
  whatsappEnabled: api.whatsapp_enabled,
  customBrandingEnabled: api.custom_branding_enabled,
  apiAccessEnabled: api.api_access_enabled,
  analyticsEnabled: api.analytics_enabled,
});

export const mapSubscription = (api: SubscriptionApi): Subscription => ({
  id: api.id,
  business: api.business,
  plan: api.plan,
  planDetail: mapPlanDetail(api.plan_detail),
  status: api.status,
  statusDisplay: api.status_display,
  startedAt: api.started_at,
  expiresAt: api.expires_at,
  autoRenew: api.auto_renew,
  trialEndsAt: api.trial_ends_at,
  cancelledAt: api.cancelled_at,
  isFirstMonth: api.is_first_month,
  effectiveLimits: api.effective_limits,
});

export const mapUsage = (api: UsageApi): Usage => ({
  id: api.id,
  business: api.business,
  periodStart: api.period_start,
  periodEnd: api.period_end,
  branchesCount: api.branches_count,
  professionalsCount: api.professionals_count,
  bookingsCount: api.bookings_count,
  whatsappMessagesSent: api.whatsapp_messages_sent,
  emailMessagesSent: api.email_messages_sent,
  lastUpdated: api.last_updated,
  subscription: {
    id: api.subscription.id,
    planName: api.subscription.plan_name,
    status: api.subscription.status,
    isFirstMonth: api.subscription.is_first_month,
  },
  usagePercentages: api.usage_percentages,
});

export const mapSubscriptionOverview = (
  api: SubscriptionOverviewApi
): SubscriptionOverview => ({
  subscription: mapSubscription(api.subscription),
  usage: mapUsage(api.usage),
});

export interface GetSubscriptionOverviewSuccess {
  success: true;
  data: SubscriptionOverview;
  message: string;
  status: number;
}

export interface GetSubscriptionOverviewError {
  success: false;
  message: string;
  status: number;
}

export type GetSubscriptionOverviewResult =
  | GetSubscriptionOverviewSuccess
  | GetSubscriptionOverviewError;

export const getSubscriptionOverviewApi =
  async (): Promise<GetSubscriptionOverviewResult> => {
    const res = await apiRequest<SubscriptionOverviewApi>(() =>
      apiClient.get("/api/v1/subscriptions/overview/")
    );

    if (!res.success) {
      return {
        success: false,
        message: res.message,
        status: res.status,
      };
    }

    return {
      success: true,
      data: mapSubscriptionOverview(res.data!),
      message: res.message,
      status: res.status,
    };
  };
