import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-medium text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 transition-all duration-fast [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-primary/20 shadow-glow-primary hover:bg-primary-hover hover:shadow-glow-primary hover:shadow-hover hover:-translate-y-0.5 active:bg-primary-active active:translate-y-0",
        destructive:
          "bg-danger text-danger-foreground border border-danger/20 shadow-sm hover:bg-danger/90 hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-border-strong bg-surface-card/50 text-foreground hover:bg-surface-elevated hover:border-border hover:-translate-y-0.5 active:translate-y-0",
        secondary: 
          "border border-border-strong bg-secondary/50 text-secondary-foreground hover:bg-secondary hover:border-border hover:-translate-y-0.5 active:translate-y-0",
        ghost: 
          "border border-transparent text-foreground hover:bg-surface-card hover:border-border-subtle",
      },
      size: {
        default: "min-h-9 px-4 py-2",
        sm: "min-h-8 rounded-medium px-3 text-xs",
        lg: "min-h-11 rounded-medium px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
