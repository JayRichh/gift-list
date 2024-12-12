import { Container } from "~/components/ui/Container";
import { Spinner } from "~/components/ui/Spinner";


export default function AnalyticsLoading() {
  return (
    <Container>
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    </Container>
  );
}
