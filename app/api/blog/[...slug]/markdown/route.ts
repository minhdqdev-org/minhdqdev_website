import { allBlogs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { NextResponse } from 'next/server'

// Helper function to safely format YAML string values
function escapeYamlString(str: string | undefined): string {
  if (!str) return ''

  // Convert to string in case it's not already
  const value = String(str)

  // Check if string needs quoting:
  // - Contains special YAML characters
  // - Starts with characters that could be interpreted as YAML syntax
  // - Looks like a boolean, null, or number
  const needsQuoting =
    /[:#@&*!|>%{}\[\]`"'\n\r]/.test(value) ||
    /^[-?]/.test(value) ||
    /^(true|false|null|yes|no|on|off)$/i.test(value) ||
    /^\d/.test(value)

  if (needsQuoting) {
    // Escape backslashes first, then quotes
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r')}"`
  }

  return value
}

// Helper function to build frontmatter safely
function buildFrontmatter(post: (typeof allBlogs)[0]): string {
  const parts: string[] = ['---']

  parts.push(`title: ${escapeYamlString(post.title)}`)
  parts.push(`date: ${post.date}`)

  if (post.tags && post.tags.length > 0) {
    parts.push('tags:')
    post.tags.forEach((tag) => {
      parts.push(`  - ${escapeYamlString(tag)}`)
    })
  }

  if (post.draft) {
    parts.push('draft: true')
  }

  if (post.summary) {
    parts.push(`summary: ${escapeYamlString(post.summary)}`)
  }

  if (post.authors && post.authors.length > 0) {
    parts.push('authors:')
    post.authors.forEach((author) => {
      parts.push(`  - ${escapeYamlString(author)}`)
    })
  }

  if (post.lastmod) {
    parts.push(`lastmod: ${post.lastmod}`)
  }

  if (post.canonicalUrl) {
    parts.push(`canonicalUrl: ${post.canonicalUrl}`)
  }

  parts.push('---')
  return parts.join('\n')
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params
  const slug = decodeURI(resolvedParams.slug.join('/'))

  // Find the blog post
  const post = allBlogs.find((p) => p.slug === slug)

  if (!post) {
    return notFound()
  }

  // Generate frontmatter safely
  const frontmatter = buildFrontmatter(post)

  // Combine frontmatter with markdown content
  const markdown = `${frontmatter}\n\n${post.body.raw}`

  // Return as text/markdown
  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      // Sanitize filename: remove/replace special characters that could cause issues
      'Content-Disposition': `attachment; filename="${slug.replace(/[^a-zA-Z0-9-_]/g, '-')}.md"`,
    },
  })
}
