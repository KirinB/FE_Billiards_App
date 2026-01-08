import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

function Accordion(
  props: React.ComponentProps<typeof AccordionPrimitive.Root>
) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className="space-y-3"
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "rounded-[20px] overflow-hidden transition-all",
        "border border-[#2a4d40] bg-black/20",
        "data-[state=open]:bg-[#12382e]",
        className
      )}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex w-full items-center justify-between gap-4",
          "px-5 py-4 text-left",
          "text-sm font-black uppercase tracking-wide text-white",
          "transition-all",
          "hover:bg-white/5",
          "focus:outline-none",
          "[&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        <span className="opacity-90">{children}</span>
        <ChevronDown
          size={18}
          className="shrink-0 text-[#a8c5bb] transition-transform duration-300"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden",
        "data-[state=open]:animate-accordion-down",
        "data-[state=closed]:animate-accordion-up"
      )}
      {...props}
    >
      <div
        className={cn(
          "px-5 pb-4 text-sm leading-relaxed",
          "text-[#a8c5bb] opacity-90",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
