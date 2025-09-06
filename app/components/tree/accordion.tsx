import { parseProps } from "codehike/blocks"

import {
  AccordionSelectionProvider,
  Accordion as ACD,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionSelectionContent,
} from "@/components/ui/accordion"
import { FocusProvider, TabsFocused } from "./focus-context"
import React from "react"
import { cn, maxHeight } from "@/lib/utils"
import { parseSteps } from "./block"

export async function Accordion(props: any) {
  const h = maxHeight(props.className)
  const steps = await parseSteps(props)
  return (
    <FocusProvider>
      <AccordionSelectionProvider className={cn("flex", props.className)}>
        <ACD type="single" collapsible className="flex-1 ">
          {steps.map((step, i) => (
            <AccordionItem value={String(i)} key={i}>
              <AccordionTrigger index={i}>{step?.title}</AccordionTrigger>
              <AccordionContent>{step?.children}</AccordionContent>
            </AccordionItem>
          ))}
        </ACD>

        <div className="w-[40vw] max-w-xl ml-4">
          <AccordionSelectionContent
            content={steps.map((step) =>
              Array.isArray(step?.codes) ? (
                <TabsFocused tabs={step.codes} height={h} />
              ) : null,
            )}
          />
        </div>
      </AccordionSelectionProvider>
    </FocusProvider>
  )
}
