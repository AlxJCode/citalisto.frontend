"use client";

import { useState, useCallback, useEffect } from "react";
import { message } from "antd";
import { SubscriptionOverview } from "../types/subscription.types";
import { getSubscriptionOverviewApi } from "../services/subscription.api";

export const useSubscriptionOverview = () => {
  const [overview, setOverview] = useState<SubscriptionOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    const result = await getSubscriptionOverviewApi();

    if (!result.success) {
      message.error(`E-${result.status} - ${result.message}`);
      setLoading(false);
      return;
    }

    setOverview(result.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return {
    overview,
    loading,
    refetch: fetchOverview,
  };
};
