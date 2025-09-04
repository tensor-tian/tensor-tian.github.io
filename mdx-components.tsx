import type { MDXComponents } from "mdx/types"
import { Code } from "./app/components/code"

import { Link } from "./app/components/link"
import { InlineCode } from "./app/components/inline"
import { Tree } from "./app/components/tree/tree"
import { List } from "./app/components/tree/list"
import { Accordion } from "./app/components/tree/accordion"
import { Box, Flex } from "@radix-ui/themes"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Code,
    InlineCode,
    Tree,
    List,
    Accordion,
    a: Link,
    Box,
    Flex,
  }
}
