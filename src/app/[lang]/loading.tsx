export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-paper">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-brand-blue/30 border-t-brand-blue animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
