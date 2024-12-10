import { useState, useCallback, useEffect, useRef } from "react";
import type { 
  Gift, 
  GiftsResponse, 
  BudgetAnalytics, 
  GiftAnalytics,
  BudgetAnalyticsResponse,
  GiftAnalyticsResponse
} from "~/types/gift-list";
import { giftListApi } from "~/services/gift-list-api";
import { useAsync } from "~/hooks/useAsync";

interface UseGiftsOptions {
  memberId?: string;
}

export function useGifts(options: UseGiftsOptions = {}) {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const isInitialMount = useRef(true);
  const previousMemberId = useRef(options.memberId);

  const { loading, error, execute } = useAsync<GiftsResponse>();

  const fetchGifts = useCallback(async () => {
    try {
      const response = await execute(() => giftListApi.getGifts(options.memberId));
      if (response) {
        setGifts(response.data);
      }
    } catch (error) {
      // If there's an error, set gifts to empty array
      setGifts([]);
    }
  }, [execute, options.memberId]);

  const createGift = useCallback(async (data: Omit<Gift, "id" | "createdAt" | "updatedAt">) => {
    if (!data.memberId) throw new Error("Member ID is required");
    
    const response = await giftListApi.createGift(data);
    // Instead of updating state directly, fetch fresh data
    await fetchGifts();
    return response.data;
  }, [fetchGifts]);

  const updateGift = useCallback(async (
    id: string,
    data: Partial<Omit<Gift, "id" | "memberId" | "createdAt" | "updatedAt">>
  ) => {
    const response = await giftListApi.updateGift(id, data);
    // Instead of updating state directly, fetch fresh data
    await fetchGifts();
    return response.data;
  }, [fetchGifts]);

  const deleteGift = useCallback(async (id: string) => {
    await giftListApi.deleteGift(id);
    // Instead of updating state directly, fetch fresh data
    await fetchGifts();
  }, [fetchGifts]);

  // Helper function to update gift status
  const updateGiftStatus = useCallback(async (id: string, status: Gift["status"]) => {
    return updateGift(id, { status });
  }, [updateGift]);

  // Helper function to update gift tags
  const updateGiftTags = useCallback(async (id: string, tags: string[]) => {
    return updateGift(id, { tags });
  }, [updateGift]);

  // Fetch gifts when options change or on initial mount
  useEffect(() => {
    if (isInitialMount.current || options.memberId !== previousMemberId.current) {
      fetchGifts();
      isInitialMount.current = false;
      previousMemberId.current = options.memberId;
    }
  }, [options.memberId, fetchGifts]);

  return {
    gifts,
    loading,
    error,
    fetchGifts,
    createGift,
    updateGift,
    deleteGift,
    updateGiftStatus,
    updateGiftTags,
  };
}

// Export a hook for analytics
export function useGiftAnalytics() {
  const [budgetAnalytics, setBudgetAnalytics] = useState<BudgetAnalytics | null>(null);
  const [giftAnalytics, setGiftAnalytics] = useState<GiftAnalytics | null>(null);
  const isInitialMount = useRef(true);

  const { loading: budgetLoading, error: budgetError, execute: executeBudget } = useAsync<BudgetAnalyticsResponse>();
  const { loading: giftLoading, error: giftError, execute: executeGift } = useAsync<GiftAnalyticsResponse>();

  const fetchAnalytics = useCallback(async () => {
    try {
      const [budgetResponse, giftResponse] = await Promise.all([
        executeBudget(() => giftListApi.getBudgetAnalytics()),
        executeGift(() => giftListApi.getGiftAnalytics()),
      ]);

      if (budgetResponse) setBudgetAnalytics(budgetResponse.data);
      if (giftResponse) setGiftAnalytics(giftResponse.data);
    } catch (error) {
      // If there's an error, set analytics to null
      setBudgetAnalytics(null);
      setGiftAnalytics(null);
    }
  }, [executeBudget, executeGift]);

  // Fetch analytics only on initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      fetchAnalytics();
      isInitialMount.current = false;
    }
  }, [fetchAnalytics]);

  return {
    budgetAnalytics,
    giftAnalytics,
    loading: budgetLoading || giftLoading,
    error: budgetError || giftError,
    refetch: fetchAnalytics,
  };
}
