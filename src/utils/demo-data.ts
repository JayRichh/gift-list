import type { Group, Member, Gift, GiftStatus } from "~/types/gift-list";
import { giftListApi } from "~/services/gift-list-api";
import { generateSlug } from "./slug";

// Minimal set of demo gifts covering different price ranges and statuses
const DEMO_GIFTS: Array<{
  name: string;
  cost: number;
  tags: string[];
  status: GiftStatus;
  priority: number;
  notes: string;
}> = [
  { 
    name: "Smart Watch", 
    cost: 199.99, 
    tags: ["electronics"],
    status: "purchased" as GiftStatus,
    priority: 1,
    notes: "Anniversary gift idea"
  },
  { 
    name: "Coffee Gift Set", 
    cost: 45.99, 
    tags: ["kitchen"],
    status: "planned" as GiftStatus,
    priority: 2,
    notes: "They mentioned needing new coffee gear"
  }
];

export async function generateDemoData() {
  try {
    // Create a single group
    const groupName = "Family";
    const group = await giftListApi.createGroup({
      name: groupName,
      slug: generateSlug(groupName),
      description: "Close family members",
      budget: 500,
      trackingLevel: "both"
    });

    // Create a couple as members
    const memberName = "John & Sarah";
    const couple = await giftListApi.createMember({
      groupId: group.data.id,
      name: memberName,
      slug: generateSlug(memberName),
      budget: 300,
      notes: "Anniversary in June",
      tags: ["couple", "family"]
    });

    // Add demo gifts for the couple
    for (const gift of DEMO_GIFTS) {
      await giftListApi.createGift({
        ...gift,
        memberId: couple.data.id
      });
    }

    return true;
  } catch (error) {
    console.error("Error generating demo data:", error);
    return false;
  }
}
