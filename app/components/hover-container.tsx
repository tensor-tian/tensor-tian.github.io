export function HoverContainer(props: { children: React.ReactNode }) {
  return <div className="hover-container">{props.children}</div>
}

export function Link(props: { href?: string; children?: React.ReactNode }) {
  if (props.href?.startsWith("hover:")) {
    const hover = props.href.slice("hover:".length)
    return (
      <span className="underline underline-offset-4 " data-hover={hover}>
        {props.children}
      </span>
    )
  } else {
    return <a {...props} />
  }
}
