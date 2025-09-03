import { RawCode, Inline, highlight, HighlightedCode } from "codehike/code"
import { theme } from "./config"

export async function InlineCode({ codeblock }: { codeblock: RawCode }) {
  const code = await highlight(codeblock, theme)
  return (
    <Inline
      code={code}
      style={code.style}
      className="not-prose text-[0.85em]"
    />
  )
}
