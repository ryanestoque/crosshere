import { ParentTopbar } from "@/components/layout/parent-topbar";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <ParentTopbar />
      <main className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
