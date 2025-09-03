import type { MDXComponents } from "mdx/types"
import { Code } from "./app/components/code"

import { HoverContainer, Link } from "./app/components/hover-container"
import { InlineCode } from "./app/components/inline"
import { Tree } from "./app/components/tree/tree"
import { List } from "./app/components/tree/list"
import { Accordion } from "./app/components/tree/accordion"
// import { ListItem, P } from "./app/components/tree/focus-block"
import { ListItem } from "./app/components/tree/tree-list-item"
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Code,
    InlineCode,
    HoverContainer,
    Tree,
    List,
    Accordion,
    a: Link,
    // p: P,
    // li: ListItem,
    li: ListItem,
  }
}
