"use client";

import {
  ArrowRight,
  Bell,
  Download,
  ExternalLink,
  Mail,
  MoreHorizontal,
  Plus,
  Save,
  Search,
  Send,
  Settings,
  Trash,
} from "lucide-react";

import { Button } from "~/components/ui/Button";

import { ComponentExample } from "../types";

export const buttonCode = `import { Button } from '~/components/ui/Button';

// Different variants
<Button variant="default">Default</Button>
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link Style</Button>
<Button variant="destructive">Delete</Button>

// With icons
<Button variant="primary" leftIcon={<Plus />}>Create New</Button>
<Button variant="outline" rightIcon={<ArrowRight />}>Next Step</Button>

// Icon buttons
<Button variant="ghost" size="icon"><Bell /></Button>

// States
<Button isLoading>Loading</Button>
<Button disabled>Disabled</Button>

// Common patterns
<div className="flex gap-2">
  <Button variant="primary">Save Changes</Button>
  <Button variant="ghost">Cancel</Button>
</div>`;

export function ButtonExample() {
  return (
    <div className="w-full space-y-8">
      {/* Variants */}
      <div className="space-y-3">
        <div className="text-sm font-medium">Variants</div>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link Style</Button>
          <Button variant="destructive">Delete</Button>
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-3">
        <div className="text-sm font-medium">Sizes</div>
        <div className="flex items-center gap-4">
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="md">
            Medium
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
        </div>
      </div>

      {/* Icon Buttons */}
      <div className="space-y-3">
        <div className="text-sm font-medium">Icon Buttons</div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="primary" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* With Icons */}
      <div className="space-y-3">
        <div className="text-sm font-medium">With Icons</div>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
            Create New
          </Button>
          <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
            Next Step
          </Button>
          <Button variant="secondary" leftIcon={<Download className="h-4 w-4" />}>
            Download
          </Button>
          <Button variant="ghost" rightIcon={<ExternalLink className="h-4 w-4" />}>
            View Details
          </Button>
        </div>
      </div>

      {/* States */}
      <div className="space-y-3">
        <div className="text-sm font-medium">States</div>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" isLoading>
            Saving...
          </Button>
          <Button variant="secondary" isLoading>
            Loading
          </Button>
          <Button variant="outline" disabled>
            Disabled
          </Button>
          <Button variant="ghost" disabled>
            Disabled Ghost
          </Button>
        </div>
      </div>

      {/* Common Use Cases */}
      <div className="space-y-3">
        <div className="text-sm font-medium">Common Use Cases</div>
        <div className="space-y-4">
          {/* Form Actions */}
          <div className="flex gap-2">
            <Button variant="primary" leftIcon={<Save className="h-4 w-4" />}>
              Save Changes
            </Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Communication Actions */}
          <div className="flex gap-2">
            <Button variant="primary" leftIcon={<Mail className="h-4 w-4" />}>
              Send Email
            </Button>
            <Button variant="secondary" leftIcon={<Send className="h-4 w-4" />}>
              Send Message
            </Button>
          </div>

          {/* Destructive Actions */}
          <div className="flex gap-2">
            <Button variant="destructive" leftIcon={<Trash className="h-4 w-4" />}>
              Delete Account
            </Button>
            <Button variant="outline">Cancel</Button>
          </div>

          {/* Link Style */}
          <div className="flex items-center gap-4">
            <Button variant="link">Terms of Service</Button>
            <Button variant="link">Privacy Policy</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const buttonMeta: ComponentExample = {
  id: "button",
  title: "Button",
  description: "Interactive button component with various styles and states",
  code: buttonCode,
  component: <ButtonExample />,
};
