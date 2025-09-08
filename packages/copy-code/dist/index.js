import { visit } from "unist-util-visit";
import { hashFile } from "hasha";
const remarkCopyCodeFile = () => {
    return async (root, file) => {
        const codes = [];
        visit(root, "code", (node) => {
            var _a, _b;
            if (((_a = node.value) === null || _a === void 0 ? void 0 : _a.includes("\n!from ")) ||
                ((_b = node.value) === null || _b === void 0 ? void 0 : _b.startsWith("!from "))) {
                codes.push(node);
            }
        });
        if (codes.length === 0) {
            return root;
        }
        const mdPath = (file === null || file === void 0 ? void 0 : file.history) ? file.history[file.history.length - 1] : null;
        for (const code of codes) {
            const lines = code.value.split("\n");
            let range = "";
            let name = "";
            const newLines = await Promise.all(lines.map(async (line) => {
                if (line.startsWith("!from ")) {
                    const fromData = line.slice(6).trim();
                    let codepath = "";
                    [codepath, range] = (fromData === null || fromData === void 0 ? void 0 : fromData.split(/\s+/)) || [];
                    if (!codepath || !range) {
                        return line;
                    }
                    // copy to mdx dir
                    ;
                    ({ codepath, name } = await copyFile(codepath, mdPath, range));
                    let b = -1, e = -1;
                    const parts = range.split(",");
                    for (const part of parts) {
                        const [from, to] = part.split(":").map((x) => parseInt(x, 10));
                        if (b === -1) {
                            b = from;
                        }
                        e = from;
                        if (to) {
                            e = to;
                        }
                    }
                    return `!from ${codepath} ${b}:${e}`;
                }
                return line;
            }));
            code.value = newLines.join("\n");
            if (range) {
                code.meta = `${code.meta} !lines(${range}) ${name}`;
            }
        }
        return root;
    };
};
async function copyFile(codepath, mdxPath, range) {
    const annotationContent = "!from " + mdxPath + " " + (range || "");
    if (mdxPath == null) {
        throw new Error(`Copy Code File remark plugin couldn't resolve this annotation:
  ${annotationContent}
  Someone is calling the mdx compile function without setting the path.`);
    }
    let fs, path;
    try {
        fs = (await import("fs")).default;
        path = (await import("path")).default;
        if (!fs ||
            !fs.readFileSync ||
            !fs.copyFileSync ||
            !fs.existsSync ||
            !path ||
            !path.resolve) {
            throw new Error("fs or path not found");
        }
    }
    catch (e) {
        e.message = `opy Code File remark plugin couldn't resolve this annotation:
${annotationContent}
Looks like node "fs" and "path" modules are not available.`;
        throw e;
    }
    const dir = path.dirname(mdxPath);
    const absoluteCodepath = path.resolve(dir, codepath);
    const { name, ext } = path.parse(absoluteCodepath);
    const codeMapPath = path.join(dir, ".config.json");
    if (!fs.existsSync(codeMapPath)) {
        fs.writeFileSync(codeMapPath, "{}");
    }
    const codeMap = JSON.parse(fs.readFileSync(codeMapPath, "utf8"));
    if (!fs.existsSync(absoluteCodepath)) {
        return {
            codepath: codepath,
            name: name + ext,
        };
    }
    if (!codeMap[absoluteCodepath]) {
        const hash = await hashFile(absoluteCodepath, { algorithm: "md5" });
        const targetCodePath = path.join(dir, `.${name}.${hash}${ext}`);
        codeMap[absoluteCodepath] = targetCodePath;
        fs.copyFileSync(absoluteCodepath, targetCodePath);
        fs.writeFileSync(codeMapPath, JSON.stringify(codeMap, null, 2));
    }
    return {
        codepath: codeMap[absoluteCodepath],
        name: name + ext,
    };
}
export default remarkCopyCodeFile;
