import { Pre, RawCode, highlight, HighlightedCode } from "codehike/code"
import { callout } from "./annotations/callout"
import { mark } from "./annotations/mark"
import { className } from "./annotations/classname"
import { focus } from "./annotations/focus"
import "./styles.css"
import { CopyButton } from "./copy-button"

import { lineNumbers } from "./annotations/line-numbers"
import { theme } from "./config"
import { wordWrap } from "./annotations/word-wrap"

export async function Code({ codeblock }: { codeblock: RawCode }) {
  const code = await highlight(codeblock, theme)
  // const [code, setCode] = useState<HighlightedCode | null>(null)
  // useEffect(() => {
  //   highlight(codeblock, theme).then(setCode)
  // }, [codeblock])
  // if (!code) {
  //   return null
  // }
  return (
    <div className="relative">
      <CopyButton text={code.code} />
      <Pre
        code={code}
        handlers={[callout, mark, className, focus, wordWrap]}
        className="border border-zinc-800"
      />
    </div>
  )
}
