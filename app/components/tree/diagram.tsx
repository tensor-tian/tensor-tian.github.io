import { cn } from "@/lib/utils"
import { ReactNode, HTMLAttributes } from "react"
export function DiagramList({
  list,
  activeIndexes,
}: {
  list: ReactNode[]
  activeIndexes: number[]
} & HTMLAttributes<HTMLDivElement>) {
  console.log("activeIndexes:", activeIndexes)
  return (
    <div className="flex flex-col">
      {list.map((g, i) => (
        <div
          key={i}
          className={cn(
            activeIndexes.length > 0 &&
              !activeIndexes.includes(i) &&
              "opacity-50",
          )}
        >
          {g}
        </div>
      ))}
    </div>
  )
}
