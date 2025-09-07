import { remarkCodeHike, recmaCodeHike } from "codehike/mdx"
import createMDX from "@next/mdx"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASE_PATH || "",
  assetPrefix: process.env.BASE_PATH || "",
  output: "export",
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  images: { unoptimized: true },
}

/** @type {import('codehike/mdx').CodeHikeConfig} */
const chConfig = {
  components: { code: "Code", inlineCode: "InlineCode" },
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [[remarkCodeHike, chConfig], [remarkMath]],
    recmaPlugins: [[recmaCodeHike, chConfig]],
    rehypePlugins: [[rehypeKatex]],
    jsx: true,
  },
})

// Merge MDX config with Next.js config
const mdxNextConfig = withMDX(nextConfig)

export default {
  ...mdxNextConfig,
  webpack(config, options) {
    // console.log("webpack config:", config)
    // console.log("webpack options:", options)
    return mdxNextConfig.webpack && mdxNextConfig.webpack(config, options)
  },
}
