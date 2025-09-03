"use client"
import React, { HTMLAttributes, useCallback, useContext } from "react"

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
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const { setFocus } = useContext(FocusContext)

  const onClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation() // 阻止事件冒泡
      const child = e.currentTarget.firstElementChild as HTMLElement
      if (!child) return
      setFocus(child.dataset.focus || "")
    },
    [setFocus],
  )
  const onMouseLeave = React.useCallback(() => {
    setFocus("")
  }, [setFocus])
  return (
    <div onClick={onClick} onMouseLeave={onMouseLeave} {...rest}>
      {children}
    </div>
  )
}

export function useFocusRange() {
  return useContext(FocusContext).focus
}
