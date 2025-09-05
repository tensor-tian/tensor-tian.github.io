import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HighlightedCodeType } from "./block"
import { Code } from "./code.client"

export function CodeTabs(props: {
  codes: (HighlightedCodeType | undefined)[]
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
        {codes.map((code, i) => {
          if (!code) return null
          return (
            <TabsTrigger key={code.meta} value={code.meta} className="rounded">
              {code.meta}
            </TabsTrigger>
          )
        })}
      </TabsList>
      {codes.map((code, i) => {
        if (!code) return null
        return (
          <TabsContent key={code.meta} value={code.meta} className="mt-0">
            <Code hlCode={code} height={props.height} tabIndex={i} />
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
