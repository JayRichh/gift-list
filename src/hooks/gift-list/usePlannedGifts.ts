import { useState, useCallback, useEffect, useRef } from "react";
import type { Gift } from "~/types/gift-list";
import { useGifts } from "./useGifts";

export function usePlannedGifts() {
  const [plannedGifts, setPlannedGifts] = useState<Gift[]>([]);
  const { gifts, loading, error } = useGifts();

  useEffect(() => {
    try {
      const planned = gifts
        .filter(gift => gift.status === "planned")
        .sort((a, b) => {
          // Sort by priority first (lower number = higher priority)
          const priorityA = a.priority || 999;
          const priorityB = b.priority || 999;
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          // Then by cost (higher cost first)
          return b.cost - a.cost;
        });
      setPlannedGifts(planned);
    } catch (error) {
      // If there's an error, set to empty array
      setPlannedGifts([]);
    }
  }, [gifts]);

  return {
    plannedGifts,
    loading,
    error
  };
}
