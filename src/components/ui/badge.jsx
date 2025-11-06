import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "bg-muted text-foreground border border-border",
        primary:
          "bg-primary text-white",
        secondary:
          "bg-secondary text-white",
        outline:
          "border border-border bg-background text-foreground",
        accent:
          "bg-accent/20 text-accent-foreground border border-accent/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Badge = ({
  className,
  variant,
  asChild = false,
  ...props
}) => {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
};

export { Badge, badgeVariants };

