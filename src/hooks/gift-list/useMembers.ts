import { useState, useCallback, useEffect, useRef } from "react";
import type { Member, MembersResponse } from "~/types/gift-list";
import { giftListApi } from "~/services/gift-list-api";
import { useAsync } from "~/hooks/useAsync";

export function useMembers(groupId: string | undefined) {
  const [members, setMembers] = useState<Member[]>([]);
  const isInitialMount = useRef(true);
  const previousGroupId = useRef(groupId);

  const { loading, error, execute } = useAsync<MembersResponse>();

  const fetchMembers = useCallback(async () => {
    if (!groupId) {
      setMembers([]);
      return;
    }
    
    try {
      const response = await execute(() => giftListApi.getMembers(groupId));
      if (response) {
        setMembers(response.data);
      }
    } catch (error) {
      // If there's an error (like group not found), set members to empty
      setMembers([]);
    }
  }, [execute, groupId]);

  const createMember = useCallback(async (data: Omit<Member, "id" | "groupId" | "createdAt" | "updatedAt">) => {
    if (!groupId) throw new Error("Group ID is required");
    
    const response = await giftListApi.createMember({
      ...data,
      groupId,
    });
    // Instead of updating state directly, fetch fresh data
    await fetchMembers();
    return response.data;
  }, [groupId, fetchMembers]);

  const updateMember = useCallback(async (
    id: string,
    data: Partial<Omit<Member, "id" | "groupId" | "createdAt" | "updatedAt">>
  ) => {
    if (!groupId) throw new Error("Group ID is required");
    
    const response = await giftListApi.updateMember(id, data);
    // Instead of updating state directly, fetch fresh data
    await fetchMembers();
    return response.data;
  }, [groupId, fetchMembers]);

  const deleteMember = useCallback(async (id: string) => {
    if (!groupId) throw new Error("Group ID is required");
    
    await giftListApi.deleteMember(id);
    // Instead of updating state directly, fetch fresh data
    await fetchMembers();
  }, [groupId, fetchMembers]);

  // Fetch members when groupId changes or on initial mount
  useEffect(() => {
    if (isInitialMount.current || groupId !== previousGroupId.current) {
      fetchMembers();
      isInitialMount.current = false;
      previousGroupId.current = groupId;
    }
  }, [groupId, fetchMembers]);

  return {
    members,
    loading,
    error,
    fetchMembers,
    createMember,
    updateMember,
    deleteMember,
  };
}
