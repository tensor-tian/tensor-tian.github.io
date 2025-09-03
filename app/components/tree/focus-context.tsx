"use client"
import { cn } from "@/lib/utils"
import React, { HTMLAttributes, useCallback, useContext, useState } from "react"

type FocusState = {
  focus: string
  setFocus: (f: string) => void
}
const InitialState = {
  focus: "",
  setFocus: () => {
    console.log("initial setFocus function")
  },
}
export const FocusContext = React.createContext<FocusState>(InitialState)

export function FocusProvider({
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const [focus, setFocus] = React.useState<string>("")

  return (
    <FocusContext.Provider value={{ focus, setFocus }}>
      <div {...rest}>{children}</div>
    </FocusContext.Provider>
  )
}
export function Focusable({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const { setFocus } = useContext(FocusContext)
  const [hl, setHL] = useState<Boolean>(false)

  const onMouseEnter = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation() // 阻止事件冒泡
      setFocus(e.currentTarget.dataset.focus || "")
      setHL(true)
    },
    [setFocus],
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
