import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlockType } from "./block"
import { Code } from "./code"

export function CodeTabs(props: {
  codes: (CodeBlockType | undefined)[]
  height?: number
}) {
  const { codes } = props
  if (codes.length == 0) {
    return null
  }
  return (
    <Tabs
      key={codes[0]?.meta + "-" + codes.length}
      defaultValue={codes[0]?.meta}
      className="dark border-zinc-700 border rounded mx-h-[50vh]"
    >
      <TabsList className="rounded">
        {codes.map((tab, i) => {
          if (!tab) return null
          return (
            <TabsTrigger key={tab.meta} value={tab.meta} className="rounded">
              {tab.meta}
            </TabsTrigger>
          )
        })}
      </TabsList>
      {codes.map((tab, i) => {
        if (!tab) return null
        return (
          <TabsContent key={tab.meta} value={tab.meta} className="mt-0">
            <Code codeblock={tab} height={props.height} tabIndex={i} />
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
