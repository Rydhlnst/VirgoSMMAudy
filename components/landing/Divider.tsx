export function Divider({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="mx-auto max-w-7xl ">
        <div className="dashed-divider opacity-100" />
      </div>
    </div>
  );
}

