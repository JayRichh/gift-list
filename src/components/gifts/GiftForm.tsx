"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/Button";
import type { Gift, GiftStatus } from "~/types/gift-list";
import { cn } from "~/utils/cn";

const giftFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  cost: z.number().positive("Cost must be greater than 0"),
  status: z.enum(["planned", "purchased", "delivered"] as const),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  priority: z.number().min(1).max(5).optional(),
});

type GiftFormData = z.infer<typeof giftFormSchema>;

interface GiftFormProps {
  gift?: Gift;
  onSubmit: (data: GiftFormData) => Promise<void>;
  onCancel?: () => void;
}

const statusOptions: { label: string; value: GiftStatus }[] = [
  { label: "Planned", value: "planned" },
  { label: "Purchased", value: "purchased" },
  { label: "Delivered", value: "delivered" },
];

export function GiftForm({ gift, onSubmit, onCancel }: GiftFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<GiftFormData>({
    resolver: zodResolver(giftFormSchema),
    defaultValues: {
      name: gift?.name || "",
      cost: gift?.cost || undefined,
      status: gift?.status || "planned",
      tags: gift?.tags || [],
      notes: gift?.notes || "",
      priority: gift?.priority || undefined,
    },
  });

  const handleFormSubmit = async (data: GiftFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      // Error will be handled by the parent component
      throw error;
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Name
        </label>
        <input
          {...register("name")}
          className={cn(
            "w-full px-4 py-2 rounded-lg",
            "bg-background/50 backdrop-blur-sm",
            "border-2 border-border/50",
            "focus:outline-none focus:ring-2 focus:ring-primary/50",
            "transition duration-200",
            errors.name && "border-error/50 focus:ring-error/50"
          )}
          placeholder="Enter gift name"
          autoFocus
        />
        {errors.name && (
          <p className="text-sm text-error">{errors.name.message}</p>
        )}
      </div>

      {/* Cost Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Cost
        </label>
        <input
          {...register("cost", {
            setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
          })}
          type="number"
          step="0.01"
          min="0"
          className={cn(
            "w-full px-4 py-2 rounded-lg",
            "bg-background/50 backdrop-blur-sm",
            "border-2 border-border/50",
            "focus:outline-none focus:ring-2 focus:ring-primary/50",
            "transition duration-200",
            errors.cost && "border-error/50 focus:ring-error/50"
          )}
          placeholder="Enter cost"
        />
        {errors.cost && (
          <p className="text-sm text-error">{errors.cost.message}</p>
        )}
      </div>

      {/* Status Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Status
        </label>
        <select
          {...register("status")}
          className={cn(
            "w-full px-4 py-2 rounded-lg",
            "bg-background/50 backdrop-blur-sm",
            "border-2 border-border/50",
            "focus:outline-none focus:ring-2 focus:ring-primary/50",
            "transition duration-200"
          )}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tags Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Tags (Optional, comma-separated)
        </label>
        <input
          {...register("tags")}
          className={cn(
            "w-full px-4 py-2 rounded-lg",
            "bg-background/50 backdrop-blur-sm",
            "border-2 border-border/50",
            "focus:outline-none focus:ring-2 focus:ring-primary/50",
            "transition duration-200"
          )}
          placeholder="e.g., electronics, books, clothing"
        />
      </div>

      {/* Priority Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Priority (Optional, 1-5)
        </label>
        <input
          {...register("priority", {
            setValueAs: (v) => (v === "" ? undefined : parseInt(v)),
          })}
          type="number"
          min="1"
          max="5"
          className={cn(
            "w-full px-4 py-2 rounded-lg",
            "bg-background/50 backdrop-blur-sm",
            "border-2 border-border/50",
            "focus:outline-none focus:ring-2 focus:ring-primary/50",
            "transition duration-200",
            errors.priority && "border-error/50 focus:ring-error/50"
          )}
          placeholder="Enter priority (1-5)"
        />
        {errors.priority && (
          <p className="text-sm text-error">{errors.priority.message}</p>
        )}
      </div>

      {/* Notes Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Notes (Optional)
        </label>
        <textarea
          {...register("notes")}
          className={cn(
            "w-full px-4 py-2 rounded-lg",
            "bg-background/50 backdrop-blur-sm",
            "border-2 border-border/50",
            "focus:outline-none focus:ring-2 focus:ring-primary/50",
            "transition duration-200"
          )}
          placeholder="Add any notes about this gift"
          rows={3}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {gift ? "Update" : "Add"} Gift
        </Button>
      </div>
    </form>
  );
}
