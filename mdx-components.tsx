import type { MDXComponents } from "mdx/types"
import { Code } from "./app/components/code"

import { HoverContainer, Link } from "./app/components/hover-container"
import { InlineCode } from "./app/components/inline"
import { Tree } from "./app/components/tree/tree.client"
import { ListItem } from "./app/components/tree/list-item.client"
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Code,
    InlineCode,
    HoverContainer,
    Tree,
    a: Link,
    li: ListItem,
  }
}
