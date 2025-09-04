"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const SelectionContext = React.createContext<{
  selectedIndex: number
  selectIndex: (index: number) => void
}>({
  selectedIndex: 0,
  selectIndex: () => {},
})

function AccordionSelectionProvider({
  children,
  onSelect,
  ...rest
}: {
  children: React.ReactNode
  onSelect?: (index: number) => void
} & React.HTMLAttributes<HTMLDivElement>) {
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const selectIndex = React.useCallback(
    (index: number) => {
      setSelectedIndex(index)
      onSelect?.(index)
    },
    [onSelect],
  )

  return (
    <div {...rest}>
      <SelectionContext.Provider value={{ selectedIndex, selectIndex }}>
        {children}
      </SelectionContext.Provider>
    </div>
  )
}

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

export function SelectableAccordionTrigger({
  index,
  children,
  className,
  onSelect,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
  index: number
  onSelect?: (index: number) => void
}) {
  const { selectIndex } = React.useContext(SelectionContext)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(event)
    selectIndex(index)
    onSelect?.(index)
  }

  return (
    <AccordionPrimitive.Header className="flex mt-2 ">
      <AccordionPrimitive.Trigger
        className={cn(
          "flex flex-1 items-center justify-between py-4 text-base font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180 outline-none pb-1 ",
          className,
        )}
        {...props}
        onClick={handleClick}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}
SelectableAccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionTrigger = SelectableAccordionTrigger

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className="overflow-hidden text-base data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down  pl-2 pr-2"
      {...props}
    >
      <div className={cn("pb-2 pt-0", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
})
AccordionContent.displayName = AccordionPrimitive.Content.displayName

function AccordionSelectionContent({
  content,
}: {
  content: React.ReactNode[]
}) {
  const { selectedIndex } = React.useContext(SelectionContext)
  return content[selectedIndex]
}

export {
  AccordionSelectionProvider,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionSelectionContent,
}
