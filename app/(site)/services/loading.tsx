import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-14">
      <Skeleton className="h-7 w-32 rounded-full" />
      <Skeleton className="mt-6 h-24 w-full max-w-3xl rounded-[28px]" />
      <Skeleton className="mt-4 h-16 w-full max-w-2xl rounded-[28px]" />
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <Skeleton className="aspect-[4/3] w-full rounded-[44px]" />
        <Skeleton className="aspect-[4/3] w-full rounded-[44px]" />
        <Skeleton className="aspect-[4/3] w-full rounded-[44px]" />
        <Skeleton className="aspect-[4/3] w-full rounded-[44px]" />
      </div>
    </div>
  );
}

