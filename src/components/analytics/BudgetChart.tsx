"use client";

import { useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Card, CardContent } from "~/components/ui/Card";
import { Text } from "~/components/ui/Text";
import { Select } from "~/components/ui/Select";
import type { BudgetAnalytics } from "~/types/gift-list";

interface BudgetChartProps {
  data: BudgetAnalytics;
}

type ViewType = "groups" | "members" | "priceRanges";

type BarChartData = { 
  group: string; 
  budget?: number; 
  spent?: number;
  count?: number;
}[];

export function BudgetChart({ data }: BudgetChartProps) {
  const [viewType, setViewType] = useState<ViewType>("groups");

  const getChartData = (): BarChartData => {
    switch (viewType) {
      case "groups":
        return data.groupBreakdown.map(group => ({
          group: group.groupName,
          budget: group.budget,
          spent: group.spent,
        }));

      case "members":
        return data.groupBreakdown.flatMap(group => 
          group.memberBreakdown?.map(member => ({
            group: `${group.groupName} - ${member.memberName}`,
            budget: member.budget,
            spent: member.spent,
          })) || []
        );

      case "priceRanges":
        return data.priceRangeBreakdown.map(range => ({
          group: range.range.label,
          count: range.count,
          spent: range.totalSpent,
        }));

      default:
        return [];
    }
  };

  const chartData = getChartData();
  const remainingBudget = data.remainingAmount;
  const isOverBudget = remainingBudget < 0;

  const commonTheme = {
    background: "transparent",
    textColor: "hsl(var(--foreground))",
    fontSize: 11,
    axis: {
      domain: {
        line: {
          stroke: "hsl(var(--border))",
          strokeWidth: 1,
        },
      },
      ticks: {
        line: {
          stroke: "hsl(var(--border))",
          strokeWidth: 1,
        },
      },
    },
    grid: {
      line: {
        stroke: "hsl(var(--border))",
        strokeWidth: 1,
      },
    },
    tooltip: {
      container: {
        background: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        fontSize: "12px",
        borderRadius: "4px",
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        padding: "4px 8px",
      },
    },
  };

  const getBarChartKeys = () => {
    if (viewType === "priceRanges") {
      return ["count", "spent"];
    }
    return ["budget", "spent"];
  };

  return (
    <Card noPadding className="h-full">
      <CardContent className="p-4 space-y-6 h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select
              value={viewType}
              onChange={(value) => setViewType(value as ViewType)}
              options={[
                { value: "groups", label: "By Groups" },
                { value: "members", label: "By Members" },
                { value: "priceRanges", label: "By Price Range" },
              ]}
              className="w-48"
            />
            <Text 
              className={`text-sm font-medium ${
                isOverBudget ? "text-error" : "text-success"
              }`}
            >
              {isOverBudget ? "Over Budget" : "Remaining"}: ${Math.abs(remainingBudget).toFixed(2)}
            </Text>
          </div>
        </div>

        <div className="h-[calc(100%-4rem)]">
          <ResponsiveBar
            data={chartData}
            keys={getBarChartKeys()}
            indexBy="group"
            margin={{ top: 20, right: 130, bottom: 50, left: 80 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={{ scheme: "nivo" }}
            borderColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              format: value => 
                viewType === "priceRanges" && getBarChartKeys()[0] === "count"
                  ? value.toString()
                  : `$${value}`,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            legends={[
              {
                dataFrom: "keys",
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: "left-to-right",
                itemOpacity: 0.85,
                symbolSize: 20,
              },
            ]}
            theme={commonTheme}
          />
        </div>

        {viewType === "priceRanges" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {data.priceRangeBreakdown.map((range) => (
              <div 
                key={range.range.label}
                className="p-3 border border-border rounded-lg"
              >
                <Text className="font-medium">{range.range.label}</Text>
                <div className="text-sm text-foreground-secondary">
                  <div>Count: {range.count} gifts</div>
                  <div>Total: ${range.totalSpent.toFixed(2)}</div>
                  <div>
                    Avg: ${(range.totalSpent / (range.count || 1)).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
