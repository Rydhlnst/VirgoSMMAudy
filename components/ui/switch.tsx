import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-[color:var(--border-subtle-2)] bg-[color:var(--overlay-2)] transition-colors transition-transform motion-reduce:transition-none hover:-rotate-1 active:rotate-0 active:scale-[0.99] data-[state=checked]:bg-[color:var(--accent)] motion-reduce:hover:rotate-0 motion-reduce:active:scale-100",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 translate-x-0.5 rounded-full bg-[color:var(--card)] shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[1.25rem]",
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;
