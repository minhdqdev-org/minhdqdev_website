import { allBlogs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params
  const slug = decodeURI(resolvedParams.slug.join('/'))

  // Find the blog post
  const post = allBlogs.find((p) => p.slug === slug)

  if (!post) {
    return notFound()
  }

  // Generate frontmatter
  const frontmatter = `---
title: ${post.title}
date: ${post.date}
${post.tags && post.tags.length > 0 ? `tags:\n${post.tags.map((tag) => `  - ${tag}`).join('\n')}` : ''}
${post.draft ? 'draft: true' : ''}
${post.summary ? `summary: ${post.summary}` : ''}
${post.authors && post.authors.length > 0 ? `authors:\n${post.authors.map((author) => `  - ${author}`).join('\n')}` : ''}
${post.lastmod ? `lastmod: ${post.lastmod}` : ''}
${post.canonicalUrl ? `canonicalUrl: ${post.canonicalUrl}` : ''}
---`

  // Combine frontmatter with markdown content
  const markdown = `${frontmatter}\n\n${post.body.raw}`

  // Return as text/markdown
  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${slug.replace(/\//g, '-')}.md"`,
    },
  })
}
