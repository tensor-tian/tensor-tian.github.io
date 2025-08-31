import { RawCode, Inline, highlight } from "codehike/code"
import { theme } from "./config"

export async function InlineCode({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, theme)
  return (
    <Inline
      code={highlighted}
      style={highlighted.style}
      className="not-prose text-[0.85em]"
    />
  )
}
