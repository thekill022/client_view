import React, { useState } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "./utils";

function Accordion(props) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({ className, ...props }) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b", className)}
      {...props}
    />
  );
}

function AccordionTrigger({ className, children, btn, ...props }) {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 px-2",
          className
        )}
        {...props}
      >
        <div className="flex gap-1 items-center">
          <h1 className="text-3xl font-black">{open ? "-" : "+"} </h1>
          {children}
        </div>
        <div className="flex items-center justify-center w-6 h-6">
          <img
            onClick={() => {
              setOpen(!open);
            }}
            src="/assets/images/arrow.png"
            className={`w-4 h-4 ${
              open ? "rotate-180" : "rotate-0"
            } transition-transform duration-500 ease-in-out`}
          />
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
