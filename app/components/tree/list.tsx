import {
  Selection,
  Selectable,
  SelectionProvider,
} from "codehike/utils/selection"
import { parseProps } from "codehike/blocks"
import { CodeTabs } from "./code-tab"

import React from "react"
import { Code } from "./code"
import { StepsSchema } from "./steps"

export function List(props: any) {
  const { steps } = parseProps(props, StepsSchema)
  return (
    <SelectionProvider className="flex ">
      <div className="flex-1 mt-4 ml-2 prose prose-invert prose-h2:mt-4">
        {steps.map((step, i) => (
          <Selectable
            key={i}
            index={i}
            selectOn={["click"]}
            className="border border-zinc-700 data-[selected=true]:border-blue-400 px-5 py-2 mb-4 rounded bg-zinc-900 cursor-pointer hover:bg-zinc-800 transition-colors duration-200 ease-in-out"
          >
            <h3 className="text-lg">{step.title}</h3>
            <div>{step.children}</div>
          </Selectable>
        ))}
      </div>
      <div className="w-[40vw] max-w-xl ">
        <div className="top-16 sticky overflow-auto h-full p-4">
          <Selection
            from={steps.map((step) =>
              step.code ? (
                <Code codeblock={step.code} focusRange="" />
              ) : Array.isArray(step.codes) ? (
                <CodeTabs codes={step.codes} />
              ) : null,
            )}
          />
        </div>
      </div>
    </SelectionProvider>
  )
}
