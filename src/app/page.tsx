import Link from "next/link";

import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card, CardContent } from "~/components/ui/Card";
import { Container } from "~/components/ui/Container";
import { Text } from "~/components/ui/Text";

export default function HomePage() {
  return (
    <Container>
      <div className="relative py-20 space-y-12">
        {/* Hero section */}
        <div className="space-y-6 text-center">
          <Text variant="h1" className="max-w-3xl mx-auto text-foreground">
            Next.js Template with TypeScript and Three.js
          </Text>
          <Text variant="body-lg" className="text-foreground-secondary max-w-2xl mx-auto">
            A modern, performant template featuring Next.js 14, TypeScript, Tailwind CSS, Framer
            Motion, and Three.js. Built with best practices and latest features for optimal
            development experience.
          </Text>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/examples/ui">
              <Button variant="primary" size="lg">
                Get Started
              </Button>
            </Link>
            <Link href="/examples">
              <Button variant="secondary" size="lg">
                View Examples
              </Button>
            </Link>
          </div>
        </div>

        {/* Tech versions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Badge variant="secondary" size="md">
            Next.js 15.0.3
          </Badge>
          <Badge variant="secondary" size="md">
            React 18.2.0
          </Badge>
          <Badge variant="secondary" size="md">
            TypeScript 5
          </Badge>
          <Badge variant="secondary" size="md">
            Three.js 0.170.0
          </Badge>
          <Badge variant="secondary" size="md">
            Tailwind CSS 3.4.1
          </Badge>
          <Badge variant="secondary" size="md">
            Framer Motion 11.11.17
          </Badge>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <Text variant="h3">Type-Safe</Text>
              <Text variant="body" className="text-foreground-secondary">
                Built with TypeScript for enhanced developer experience and code reliability.
              </Text>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <Text variant="h3">Modern Stack</Text>
              <Text variant="body" className="text-foreground-secondary">
                Latest Next.js 14 features including server components, streaming, and more.
              </Text>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <Text variant="h3">3D Ready</Text>
              <Text variant="body" className="text-foreground-secondary">
                Integrated Three.js setup for creating immersive 3D experiences on the web.
              </Text>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <Text variant="h3">UI Components</Text>
              <Text variant="body" className="text-foreground-secondary">
                Reusable components built with Tailwind CSS and Framer Motion animations.
              </Text>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <Text variant="h3">Dark Mode</Text>
              <Text variant="body" className="text-foreground-secondary">
                Built-in dark mode support with smooth transitions and system preference detection.
              </Text>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <Text variant="h3">Best Practices</Text>
              <Text variant="body" className="text-foreground-secondary">
                Follows modern web development best practices and coding standards.
              </Text>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
