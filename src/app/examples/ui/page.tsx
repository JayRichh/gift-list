"use client";

import { Suspense, memo, useCallback, useEffect, useMemo } from "react";

import { useRouter } from "next/navigation";

import { ExampleContainer, ExampleSection } from "~/components/ExampleSection";
import { Card, CardContent } from "~/components/ui/Card";
import { CodePreview } from "~/components/ui/CodePreview";
import { Spinner } from "~/components/ui/Spinner";
import { TabGroup } from "~/components/ui/TabGroup";

import { useActiveSection } from "~/hooks/useActiveSection";

import { allExamples, componentCategories } from "./components";

const UIExamplesContent = memo(function UIExamplesContent() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { section: _activeSection, category: activeCategory } = useActiveSection();

  const examples = useMemo(
    () =>
      activeCategory
        ? componentCategories.find((c) => c.id === activeCategory)?.components || []
        : allExamples,
    [activeCategory]
  );

  const tabs = useMemo(
    () => [
      {
        id: "all",
        label: "All",
        content: null,
      },
      ...componentCategories.map((category) => ({
        id: category.id,
        label: category.title,
        content: null,
      })),
    ],
    []
  );

  // Prefetch all categories on initial load
  useEffect(() => {
    componentCategories.forEach((category) => {
      try {
        const firstComponent = category.components?.[0];
        if (firstComponent) {
          const prefetchUrl = `/examples/ui?section=${category.id}#${firstComponent.id}`;
          router.prefetch(prefetchUrl);
        }
      } catch (error) {
        console.error("Error prefetching category:", error);
      }
    });
  }, [router]);

  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      try {
        const targetCategory = categoryId === "all" ? null : categoryId;
        const currentHash = window?.location?.hash?.slice(1);

        if (targetCategory) {
          // Get first item in category for default selection
          const category = componentCategories.find((c) => c.id === targetCategory);
          const firstItem = category?.components?.[0];

          // If there's a current hash and it belongs to the new category, keep it
          const shouldKeepHash =
            currentHash && category?.components?.some((c) => c.id === currentHash);

          if (shouldKeepHash) {
            router.push(`/examples/ui?section=${targetCategory}#${currentHash}`, { scroll: false });
          } else if (firstItem) {
            router.push(`/examples/ui?section=${targetCategory}#${firstItem.id}`, {
              scroll: false,
            });
          } else {
            router.push(`/examples/ui?section=${targetCategory}`, { scroll: false });
          }
        } else {
          router.push(currentHash ? `/examples/ui#${currentHash}` : "/examples/ui", {
            scroll: false,
          });
        }
      } catch (error) {
        console.error("Error changing category:", error);
      }
    },
    [router]
  );

  return (
    <>
      <div className="mb-16">
        <div className="max-w-7xl mx-auto px-6">
          <TabGroup
            tabs={tabs}
            value={activeCategory || "all"}
            onChange={handleCategoryChange}
            variant="pills"
            className="sticky top-24 bg-background/80 backdrop-blur-sm z-10 py-6 border-b border-border/10"
          />

          {activeCategory && (
            <div className="mt-6 text-sm text-foreground-secondary">
              {componentCategories.find((c) => c.id === activeCategory)?.description}
            </div>
          )}
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <Spinner size="lg" variant="primary" />
          </div>
        }
      >
        <div className="space-y-24">
          {examples.map((example) => (
            <ExampleSection
              key={example.id}
              id={example.id}
              category={activeCategory || "all"}
              title={example.title}
              description={example.description}
            >
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                <Card className="overflow-hidden xl:sticky xl:top-48 xl:self-start">
                  <CardContent className="p-0">
                    <CodePreview code={example.code} />
                  </CardContent>
                </Card>

                <Card className="min-h-[400px]">
                  <CardContent className="p-12 flex items-center justify-center">
                    <div className="w-full">{example.component}</div>
                  </CardContent>
                </Card>
              </div>
            </ExampleSection>
          ))}
        </div>
      </Suspense>
    </>
  );
});

export default function UIExamplesPage() {
  return (
    <ExampleContainer
      _category="ui"
      title="UI Components"
      description="Core UI components and interactive elements used throughout the application."
    >
      <UIExamplesContent />
    </ExampleContainer>
  );
}
