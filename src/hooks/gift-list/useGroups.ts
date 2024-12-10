import { useState, useCallback, useEffect, useRef } from "react";
import type { Group, GroupsResponse } from "~/types/gift-list";
import { giftListApi } from "~/services/gift-list-api";
import { useAsync } from "~/hooks/useAsync";

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const isInitialMount = useRef(true);

  const { loading, error, execute } = useAsync<GroupsResponse>();

  const fetchGroups = useCallback(async () => {
    try {
      const response = await execute(() => giftListApi.getGroups());
      if (response) {
        setGroups(response.data);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      setGroups([]);
    }
  }, [execute]);

  const createGroup = useCallback(async (data: Omit<Group, "id" | "createdAt" | "updatedAt">) => {
    const response = await giftListApi.createGroup(data);
    // Instead of updating state directly, fetch fresh data
    await fetchGroups();
    return response.data;
  }, [fetchGroups]);

  const updateGroup = useCallback(async (
    id: string,
    data: Partial<Omit<Group, "id" | "createdAt" | "updatedAt">>
  ) => {
    const response = await giftListApi.updateGroup(id, data);
    // Instead of updating state directly, fetch fresh data
    await fetchGroups();
    return response.data;
  }, [fetchGroups]);

  const deleteGroup = useCallback(async (id: string) => {
    await giftListApi.deleteGroup(id);
    // Instead of updating state directly, fetch fresh data
    await fetchGroups();
  }, [fetchGroups]);

  // Fetch groups on mount and when localStorage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gift-list-groups') {
        fetchGroups();
      }
    };

    if (isInitialMount.current) {
      fetchGroups();
      isInitialMount.current = false;
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchGroups]);

  return {
    groups,
    loading,
    error,
    fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup,
  };
}
