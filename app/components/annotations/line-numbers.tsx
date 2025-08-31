"use client"
import { AnnotationHandler, InnerLine } from "codehike/code"
import { TreeContext } from "../tree/context"
import { useContext } from "react"

export const lineNumbers: AnnotationHandler = {
  name: "line-numbers",
  Line: (props) => {
    const width = props.totalLines.toString().length + 1
    const { offset } = useContext(TreeContext)
    return (
      <div className="flex">
        <span
          className="text-right opacity-50 select-none"
          style={{ minWidth: `${width}ch` }}
        >
          {props.lineNumber + offset}
        </span>
        <InnerLine merge={props} className="flex-1 pl-2" />
      </div>
    )
  },
}
