"use client"

import React, { useState } from "react"

type TreeSelectionData = {
  focus: string
}
export const TreeContext = React.createContext<{
  selectedData: TreeSelectionData
  setSelectedData: React.Dispatch<React.SetStateAction<TreeSelectionData>>
}>({
  selectedData: { focus: "" },
  setSelectedData: () => {},
})

export function TreeItemDataProvider({
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const [selectedData, setSelectedData] = React.useState<TreeSelectionData>({
    focus: "",
  })
  return (
    <TreeContext.Provider value={{ selectedData, setSelectedData }}>
      <div {...rest}>{children}</div>
    </TreeContext.Provider>
  )
}

export function Selectable({
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const { setSelectedData } = React.useContext(TreeContext)
  const onClick = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation() // 阻止事件冒泡
    setSelectedData({ focus: e.currentTarget.dataset.focus || "" })
  }, [])
  const onMouseLeave = React.useCallback(() => {
    setSelectedData({ focus: "" })
  }, [])
  return (
    <div onClick={onClick} onMouseLeave={onMouseLeave} {...rest}>
      {children}
    </div>
  )
}
