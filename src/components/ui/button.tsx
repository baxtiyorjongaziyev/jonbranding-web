
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden group btn-animated-border",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:text-primary-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:text-destructive-foreground",
        outline:
          "border-input bg-transparent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:text-secondary-foreground",
        ghost: "hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-full",
        sm: "h-9 px-3 rounded-full",
        lg: "h-11 px-8 rounded-full",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const effectBgClasses: Record<string, string> = {
  default: "bg-primary/90",
  destructive: "bg-destructive/90",
  outline: "bg-accent",
  secondary: "bg-secondary/80",
  ghost: "bg-accent",
  link: "",
};


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    const finalVariant = variant || "default";

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {finalVariant !== 'link' && (
           <span
            className={cn(
              "absolute inset-0 z-0 h-full w-full -translate-x-full transform transition-transform duration-300 ease-in-out group-hover:translate-x-0",
               effectBgClasses[finalVariant]
            )}
           />
        )}
        <span className="relative z-10 flex items-center justify-center gap-2">
            {children}
        </span>
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
