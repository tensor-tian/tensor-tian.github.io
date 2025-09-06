import React from "react"
import * as d3 from "d3"
import { LLRBTree, RBNode } from "./LLRBTree"
import { cn } from "@/lib/utils"

const Size = {
  m: {
    nodeRadius: 16,
    levelHeight: 50,
    margin: {
      top: 30,
      left: 30,
      right: 0,
      bottom: 0,
    },
  },
  s: {
    nodeRadius: 10,
    levelHeight: 30,
    margin: {
      top: 18,
      left: 18,
      right: 0,
      bottom: 0,
    },
  },
}

export type Props = {
  tree: LLRBTree | undefined | null
  size?: "m" | "s"
} & React.HTMLAttributes<HTMLOrSVGElement>

export function LLRBTreeViz<T>({ tree, size = "m", className }: Props) {
  const layout = computeRBTLayout(tree, size)
  if (!layout?.nodes.length) {
    return <span className="text-gray-500">No tree data available</span>
  }
  const { nodes, links, width, height } = layout
  const sz = Size[size] ?? Size["m"]
  return (
    <svg
      width={width}
      height={height}
      className={cn("bg-zinc-950 inline-block", className)}
    >
      {/* 渲染链接 */}
      {links.map((link, index) => (
        <line
          key={index}
          className={cn(
            "tree-link",
            link.color === "red" ? "stroke-red-500" : "stroke-zinc-100",
          )}
          x1={link.source.x}
          y1={link.source.y}
          x2={link.target.x}
          y2={link.target.y}
          stroke={link.color}
          strokeWidth={link.strokeWidth}
        />
      ))}

      {/* 渲染节点 */}
      {nodes.map((node) => (
        <g
          key={node.key}
          className="tree-node"
          transform={`translate(${node.x},${node.y})`}
        >
          <circle
            r={sz.nodeRadius}
            strokeWidth={size === "m" ? 2 : 1}
            className={cn(
              "node-circle stoke-1 stroke-zinc-100 fill-zinc-950",
              node.color ? "stroke-red-500" : "stroke-zinc-100",
            )}
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            className={cn(
              "node-text stroke-zinc-100 -translate-y-0.5",
              node.color
                ? "stroke-red-500 fill-red-500"
                : "stroke-zinc-100 fill-zinc-100",
              size === "m" ? "text-sm" : "text-xs",
            )}
          >
            {node.key}
          </text>
        </g>
      ))}
    </svg>
  )
}

export interface TreeNode {
  x: number
  y: number
  key: number | string
  color?: string
  width: number
  height: number
}

export interface TreeLink {
  source: { x: number; y: number }
  target: { x: number; y: number }
  color: string
  strokeWidth: number
}
function computeRBTLayout(tree: LLRBTree | null | undefined, size: "m" | "s") {
  if (!tree) {
    return
  }
  // console.log(JSON.stringify(tree.root, null, 2))
  const rootData = tree.toHierarchy()
  if (!rootData) return
  const sz = Size[size] ?? Size["m"]
  const layout = d3
    .tree<RBNode>()
    .nodeSize([sz.levelHeight * 1.1, sz.levelHeight])
  const root = layout(rootData)
  let minX = Number.MAX_SAFE_INTEGER,
    minY = Number.MAX_SAFE_INTEGER,
    maxX = Number.MIN_SAFE_INTEGER,
    maxY = Number.MIN_SAFE_INTEGER
  root.each((d) => {
    if (d.parent && d.parent.children?.length == 1) {
      if (d.parent.data.key === "2") {
        console.log(d.parent.data)
      }
      if (d.parent.data.left) {
        d.each((o) => {
          o.x -= 20
        })
      } else {
        d.each((o) => {
          o.x += 20
        })
      }
    }
  })

  root.each((d) => {
    minX = Math.min(minX, d.x)
    maxX = Math.max(maxX, d.x)
    minY = Math.min(minY, d.y)
    maxY = Math.max(maxY, d.y)
  })
  const width =
    maxX - minX + sz.margin.left + sz.margin.right + sz.nodeRadius * 2
  const height =
    maxY - minY + sz.margin.top + sz.margin.bottom + sz.nodeRadius * 2
  const links = root.links().map((link) => ({
    source: {
      x: link.source.x - minX + sz.margin.left,
      y: link.source.y - minY + sz.margin.top,
    },
    target: {
      x: link.target.x - minX + sz.margin.left,
      y: link.target.y - minY + sz.margin.top,
    },
    color: link.target.data.color ? "red" : "black",
    strokeWidth: link.target.data.color ? 4 : 2,
  }))
  // 生成节点数据
  const nodes: TreeNode[] = root.descendants().map((d: any) => ({
    x: d.x - minX + sz.margin.left,
    y: d.y - minY + sz.margin.top,
    key: d.data.key,
    color: d.data.color,
    width: sz.nodeRadius * 2,
    height: sz.nodeRadius * 2,
  }))
  return { nodes, links, width, height }
}
