import { AnnotationHandler, InnerLine } from "codehike/code"
import { LineNumberClient } from "./line-number.client"

export const lineNumbers: AnnotationHandler = {
  name: "line-numbers",
  Line: (props) => {
    const width = props.totalLines.toString().length + 1

    return (
      <div className="flex">
        <span
          className="text-right opacity-50 select-none"
          style={{ minWidth: `${width}ch` }}
        >
          <LineNumberClient ln={props.lineNumber} />
        </span>
        <InnerLine merge={props} className="flex-1 pl-2" />
      </div>
    )
  },
}
