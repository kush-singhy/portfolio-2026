import { RunsPageContent } from "@/components/runs-page-content";

export const metadata = {
  title: "Kush Singhy",
};

export default function RunsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl font-normal tracking-tight mb-2">Runs</h1>
      <p className="text-muted mb-10">
        I really like running. Here are some of my highlights.
      </p>
      <RunsPageContent />
    </div>
  );
}
