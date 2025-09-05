import * as d3 from "d3"

const RED = true
const BLACK = false

type Color = boolean // true=RED, false=BLACK

let GLOBAL_NODE_ID = 1

export class RBNode {
  id: number
  key: string
  left: RBNode | null = null
  right: RBNode | null = null
  color: Color
  size: number = 1

  constructor(key: string, color: Color) {
    this.key = key
    this.color = color
    this.id = GLOBAL_NODE_ID++
  }
}

export class LLRBTree {
  root: RBNode | null = null

  constructor(root?: RBNode | null) {
    if (root) {
      this.root = root
    }
  }
  public static deserialize(data: string): LLRBTree | undefined {
    const nodes = data.split(",")
    let root: RBNode | null
    let parents: RBNode[] = []
    let isRight = true
    let i = 0
    for (const n of nodes) {
      let x: RBNode | null
      if (n === "null") {
        x = null
      } else {
        const parts = n.split("|")
        x = new RBNode(parts[0], parts[1] === "red")
      }
      if (parents.length === 0) {
        root = x
      } else {
        if (!isRight) parents[i].left = x
        else {
          parents[i].right = x
          i++
        }
      }
      if (x) {
        parents.push(x)
      }
      isRight = !isRight
    }
    return new LLRBTree(root!)
  }

  public static fromList(data: string): LLRBTree {
    const rbt = new LLRBTree()
    for (const key of data.split(",")) {
      rbt.insert(key)
    }
    return rbt
  }

  private isRed(x: RBNode | null): boolean {
    return x ? x.color === RED : false
  }

  private size(x: RBNode | null): number {
    return x ? x.size : 0
  }

  private rotateLeft(h: RBNode): RBNode {
    const x = h.right as RBNode
    h.right = x.left
    x.left = h
    x.color = h.color
    h.color = RED
    x.size = h.size
    h.size = 1 + this.size(h.left) + this.size(h.right)
    return x
  }

  private rotateRight(h: RBNode): RBNode {
    const x = h.left as RBNode
    h.left = x.right
    x.right = h
    x.color = h.color
    h.color = RED
    x.size = h.size
    h.size = 1 + this.size(h.left) + this.size(h.right)
    return x
  }

  private flipColors(h: RBNode): void {
    h.color = RED
    if (h.left) h.left.color = BLACK
    if (h.right) h.right.color = BLACK
  }

  insert(key: string): void {
    this.root = this._put(this.root, key)
    if (this.root) this.root.color = BLACK
  }

  private _put(h: RBNode | null, key: string): RBNode {
    if (h === null) return new RBNode(key, RED)

    if (key < h.key) h.left = this._put(h.left, key)
    else if (key > h.key) h.right = this._put(h.right, key)
    else h.key = key

    // 维持左倾红链接与 4-结点分解
    if (this.isRed(h.right) && !this.isRed(h.left)) h = this.rotateLeft(h)
    if (this.isRed(h.left) && this.isRed(h.left!.left)) h = this.rotateRight(h)
    if (this.isRed(h.left) && this.isRed(h.right)) this.flipColors(h)

    h.size = 1 + this.size(h.left) + this.size(h.right)
    return h
  }
  toHierarchy(): d3.HierarchyNode<RBNode> | null {
    if (!this.root) return null
    const root = d3.hierarchy(this.root, (d) => {
      const children: RBNode[] = []
      if (d.left) children.push(d.left)
      if (d.right) children.push(d.right)
      return children
    })
    return root
  }
}
