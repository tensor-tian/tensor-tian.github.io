import React, { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { LLRBTree, RBNode } from "./LLRBTree"

export type Props = {
  tree: LLRBTree
  tick: number
  nodeRadius?: number
  levelHeight?: number
  margin?: { top: number; left: number; right: number; bottom: number }
}

export function LLRBTreeViz<T>({
  tree,
  tick,
  nodeRadius = 16,
  levelHeight = 50,
  margin = { top: 30, left: 40, right: 40, bottom: 30 },
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [dims, setDims] = useState<{ width: number; height: number }>({
    width: 400,
    height: 300,
  })
  useEffect(() => {
    if (!tree || !svgRef.current) return

    // 转换为 D3 hierarchy
    const rootData = tree.toHierarchy()
    if (!rootData) return
    const layout = d3.tree<RBNode>().nodeSize([60, levelHeight])
    const root = layout(rootData)
    let minX = Number.MAX_SAFE_INTEGER,
      minY = Number.MAX_SAFE_INTEGER,
      maxX = Number.MIN_SAFE_INTEGER,
      maxY = Number.MIN_SAFE_INTEGER
    root.each((d) => {
      if (d.parent && d.data.color && d.parent.children?.length == 1) {
        d.x = d.x - 20
      }
      minX = Math.min(minX, d.x)
      maxX = Math.max(maxX, d.x)
      minY = Math.min(minY, d.y)
      maxY = Math.max(maxY, d.y)
    })

    const width = maxX - minX + margin.left + margin.right + nodeRadius * 2
    const height = maxY - minY + margin.top + margin.bottom + nodeRadius * 2
    setDims({ width, height })

    const svg = d3.select(svgRef.current)

    // --- Links (直线) ---
    const links = svg
      .selectAll<SVGLineElement, d3.HierarchyLink<RBNode>>("line.link")
      .data(root.links(), (d: any) => d.target.data.key as any)

    links
      .join("line")
      .attr("class", "link")
      .attr("x1", (d) => d.source.x - minX + margin.left)
      .attr("y1", (d) => d.source.y - minY + margin.top)
      .attr("x2", (d) => d.target.x - minX + margin.left)
      .attr("y2", (d) => d.target.y - minY + margin.top)
      .attr("stroke", (d) => (d.target.data.color ? "red" : "black"))
      .attr("stroke-width", (d) => (d.target.data.color ? 6 : 2))

    // --- Nodes ---
    const nodeGroups = svg
      .selectAll<SVGGElement, d3.HierarchyNode<RBNode>>("g.node")
      .data(root.descendants(), (d: any) => d.data.key as any)

    const nodeEnter = nodeGroups.enter().append("g").attr("class", "node")

    nodeEnter.append("circle").attr("r", nodeRadius)
    nodeEnter
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .style("font-size", "14px")

    nodeGroups
      .merge(nodeEnter)
      .attr(
        "transform",
        (d) =>
          `translate(${d.x - minX + margin.left},${d.y - minY + margin.top})`,
      )

    nodeGroups
      .merge(nodeEnter)
      .select("circle")
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("stroke-width", 2)

    nodeGroups
      .merge(nodeEnter)
      .select("text")
      .text((d) => `${d.data.key}`)
  }, [tree, nodeRadius, levelHeight, margin, tick])

  return <svg ref={svgRef} width={dims.width} height={dims.height} />
}
