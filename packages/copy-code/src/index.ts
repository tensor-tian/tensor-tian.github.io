import type { Plugin } from "unified"
import { Root, Code } from "mdast"
import { visit } from "unist-util-visit"
import { hashFile } from "hasha"

const remarkCopyCodeFile: Plugin<[], Root, Root> = () => {
  return async (root, file) => {
    const codes: Code[] = []
    visit(root, "code", (node: Code) => {
      if (
        node.value?.includes("\n!from ") ||
        node.value?.startsWith("!from ")
      ) {
        codes.push(node)
      }
    })
    if (codes.length === 0) {
      return root
    }

    const mdPath = file?.history ? file.history[file.history.length - 1] : null
    for (const code of codes) {
      const lines = code.value.split("\n")
      let range = ""
      let name = ""
      const newLines = await Promise.all(
        lines.map(async (line) => {
          if (line.startsWith("!from ")) {
            const fromData = line.slice(6).trim()
            let codepath = ""
            ;[codepath, range] = fromData?.split(/\s+/) || []
            if (!codepath || !range) {
              return line
            }
            // copy to mdx dir
            ;({ codepath, name } = await copyFile(codepath, mdPath, range))
            let b = "",
              e = ""
            const parts = range.split(",")
            for (const part of parts) {
              const [from, to] = part.split(":")
              if (b === "") {
                b = from
              }
              e = from
              if (to) {
                e = to
              }
            }
            return `!from ${codepath} ${b}:${e}`
          }
          return line
        }),
      )
      code.value = newLines.join("\n")
      if (range) {
        code.meta = `${code.meta} !lines(${range}) ${name}`
      }
    }
    return root
  }
}

async function copyFile(
  codepath: string,
  mdxPath: string | null,
  range: string,
) {
  const annotationContent = "!from " + mdxPath + " " + (range || "")
  if (mdxPath == null) {
    throw new Error(
      `Copy Code File remark plugin couldn't resolve this annotation:
  ${annotationContent}
  Someone is calling the mdx compile function without setting the path.`,
    )
  }
  let fs, path
  try {
    fs = (await import("fs")).default
    path = (await import("path")).default
    if (
      !fs ||
      !fs.readFileSync ||
      !fs.copyFileSync ||
      !fs.existsSync ||
      !path ||
      !path.resolve
    ) {
      throw new Error("fs or path not found")
    }
  } catch (e: any) {
    e.message = `opy Code File remark plugin couldn't resolve this annotation:
${annotationContent}
Looks like node "fs" and "path" modules are not available.`
    throw e
  }

  const dir = path.dirname(mdxPath)
  const absoluteCodepath = path.resolve(dir, codepath)

  const { name, ext } = path.parse(absoluteCodepath)
  const codeMapPath = path.join(dir, ".config.json")
  if (!fs.existsSync(codeMapPath)) {
    fs.writeFileSync(codeMapPath, "{}")
  }
  const codeMap = JSON.parse(fs.readFileSync(codeMapPath, "utf8"))

  if (!fs.existsSync(absoluteCodepath)) {
    return {
      codepath: codepath,
      name: name + ext,
    }
  }
  if (!codeMap[absoluteCodepath]) {
    const hash = await hashFile(absoluteCodepath, { algorithm: "md5" })
    const targetCodePath = path.join(dir, `.${name}.${hash}${ext}`)
    codeMap[absoluteCodepath] = targetCodePath
    fs.copyFileSync(absoluteCodepath, targetCodePath)
    fs.writeFileSync(codeMapPath, JSON.stringify(codeMap, null, 2))
  }
  return {
    codepath: codeMap[absoluteCodepath],
    name: name + ext,
  }
}

export default remarkCopyCodeFile
