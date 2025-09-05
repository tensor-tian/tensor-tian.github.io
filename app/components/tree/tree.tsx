"use client"
import React from "react"
import * as z from "zod"
import { Code } from "./code"
import { Block, CodeBlock, parseProps } from "codehike/blocks"
import { BlockType, CodeBlockType, transformCode } from "./block"
import { FocusProvider } from "./focus-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const TreePropsSchema = Block.extend({
  right: z.object({
    content: Block,
    codes: z.array(CodeBlock.transform(transformCode)),
  }),
  left: Block,
})

export function Tree(props: any) {
  const {
    left,
    right: { content, codes },
  } = parseProps(props, TreePropsSchema)
  if (!left.children) {
    return <div>Loading...</div>
  }
  const tabs = [...codes, content]
  const tabValues = tabs.map((tab) =>
    tab ? (isCodeBlock(tab) ? tab.meta : tab.title || "") : "",
  )
  console.log("tab values: ", tabValues)
  return (
    <FocusProvider className="flex">
      <div className="flex-1 mt-4 ml-2 mr-2">{left.children}</div>
      <Tabs
        className="w-[40vw] max-w-xl dark borer-zinc-700 border rounded mx-h-[50vh]"
        defaultValue={tabValues[tabValues.length - 1]}
      >
        <TabsList className="rounded">
          {tabValues.map((v, i) => {
            return (
              <TabsTrigger key={i} value={v} className="rounded">
                {v}
              </TabsTrigger>
            )
          })}
        </TabsList>
        {tabs.map((b, i) => {
          if (!b) return null
          const name = tabValues[i]
          const content = isCodeBlock(b) ? (
            <Code codeblock={b} height={props.height} tabIndex={i} />
          ) : (
            b.children
          )
          return (
            <TabsContent key={i} value={name} className="mt-0">
              {content}
            </TabsContent>
          )
        })}
      </Tabs>
    </FocusProvider>
  )
}

function isCodeBlock(data: CodeBlockType | BlockType): data is CodeBlockType {
  const candidate = data as CodeBlockType
  return (
    typeof candidate?.value === "string" &&
    typeof candidate?.meta === "string" &&
    typeof candidate?.lang === "string"
  )
}
