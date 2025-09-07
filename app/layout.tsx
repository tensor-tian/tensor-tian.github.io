import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Blog of Tensor Tian",
  description: "Welcome to my blog!",
}
type LinkProps = React.ComponentProps<typeof Link>

function Nav({ children, className, ...rest }: LinkProps) {
  return (
    <nav className="w-16 h-full flex items-center justify-center text-center">
      <Link
        {...rest}
        className={cn(
          className,
          "no-underline hover:underline underline-offset-4",
        )}
      >
        {children}
      </Link>
    </nav>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="min-w-full  dark bg-zinc-950 prose prose-invert">
      <body className={cn("min-w-full w-full", inter.className)}>
        <header className="flex items-center sticky h-16 border-b-2 border-zinc-300 top-0 z-50  w-full bg-zinc-950 ">
          <span className="text-2xl ml-10">
            <Image src="/bear.png" alt="Bear logo" width={64} height={64} />
          </span>
          <span className="font-bold text-base bg-zinc-950 italic mx-2">
            Blog of Tensor Tian
          </span>
          <div className="flex flex-grow gap-2 ml-6 h-full">
            <Nav href="/">Home</Nav>
            <Nav href="/">Alg</Nav>
            <Nav href="/">Web</Nav>
            <Nav href="/">Golang</Nav>
            <Nav href="/">Other</Nav>
          </div>
        </header>
        <main className="top-16 max-w-6xl mx-auto">{children}</main>
      </body>
    </html>
  )
}
