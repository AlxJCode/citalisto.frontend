export interface AddonCatalogItemApi {
  id: number;
  name: string;
  quota_amount: number;
  price: string;
}

export interface AddonCatalogItem {
  id: number;
  name: string;
  quotaAmount: number;
  price: string;
}

export interface WhatsAppPurchasedApi {
  id: number;
  name: string;
  used: number;
  total: number;
  remaining: number;
}

export interface WhatsAppPurchased {
  id: number;
  name: string;
  used: number;
  total: number;
  remaining: number;
}

export interface MonthlyAddonApi {
  id: number;
  name: string;
  quota: number;
  expires_at: string | null;
}

export interface MonthlyAddon {
  id: number;
  name: string;
  quota: number;
  expiresAt: string | null;
}

export interface AddonsSummaryApi {
  catalog: {
    whatsapp: AddonCatalogItemApi[];
    professionals: AddonCatalogItemApi[];
    branches: AddonCatalogItemApi[];
  };
  purchased: {
    whatsapp: WhatsAppPurchasedApi[];
    professionals: MonthlyAddonApi | null;
    branches: MonthlyAddonApi | null;
  };
}

export interface AddonsSummary {
  catalog: {
    whatsapp: AddonCatalogItem[];
    professionals: AddonCatalogItem[];
    branches: AddonCatalogItem[];
  };
  purchased: {
    whatsapp: WhatsAppPurchased[];
    professionals: MonthlyAddon | null;
    branches: MonthlyAddon | null;
  };
}
