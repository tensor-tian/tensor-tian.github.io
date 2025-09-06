"use client"
import { cn } from "@/lib/utils"
import React, {
  HTMLAttributes,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react"
import type { BlockType, HighlightedCodeType } from "./block"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code } from "./code.client"
import { DiagramList as DiagramListSCC } from "./diagram"

type FocusState = {
  focus: string
  setFocus: (f: string) => void
  tabIndex: string
  setTabIndex: (t: string) => void
}
const InitialState = {
  focus: "",
  setFocus: () => {
    console.log("initial setFocus function")
  },
  tabIndex: "0",
  setTabIndex: () => {
    console.log("Initial setTabIndex function")
  },
}
export const FocusContext = React.createContext<FocusState>(InitialState)

type Props = React.HTMLAttributes<HTMLDivElement>
export function FocusProvider({ children, ...rest }: Props) {
  const [focus, setFocus] = React.useState<string>("")
  const [tabIndex, setTabIndex] = React.useState<string>("0")
  return (
    <FocusContext.Provider value={{ focus, setFocus, tabIndex, setTabIndex }}>
      <div {...rest}>{children}</div>
    </FocusContext.Provider>
  )
}

export function Focusable({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const { setFocus, setTabIndex } = useContext(FocusContext)
  const [hl, setHL] = useState<Boolean>(false)

  const onMouseEnter = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation() // 阻止事件冒泡
      const focusRange = e.currentTarget.dataset.focus || ""
      setFocus(focusRange)
      console.log("focus range:", focusRange)
      if (focusRange.startsWith("@")) {
        const j = focusRange.indexOf("#")
        if (j > 1) {
          setTabIndex(focusRange.slice(1, j))
        } else {
          console.error("invalid tab index:", focusRange)
        }
      } else {
        setTabIndex("0")
      }
      setHL(true)
    },
    [setFocus, setTabIndex],
  )
  const onMouseLeave = React.useCallback(() => {
    setFocus("")
    setHL(false)
  }, [setFocus])

  return (
    <span
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...rest}
      className={cn(
        hl && "bg-zinc-700 underline underline-offset-4",
        className,
      )}
    >
      {children}
    </span>
  )
}

export function useFocusRange() {
  return useContext(FocusContext).focus
}
function isCodeBlock(
  data: HighlightedCodeType | BlockType,
): data is HighlightedCodeType {
  const candidate = data as HighlightedCodeType
  return (
    typeof candidate?.meta === "string" && typeof candidate?.lang === "string"
  )
}

type TabsFocusedProps = {
  tabs: (BlockType | HighlightedCodeType)[]
  height: number
}
/**
 * TabsFocused 组件，用于渲染一个带有焦点状态的选项卡界面
 * @param {TabsFocusedProps} tabs - 选项卡内容的数组
 */
export function TabsFocused({ tabs, height }: TabsFocusedProps) {
  const tabValues = tabs.map((tab) =>
    tab ? (isCodeBlock(tab) ? tab.meta : tab.title || "") : "",
  )
  const { setTabIndex, tabIndex } = useContext(FocusContext)
  return (
    <Tabs
      className="w-[40vw] max-w-xl dark borer-zinc-700 border rounded mx-h-[50vh]"
      // defaultValue={tabValues[tabValues.length - 1]}
      value={tabIndex}
      onValueChange={setTabIndex}
    >
      <TabsList className="rounded">
        {tabValues.map((v, i) => {
          return (
            <TabsTrigger key={i} value={String(i)} className="rounded">
              {v}
            </TabsTrigger>
          )
        })}
      </TabsList>
      {tabs.map((b, i) => {
        if (!b) return null
        const content = isCodeBlock(b) ? (
          <Code hlCode={b} height={height} tabIndex={i} key={i} />
        ) : (
          <DiagramList
            list={b.children as React.ReactNode[]}
            tabIndex={i}
            key={i}
          />
        )
        return (
          <TabsContent key={i} value={String(i)} className="mt-0">
            {content}{" "}
          </TabsContent>
        )
      })}
    </Tabs>
  )
}

// [text](!focus@indexOfTab#indexOfDiagram)

export function DiagramList({
  list,
  tabIndex,
}: {
  list: React.ReactNode[]
  tabIndex: number
} & HTMLAttributes<HTMLDivElement>) {
  const { focus } = useContext(FocusContext)
  const k = focus.indexOf("#")
  const activeTabIndex = parseInt(focus.slice(1, k), 10)
  console.log("activeTabIndex:", activeTabIndex, tabIndex)
  let activeDiagramIndexes: number[] = []
  if (activeTabIndex === tabIndex) {
    activeDiagramIndexes = focus
      .slice(k + 1)
      .split(",")
      .map((d) => parseInt(d, 10))
  }
  console.log("active diagram:", activeDiagramIndexes)
  return (
    <div className="flex flex-col" key={tabIndex}>
      {Array.isArray(list) ? (
        <DiagramListSCC list={list} activeIndexes={activeDiagramIndexes} />
      ) : (
        list
      )}
    </div>
  )
}
