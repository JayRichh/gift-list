"use client";

import { useState } from "react";

import { ExampleContainer, ExampleSection } from "~/components/ExampleSection";
import { Button } from "~/components/ui/Button";
import { Card, CardContent } from "~/components/ui/Card";
import { CodePreview } from "~/components/ui/CodePreview";

const middlewareCode = `// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check auth token
  const token = request.cookies.get('token');
  
  if (!token && request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Add custom headers
  const response = NextResponse.next();
  response.headers.set('x-custom-header', 'hello');
  
  return response;
}

export const config = {
  matcher: ['/api/:path*', '/protected/:path*'],
};`;

const apiCode = `// app/api/hello/route.ts
import { NextResponse } from 'next/server';

// GET handler with typed response
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Hello from the API!',
    timestamp: new Date().toISOString(),
  });
}

// POST handler with request body
export async function POST(request: Request) {
  const body = await request.json();
  
  return NextResponse.json({
    success: true,
    message: 'Data received',
    data: body,
    timestamp: new Date().toISOString(),
  });
}`;

const routingCode = `// app/[category]/[id]/page.tsx
interface PageProps {
  params: {
    category: string;
    id: string;
  };
}

// Dynamic route with nested parameters
export default function DynamicPage({ params }: PageProps) {
  return (
    <div>
      <h1>Category: {params.category}</h1>
      <h2>ID: {params.id}</h2>
    </div>
  );
}

// Generate static paths at build time
export async function generateStaticParams() {
  return [
    { category: 'products', id: '1' },
    { category: 'products', id: '2' },
    { category: 'blog', id: 'hello-world' },
  ];
}

// Shared layout for dynamic routes
// app/[category]/layout.tsx
export default function CategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { category: string };
}) {
  return (
    <div>
      <nav>Category: {params.category}</nav>
      {children}
    </div>
  );
}`;

const serverCode = `// Types for our data
interface Product {
  id: string;
  name: string;
  price: number;
}

// app/products/page.tsx
import { db } from '~/lib/db';
import { Suspense } from 'react';

// Server Component - runs on the server
async function ProductList() {
  // Direct database access without API
  const products: Product[] = await db.products.findMany();
  
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          {product.name} - {product.price}
        </li>
      ))}
    </ul>
  );
}

// Client Component for interactivity
'use client';
function AddToCart({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  
  const addToCart = async () => {
    setLoading(true);
    await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
    setLoading(false);
  };
  
  return (
    <Button 
      onClick={addToCart} 
      disabled={loading}
    >
      {loading ? 'Adding...' : 'Add to Cart'}
    </Button>
  );
}

// Streaming with Suspense
export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <Suspense fallback={<Loading />}>
        <ProductList />
      </Suspense>
    </div>
  );
}`;

// Example Components
function ApiExample() {
  const [data, setData] = useState<{ success: boolean; message: string; timestamp: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hello");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Button onClick={fetchData} disabled={loading}>
        {loading ? "Loading..." : "Fetch Data"}
      </Button>
      {data && (
        <pre className="bg-background-secondary p-4 rounded-lg overflow-auto max-h-[200px]">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

function DynamicRouteExample() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => window.open("/examples/products/1", "_blank")}>
          Product 1
        </Button>
        <Button variant="outline" onClick={() => window.open("/examples/blog/hello", "_blank")}>
          Blog Post
        </Button>
      </div>
      <div className="text-sm text-foreground-secondary">
        Click the buttons to open dynamic routes in a new tab
      </div>
    </div>
  );
}

function ServerComponentExample() {
  return (
    <div className="space-y-4">
      <div className="bg-background-secondary p-4 rounded-lg">
        <div className="font-medium">Server Component Demo</div>
        <div className="text-sm text-foreground-secondary">
          This is a client-side preview. See the code example for server component implementation.
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" disabled>
          Product 1
        </Button>
        <Button variant="outline" disabled>
          Product 2
        </Button>
      </div>
    </div>
  );
}

export default function NextjsExamplesPage() {
  return (
    <ExampleContainer
      _category="nextjs"
      title="Next.js Features"
      description="Examples of Next.js API routes, server components, and routing features."
    >
      <ExampleSection
        id="api"
        category="nextjs"
        title="API Routes"
        description="Building API endpoints with Next.js route handlers"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardContent>
                <CodePreview code={apiCode} />
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardContent>
                <CodePreview code={middlewareCode} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
              <ApiExample />
            </CardContent>
          </Card>
        </div>
      </ExampleSection>

      <ExampleSection
        id="routing"
        category="nextjs"
        title="Dynamic Routes"
        description="Next.js dynamic routing with parameters and layouts"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <CardContent>
              <CodePreview code={routingCode} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
              <DynamicRouteExample />
            </CardContent>
          </Card>
        </div>
      </ExampleSection>

      <ExampleSection
        id="server"
        category="nextjs"
        title="Server Components"
        description="Using React Server Components for better performance"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <CardContent>
              <CodePreview code={serverCode} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
              <ServerComponentExample />
            </CardContent>
          </Card>
        </div>
      </ExampleSection>
    </ExampleContainer>
  );
}
