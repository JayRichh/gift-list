import type {
  Group,
  GroupResponse,
  GroupsResponse,
  Gift,
  GiftResponse,
  GiftsResponse,
  Member,
  MemberResponse,
  MembersResponse,
  BudgetAnalytics,
  GiftAnalytics,
  GiftStatus,
  BudgetAnalyticsResponse,
  GiftAnalyticsResponse,
  PriceRange,
} from "~/types/gift-list";
import { generateSlug } from "~/utils/slug";

// Storage keys
const STORAGE_KEYS = {
  GROUPS: 'gift-list-groups',
  MEMBERS: 'gift-list-members',
  GIFTS: 'gift-list-gifts'
};

// Load data from localStorage or initialize empty arrays
const loadFromStorage = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error loading data from ${key}:`, error);
    return [];
  }
};

// Save data to localStorage
const saveToStorage = <T>(key: string, data: T[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data to ${key}:`, error);
  }
};

// Initialize data from localStorage
let groups: Group[] = loadFromStorage<Group>(STORAGE_KEYS.GROUPS);
let members: Member[] = loadFromStorage<Member>(STORAGE_KEYS.MEMBERS);
let gifts: Gift[] = loadFromStorage<Gift>(STORAGE_KEYS.GIFTS);

// Helper function to generate unique IDs using crypto
const generateId = (): string => {
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Helper function to get current ISO timestamp
const now = () => new Date().toISOString();

// Helper function to get price range breakdown
const getPriceRangeBreakdown = (giftsToAnalyze: Gift[]) => {
  const ranges: PriceRange[] = [
    { min: 0, max: 25, label: "Under $25" },
    { min: 25, max: 50, label: "$25-$50" },
    { min: 50, max: 100, label: "$50-$100" },
    { min: 100, max: 250, label: "$100-$250" },
    { min: 250, max: 500, label: "$250-$500" },
    { min: 500, max: Infinity, label: "$500+" },
  ];

  return ranges.map(range => ({
    range,
    count: giftsToAnalyze.filter(g => g.cost >= range.min && g.cost < range.max).length,
    totalSpent: giftsToAnalyze
      .filter(g => g.cost >= range.min && g.cost < range.max)
      .reduce((sum, g) => sum + g.cost, 0),
  }));
};

// Helper function to get monthly spending breakdown
const getMonthlySpending = (giftsToAnalyze: Gift[]) => {
  const monthlyData: Record<string, { spent: number; giftCount: number }> = {};
  
  giftsToAnalyze.forEach(gift => {
    const month = gift.createdAt.substring(0, 7); // YYYY-MM format
    if (!monthlyData[month]) {
      monthlyData[month] = { spent: 0, giftCount: 0 };
    }
    monthlyData[month].spent += gift.cost;
    monthlyData[month].giftCount += 1;
  });

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    spent: data.spent,
    giftCount: data.giftCount,
  }));
};

export const giftListApi = {
  // Group operations
  async getGroups(): Promise<GroupsResponse> {
    return { success: true, data: groups };
  },

  async getGroup(idOrSlug: string): Promise<GroupResponse> {
    const group = groups.find(g => g.id === idOrSlug || g.slug === idOrSlug);
    if (!group) throw new Error("Group not found");
    return { success: true, data: group };
  },

  async createGroup(data: Omit<Group, "id" | "createdAt" | "updatedAt">): Promise<GroupResponse> {
    const timestamp = now();
    const newGroup: Group = {
      ...data,
      id: generateId(),
      slug: data.slug || generateSlug(data.name),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    groups.push(newGroup);
    saveToStorage(STORAGE_KEYS.GROUPS, groups);
    return { success: true, data: newGroup };
  },

  async updateGroup(
    idOrSlug: string,
    data: Partial<Omit<Group, "id" | "createdAt" | "updatedAt">>
  ): Promise<GroupResponse> {
    const index = groups.findIndex(g => g.id === idOrSlug || g.slug === idOrSlug);
    if (index === -1) throw new Error("Group not found");
    
    groups[index] = {
      ...groups[index],
      ...data,
      slug: data.name ? generateSlug(data.name) : groups[index].slug,
      updatedAt: now(),
    };
    saveToStorage(STORAGE_KEYS.GROUPS, groups);
    return { success: true, data: groups[index] };
  },

  async deleteGroup(idOrSlug: string): Promise<{ success: boolean }> {
    const index = groups.findIndex(g => g.id === idOrSlug || g.slug === idOrSlug);
    if (index === -1) throw new Error("Group not found");
    
    // Delete group and associated members/gifts
    const groupId = groups[index].id;
    groups.splice(index, 1);
    members = members.filter(m => m.groupId !== groupId);
    const memberIds = members.map(m => m.id);
    gifts = gifts.filter(g => !memberIds.includes(g.memberId));
    
    // Save all updated data
    saveToStorage(STORAGE_KEYS.GROUPS, groups);
    saveToStorage(STORAGE_KEYS.MEMBERS, members);
    saveToStorage(STORAGE_KEYS.GIFTS, gifts);
    
    return { success: true };
  },

  // Member operations
  async getMembers(groupId: string): Promise<MembersResponse> {
    const group = groups.find(g => g.id === groupId || g.slug === groupId);
    if (!group) throw new Error("Group not found");
    const groupMembers = members.filter(m => m.groupId === group.id);
    return { success: true, data: groupMembers };
  },

  async getMember(idOrSlug: string): Promise<MemberResponse> {
    const member = members.find(m => m.id === idOrSlug || m.slug === idOrSlug);
    if (!member) throw new Error("Member not found");
    return { success: true, data: member };
  },

  async createMember(
    data: Omit<Member, "id" | "createdAt" | "updatedAt">
  ): Promise<MemberResponse> {
    const timestamp = now();
    const newMember: Member = {
      ...data,
      id: generateId(),
      slug: data.slug || generateSlug(data.name),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    members.push(newMember);
    saveToStorage(STORAGE_KEYS.MEMBERS, members);
    return { success: true, data: newMember };
  },

  async updateMember(
    idOrSlug: string,
    data: Partial<Omit<Member, "id" | "groupId" | "createdAt" | "updatedAt">>
  ): Promise<MemberResponse> {
    const index = members.findIndex(m => m.id === idOrSlug || m.slug === idOrSlug);
    if (index === -1) throw new Error("Member not found");
    
    members[index] = {
      ...members[index],
      ...data,
      slug: data.name ? generateSlug(data.name) : members[index].slug,
      updatedAt: now(),
    };
    saveToStorage(STORAGE_KEYS.MEMBERS, members);
    return { success: true, data: members[index] };
  },

  async deleteMember(idOrSlug: string): Promise<{ success: boolean }> {
    const index = members.findIndex(m => m.id === idOrSlug || m.slug === idOrSlug);
    if (index === -1) throw new Error("Member not found");
    
    // Delete member and their gifts
    const memberId = members[index].id;
    members.splice(index, 1);
    gifts = gifts.filter(g => g.memberId !== memberId);
    
    // Save updated data
    saveToStorage(STORAGE_KEYS.MEMBERS, members);
    saveToStorage(STORAGE_KEYS.GIFTS, gifts);
    
    return { success: true };
  },

  // Gift operations
  async getGifts(memberId?: string): Promise<GiftsResponse> {
    const member = memberId ? members.find(m => m.id === memberId || m.slug === memberId) : null;
    const filteredGifts = member ? gifts.filter(g => g.memberId === member.id) : gifts;
    return { success: true, data: filteredGifts };
  },

  async getGift(id: string): Promise<GiftResponse> {
    const gift = gifts.find(g => g.id === id);
    if (!gift) throw new Error("Gift not found");
    return { success: true, data: gift };
  },

  async createGift(data: Omit<Gift, "id" | "createdAt" | "updatedAt">): Promise<GiftResponse> {
    const timestamp = now();
    const newGift: Gift = {
      ...data,
      id: generateId(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    gifts.push(newGift);
    saveToStorage(STORAGE_KEYS.GIFTS, gifts);
    return { success: true, data: newGift };
  },

  async updateGift(
    id: string,
    data: Partial<Omit<Gift, "id" | "memberId" | "createdAt" | "updatedAt">>
  ): Promise<GiftResponse> {
    const index = gifts.findIndex(g => g.id === id);
    if (index === -1) throw new Error("Gift not found");
    
    gifts[index] = {
      ...gifts[index],
      ...data,
      updatedAt: now(),
    };
    saveToStorage(STORAGE_KEYS.GIFTS, gifts);
    return { success: true, data: gifts[index] };
  },

  async deleteGift(id: string): Promise<{ success: boolean }> {
    const index = gifts.findIndex(g => g.id === id);
    if (index === -1) throw new Error("Gift not found");
    
    gifts.splice(index, 1);
    saveToStorage(STORAGE_KEYS.GIFTS, gifts);
    return { success: true };
  },

  // Analytics operations
  async getBudgetAnalytics(): Promise<BudgetAnalyticsResponse> {
    const groupBreakdown = groups.map(group => {
      const memberIds = members
        .filter(m => m.groupId === group.id)
        .map(m => m.id);
      
      const groupGifts = gifts.filter(g => memberIds.includes(g.memberId));
      const spent = groupGifts.reduce((sum, gift) => sum + gift.cost, 0);
      
      return {
        groupId: group.id,
        groupName: group.name,
        budget: group.budget || 0,
        spent,
      };
    });

    const totalBudget = groupBreakdown.reduce((sum, g) => sum + g.budget, 0);
    const spentAmount = groupBreakdown.reduce((sum, g) => sum + g.spent, 0);

    return {
      success: true,
      data: {
        totalBudget,
        spentAmount,
        remainingAmount: totalBudget - spentAmount,
        groupBreakdown,
        priceRangeBreakdown: getPriceRangeBreakdown(gifts),
      }
    };
  },

  async getGiftAnalytics(): Promise<GiftAnalyticsResponse> {
    const statusCount: Record<GiftStatus, number> = {
      planned: 0,
      purchased: 0,
      delivered: 0,
    };

    const tagCount: Record<string, number> = {};

    gifts.forEach(gift => {
      // Count by status
      statusCount[gift.status]++;

      // Count by tags
      gift.tags?.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    return {
      success: true,
      data: {
        totalGifts: gifts.length,
        statusBreakdown: Object.entries(statusCount).map(([status, count]) => ({
          status: status as GiftStatus,
          count,
        })),
        tagBreakdown: Object.entries(tagCount).map(([tag, count]) => ({
          tag,
          count,
        })),
        priceRangeBreakdown: getPriceRangeBreakdown(gifts),
        monthlySpending: getMonthlySpending(gifts),
      }
    };
  },
};
