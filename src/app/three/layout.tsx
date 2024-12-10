export default function ThreeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <main className="flex-1 w-full max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 pb-64">{children}</div>
      </main>
    </div>
  );
}
