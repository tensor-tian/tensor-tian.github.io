"use client"
import { createContext } from "react"

export const TreeContext = createContext<{
  onClick: React.MouseEventHandler<HTMLLIElement>
  offset: number
}>({
  onClick: (e: React.MouseEvent<HTMLLIElement>) => {
    console.log("old onClick defined in create context")
  },
  offset: 0,
})
