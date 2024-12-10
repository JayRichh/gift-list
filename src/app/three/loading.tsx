import { Card, CardContent } from "~/components/ui/Card";
import { Container } from "~/components/ui/Container";
import { Skeleton } from "~/components/ui/Skeleton";

export default function ThreeLoading() {
  return (
    <Container>
      <div className="py-8 space-y-4">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="relative aspect-[16/9] w-full rounded-xl border-2 border-border/50 bg-background/40 backdrop-blur-sm">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-2">
                <Skeleton className="h-9 w-full rounded-lg" />
                <Skeleton className="h-9 w-2/3 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
