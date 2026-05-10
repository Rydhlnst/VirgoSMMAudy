import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12">
      <Skeleton className="h-7 w-40 rounded-full" />
      <Skeleton className="mt-6 h-20 w-full max-w-3xl rounded-[28px]" />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Skeleton className="aspect-[4/3] w-full rounded-[44px]" />
        <Skeleton className="h-[420px] w-full rounded-[44px]" />
      </div>
    </div>
  );
}

