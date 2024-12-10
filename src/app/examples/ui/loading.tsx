import { Card, CardContent } from "~/components/ui/Card";
import { Skeleton } from "~/components/ui/Skeleton";

export default function UIExamplesLoading() {
  return (
    <>
      <div className="py-8 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6">
          <Skeleton className="h-9 w-64 mb-3" />
          <Skeleton className="h-5 w-96" />
        </div>
      </div>

      <div className="flex-1 pb-12">
        <div className="mb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="sticky top-24 bg-background/80 backdrop-blur-sm z-10 py-6 border-b border-border/10">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-9 w-24 rounded-full" />
                ))}
              </div>
            </div>
            <Skeleton className="mt-6 h-5 w-2/3" />
          </div>
        </div>

        <div className="space-y-24">
          {[1, 2, 3].map((i) => (
            <section
              key={i}
              className="w-full py-12 transition-all duration-300 ease-in-out border-b border-border/10"
            >
              <div className="max-w-7xl mx-auto px-6">
                <div className="mb-8">
                  <Skeleton className="h-7 w-48 mb-3" />
                  <Skeleton className="h-5 w-96" />
                </div>
                <div className="mt-10">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                    <Card className="overflow-hidden xl:sticky xl:top-48 xl:self-start">
                      <CardContent className="p-0">
                        <Skeleton className="h-[400px] w-full" />
                      </CardContent>
                    </Card>
                    <Card className="min-h-[400px]">
                      <CardContent className="p-12 flex items-center justify-center">
                        <Skeleton className="h-[300px] w-full" />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
