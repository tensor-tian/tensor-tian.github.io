import { parseProps } from "codehike/blocks"

import {
  AccordionSelectionProvider,
  Accordion as ACD,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionSelectionContent,
} from "@/components/ui/accordion"
import { FocusProvider } from "./focus-context"

import React from "react"
import { Code } from "./code"
import { StepsSchema } from "./steps"
import { CodeTabs } from "./code-tab"
import { cn } from "@/lib/utils"
export function Accordion(props: any) {
  const { steps } = parseProps(props, StepsSchema)
  const h = maxHeight(props.className)
  return (
    <FocusProvider>
      <AccordionSelectionProvider className={cn("flex", props.className)}>
        <ACD type="single" collapsible className="flex-1 ">
          {steps.map((step, i) => (
            <AccordionItem value={String(i)} key={i}>
              <AccordionTrigger index={i}>{step.title}</AccordionTrigger>
              <AccordionContent>{step.children}</AccordionContent>
            </AccordionItem>
          ))}
        </ACD>

        <div className="w-[40vw] max-w-xl ml-4">
          <AccordionSelectionContent
            content={steps.map((step) =>
              step.code ? (
                <Code codeblock={step.code} height={h} />
              ) : Array.isArray(step.codes) ? (
                <CodeTabs codes={step.codes} height={h} />
              ) : null,
            )}
          />
        </div>
      </AccordionSelectionProvider>
    </FocusProvider>
  )
}

const HeightReg = /h-\[(\d+)px\]/
function maxHeight(cls?: string): number {
  if (!cls) return -1
  for (const c of cls.split(" ")) {
    const ret = c.match(HeightReg)
    if (ret) {
      return parseInt(ret[1], 10)
    }
  }
  return -1
}
