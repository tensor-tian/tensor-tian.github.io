import { Focusable } from "./tree/focus-context"

const Prefix = "!focus"
export function Link(props: { href?: string; children?: React.ReactNode }) {
  if (!props.href?.startsWith(Prefix)) {
    return <a {...props} />
  }
  const focus = props.href.slice(Prefix.length)
  const firstChar = focus.charAt(0)
  if (firstChar !== "@" && firstChar !== "#") {
    return <a {...props} />
  }
  return (
    <Focusable className="cursor-pointer bg-zinc-800" data-focus={focus}>
      {props.children}
    </Focusable>
  )
}
