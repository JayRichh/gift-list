import { useState, useCallback, useEffect, useRef } from "react";
import type { Member } from "~/types/gift-list";
import { giftListApi } from "~/services/gift-list-api";

// This hook gets all members across all groups
export function useAllMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isInitialMount = useRef(true);

  const fetchAllMembers = useCallback(async () => {
    setLoading(true);
    try {
      // Get all groups first
      const groupsResponse = await giftListApi.getGroups();
      
      // Then get members for each group
      const allMembersPromises = groupsResponse.data.map(group => 
        giftListApi.getMembers(group.id)
      );
      
      const membersResponses = await Promise.all(allMembersPromises);
      
      // Combine all members
      const allMembers = membersResponses.flatMap(response => response.data);
      
      setMembers(allMembers);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch members'));
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      fetchAllMembers();
      isInitialMount.current = false;
    }
  }, [fetchAllMembers]);

  return {
    members,
    loading,
    error,
    refetch: fetchAllMembers
  };
}
