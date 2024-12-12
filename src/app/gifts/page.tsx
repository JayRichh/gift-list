"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useGifts, useGroups } from "~/hooks/gift-list";
import { Container } from "~/components/ui/Container";
import { Text } from "~/components/ui/Text";
import { Toast } from "~/components/ui/Toast";
import { GiftList } from "~/components/gifts/GiftList";
import { GiftForm } from "~/components/gifts/GiftForm";
import { Modal } from "~/components/ui/Modal";
import type { Gift } from "~/types/gift-list";

export default function GiftsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    isVisible: boolean;
  } | null>(null);

  const { groups, loading: groupsLoading } = useGroups();
  const { 
    gifts,
    loading: giftsLoading,
    error: giftsError,
    updateGift,
    deleteGift,
  } = useGifts();

  // Create a map of group names for easy lookup
  const groupMap = new Map(
    groups.map(group => [group.id, { name: group.name, slug: group.slug }])
  );

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => {
      setToast(prev => prev ? { ...prev, isVisible: false } : null);
    }, 3000);
  };

  const handleEditGift = (gift: Gift) => {
    setEditingGift(gift);
  };

  const handleUpdateGift = async (data: any) => {
    if (!editingGift || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await updateGift(editingGift.id, data);
      showToast("Gift updated successfully!", "success");
      setEditingGift(null);
    } catch (error) {
      showToast("Failed to update gift", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGift = async (gift: Gift) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await deleteGift(gift.id);
      await new Promise(resolve => setTimeout(resolve, 100));
      showToast("Gift deleted successfully!", "success");
    } catch (error) {
      showToast("Failed to delete gift", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (gift: Gift, status: Gift["status"]) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await updateGift(gift.id, { status });
      await new Promise(resolve => setTimeout(resolve, 100));
      showToast(`Gift marked as ${status}`, "success");
    } catch (error) {
      showToast("Failed to update gift status", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while initial data is loading
  if (groupsLoading || giftsLoading) {
    return (
      <Container className="py-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <Text variant="h1" className="text-4xl font-bold">
              All Gifts
            </Text>
            <Text className="text-foreground-secondary max-w-2xl">
              Loading your gifts...
            </Text>
          </div>
        </div>
      </Container>
    );
  }

  // Show error state if there's an error
  if (giftsError) {
    return (
      <Container className="py-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <Text variant="h1" className="text-4xl font-bold">
              All Gifts
            </Text>
            <Text className="text-error">
              Error loading gifts. Please try again later.
            </Text>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container className="py-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Text variant="h1" className="text-4xl font-bold">
            All Gifts
          </Text>
          <Text className="text-foreground-secondary max-w-2xl">
            View and manage all your gifts across all groups. Use filters to find specific gifts
            by status, tags, or search by name.
          </Text>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GiftList
            gifts={gifts}
            onEditGift={!isSubmitting ? handleEditGift : undefined}
            onDeleteGift={!isSubmitting ? handleDeleteGift : undefined}
            onStatusChange={!isSubmitting ? handleStatusChange : undefined}
          />
        </motion.div>
      </Container>

      {/* Edit Gift Modal */}
      {editingGift && (
        <Modal
          isOpen={true}
          onClose={() => setEditingGift(null)}
          title="Edit Gift"
        >
          <GiftForm
            gift={editingGift}
            onSubmit={handleUpdateGift}
            onCancel={() => setEditingGift(null)}
          />
        </Modal>
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
