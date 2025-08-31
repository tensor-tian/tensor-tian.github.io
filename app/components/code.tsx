import { Pre, RawCode, highlight } from "codehike/code"
import { callout } from "./annotations/callout"
import { mark } from "./annotations/mark"
import { className } from "./annotations/classname"
import { hover } from "./annotations/hover"
import { focus } from "./annotations/focus"
import "./styles.css"
import { CopyButton } from "./copy-button"

import { lineNumbers } from "./annotations/line-numbers"
import { theme } from "./config"
import { wordWrap } from "./annotations/word-wrap"

export async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, theme)
  return (
    <div className="relative">
      <CopyButton text={highlighted.code} />
      <Pre
        code={highlighted}
        handlers={[
          callout,
          mark,
          className,
          hover,
          lineNumbers,
          focus,
          wordWrap,
        ]}
        className="border border-zinc-800"
      />
    </div>
  )
}
