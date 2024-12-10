import { Card, CardContent } from "~/components/ui/Card";
import { Skeleton } from "~/components/ui/Skeleton";

export default function ExamplesLoading() {
  return (
    <div className="flex flex-col min-h-full">
      <div className="py-8 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6">
          <Skeleton className="h-9 w-64 mb-3" />
          <Skeleton className="h-5 w-96" />
        </div>
      </div>

      <div className="flex-1 pb-12">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-16 w-full mb-6" />
                  <div className="space-y-2">
                    {[1, 2, 3].map((item) => (
                      <Skeleton key={item} className="h-5 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
