import { Card, CardContent } from "~/components/ui/Card";
import { Skeleton } from "~/components/ui/Skeleton";

export default function CategoryLoading() {
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
          <div className="space-y-24">
            {[1, 2, 3].map((section) => (
              <section key={section} className="w-full py-12 border-b border-border/10">
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
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
