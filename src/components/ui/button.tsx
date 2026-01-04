import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none active:scale-95",
  {
    variants: {
      variant: {
        // Variant chính: Màu vàng Gold giống số điểm bi
        default:
          "bg-[#f2c94c] text-black hover:bg-[#f2c94c]/90 shadow-[0_0_15px_rgba(242,201,76,0.3)]",

        // Variant thành công: Màu xanh emerald sáng
        success:
          "bg-[#2a4d40] text-white border border-[#3d6e5c] hover:bg-[#3d6e5c] shadow-lg",

        // Variant Destructive: Giữ màu đỏ nhưng làm tối lại cho hợp nền đen
        destructive: "bg-red-600/80 text-white hover:bg-red-600 shadow-lg",

        // Variant Outline: Trong suốt, viền mỏng giống viền Card
        outline:
          "border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20",

        secondary:
          "bg-[#1a3d32] text-[#a8c5bb] border border-[#2a4d40] hover:bg-[#2a4d40]",

        ghost: "text-[#a8c5bb] hover:bg-white/5 hover:text-white",

        link: "text-[#f2c94c] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-9 rounded-lg gap-1.5 px-3",
        lg: "h-14 rounded-2xl px-8 text-base",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
