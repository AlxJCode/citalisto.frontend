import { apiClient } from "@/lib/api/client";
import { apiRequest } from "@/lib/api/apiRequest";
import {
  AddonsSummaryApi,
  AddonsSummary,
  AddonCatalogItemApi,
  AddonCatalogItem,
  WhatsAppPurchasedApi,
  WhatsAppPurchased,
  MonthlyAddonApi,
  MonthlyAddon,
} from "../types/addon.types";

const mapCatalogItem = (api: AddonCatalogItemApi): AddonCatalogItem => ({
  id: api.id,
  name: api.name,
  quotaAmount: api.quota_amount,
  price: api.price,
});

const mapWhatsAppPurchased = (api: WhatsAppPurchasedApi): WhatsAppPurchased => ({
  id: api.id,
  name: api.name,
  used: api.used,
  total: api.total,
  remaining: api.remaining,
});

const mapMonthlyAddon = (api: MonthlyAddonApi): MonthlyAddon => ({
  id: api.id,
  name: api.name,
  quota: api.quota,
  expiresAt: api.expires_at,
});

const mapAddonsSummary = (api: AddonsSummaryApi): AddonsSummary => ({
  catalog: {
    whatsapp: api.catalog.whatsapp.map(mapCatalogItem),
    professionals: api.catalog.professionals.map(mapCatalogItem),
    branches: api.catalog.branches.map(mapCatalogItem),
  },
  purchased: {
    whatsapp: api.purchased.whatsapp.map(mapWhatsAppPurchased),
    professionals: api.purchased.professionals
      ? mapMonthlyAddon(api.purchased.professionals)
      : null,
    branches: api.purchased.branches ? mapMonthlyAddon(api.purchased.branches) : null,
  },
});

export const getAddonsSummaryApi = async () => {
  const res = await apiRequest<AddonsSummaryApi>(() =>
    apiClient.get("/api/v1/subscriptions/addons-summary/")
  );

  if (!res.success) {
    return { success: false, message: res.message, status: res.status };
  }

  return {
    success: true,
    data: mapAddonsSummary(res.data!),
    message: res.message,
    status: res.status,
  };
};
