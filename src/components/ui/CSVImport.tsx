"use client";

import * as React from "react";
import { Upload, X, Clipboard } from "lucide-react";
import { Button } from "./Button";
import { Text } from "./Text";
import { cn } from "../../utils/cn";
import type { Group, Member, Gift } from "~/types/gift-list";
import { generateSlug } from "~/utils/slug";

interface CSVRow {
  "Recipient Name": string;
  "Gift": string;
  "Overall Budget": string;
  "Actual Cost": string;
  "Purchase Status": string;
  "Store": string;
  "Gift Category": string;
  "Gift Priority": string;
  "Order #": string;
  "Delivery Status": string;
  "Total Gifts (Count)": string;
  "Total Spent (Sum)": string;
  "Gift_ID": string;
}

interface CSVImportProps {
  onImport: (data: { groups: Group[], members: Member[], gifts: Gift[] }) => void;
}

export function CSVImport({ onImport }: CSVImportProps) {
  const [csvData, setCSVData] = React.useState<CSVRow[]>([]);
  const [importing, setImporting] = React.useState(false);
  const [showPaste, setShowPaste] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const processCSVText = (text: string) => {
    const rows = text.split("\n");
    const headers = rows[0].split(",").map(h => h.trim());
    
    const data = rows.slice(1)
      .filter(row => row.trim())
      .map(row => {
        const values = row.split(",").map(v => v.trim());
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index] || "";
          return obj;
        }, {} as any);
      });
    
    setCSVData(data);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        processCSVText(text);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handlePaste = () => {
    const text = textareaRef.current?.value;
    if (text) {
      processCSVText(text);
      setShowPaste(false);
    }
  };

  const mapStatus = (purchaseStatus: string, deliveryStatus: string): Gift["status"] => {
    const status = (purchaseStatus || "").toLowerCase();
    const delivery = (deliveryStatus || "").toLowerCase();

    if (status.includes("need to sort") || status === "") return "planned";
    if (status.includes("purchased") && delivery.includes("delivering")) return "purchased";
    if (status.includes("delivered") || status.includes("transferred") || delivery === "delivered") return "delivered";
    if (status.includes("purchased")) return "purchased";
    return "planned";
  };

  const handleImport = () => {
    if (!csvData.length) return;
    setImporting(true);

    try {
      const timestamp = new Date().toISOString();
      const importedData = {
        groups: [] as Group[],
        members: [] as Member[],
        gifts: [] as Gift[]
      };

      // Create a default group for imported data
      const defaultGroup: Group = {
        id: crypto.randomUUID(),
        slug: "imported-gifts",
        name: "Imported Gifts",
        description: "Imported from CSV on " + new Date().toLocaleDateString(),
        createdAt: timestamp,
        updatedAt: timestamp
      };
      importedData.groups.push(defaultGroup);

      // First pass: Create members and aggregate their total gifts/spent
      const memberTotals = new Map<string, { count: number; spent: number; budget: number }>();
      csvData.forEach(row => {
        const recipientName = row["Recipient Name"];
        if (!recipientName) return;

        const current = memberTotals.get(recipientName) || { count: 0, spent: 0, budget: 0 };
        const totalCount = parseInt(row["Total Gifts (Count)"]) || 0;
        const totalSpent = parseFloat(row["Total Spent (Sum)"]) || 0;
        const budget = parseFloat(row["Overall Budget"]) || 0;

        if (totalCount > current.count) current.count = totalCount;
        if (totalSpent > current.spent) current.spent = totalSpent;
        if (budget > current.budget) current.budget = budget;

        memberTotals.set(recipientName, current);
      });

      // Create members with aggregated totals
      memberTotals.forEach((totals, recipientName) => {
        const member: Member = {
          id: crypto.randomUUID(),
          slug: generateSlug(recipientName),
          groupId: defaultGroup.id,
          name: recipientName,
          budget: totals.budget || undefined,
          notes: totals.count > 0 ? `Total Gifts: ${totals.count}\nTotal Spent: $${totals.spent.toFixed(2)}` : undefined,
          createdAt: timestamp,
          updatedAt: timestamp
        };
        importedData.members.push(member);
      });

      // Second pass: Create gifts
      csvData.forEach(row => {
        const recipientName = row["Recipient Name"];
        if (!recipientName) return;

        const member = importedData.members.find(m => m.name === recipientName);
        if (!member) return;

        const giftName = row["Gift"];
        if (giftName) {
          // Combine metadata into notes, only including non-empty fields
          const notes = [
            row["Store"] && `Store: ${row["Store"]}`,
            row["Gift Category"] && `Category: ${row["Gift Category"]}`,
            row["Order #"] && `Order #: ${row["Order #"]}`,
            row["Delivery Status"] && `Delivery: ${row["Delivery Status"]}`
          ].filter(Boolean).join("\n");

          const gift: Gift = {
            id: row["Gift_ID"] || crypto.randomUUID(),
            memberId: member.id,
            name: giftName,
            cost: parseFloat(row["Actual Cost"]) || 0,
            status: mapStatus(row["Purchase Status"], row["Delivery Status"]),
            notes: notes || undefined,
            priority: parseInt(row["Gift Priority"]) || undefined,
            createdAt: timestamp,
            updatedAt: timestamp
          };
          importedData.gifts.push(gift);
        }
      });

      onImport(importedData);
    } catch (error) {
      console.error("Error importing data:", error);
    } finally {
      setImporting(false);
    }
  };

  if (showPaste) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Text className="font-medium">Paste CSV Data</Text>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPaste(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <textarea
          ref={textareaRef}
          className={cn(
            "w-full h-32 p-2 rounded-lg resize-none",
            "bg-background/95",
            "border-2 border-border/50",
            "focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          )}
          placeholder="Paste your CSV data here..."
        />
        <Button
          variant="primary"
          onClick={handlePaste}
          className="w-full"
        >
          Process Data
        </Button>
      </div>
    );
  }

  if (!csvData.length) {
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 flex items-center gap-2"
          onClick={() => setShowPaste(true)}
        >
          <Clipboard className="h-4 w-4" />
          Paste CSV
        </Button>
        <label className="flex-1">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload CSV
          </Button>
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Text className="font-medium">Preview ({csvData.length} items)</Text>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setCSVData([]);
            setShowPaste(false);
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="max-h-48 overflow-y-auto rounded-lg border-2 border-border/50">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-background/95">
            <tr className="border-b border-border/50">
              <th className="p-2 text-left">Recipient</th>
              <th className="p-2 text-left">Gift</th>
              <th className="p-2 text-left">Cost</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {csvData.map((row, index) => (
              <tr key={index} className="border-b border-border/50 last:border-0">
                <td className="p-2">{row["Recipient Name"]}</td>
                <td className="p-2">{row["Gift"]}</td>
                <td className="p-2">${row["Actual Cost"] || "0"}</td>
                <td className="p-2">
                  {mapStatus(row["Purchase Status"], row["Delivery Status"])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button
        variant="primary"
        onClick={handleImport}
        className="w-full"
        disabled={importing}
      >
        {importing ? "Importing..." : "Import Data"}
      </Button>
    </div>
  );
}
