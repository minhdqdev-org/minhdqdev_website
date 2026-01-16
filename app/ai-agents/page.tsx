import { genPageMetadata } from 'app/seo'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'

export const metadata = genPageMetadata({
  title: 'AI Agents',
  description: 'Documentation for AI agents and automated tools accessing this blog',
})

export default function AIAgentsPage() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            For AI Agents & Developers
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Documentation for AI agents, bots, and automated tools accessing this blog
          </p>
        </div>
        <div className="prose dark:prose-invert max-w-none pt-8 pb-8">
          <h2>Content Structure</h2>
          <p>
            This blog is built with Next.js and uses MDX for content management. All blog posts are
            stored as MDX files with structured frontmatter metadata.
          </p>

          <h3>Available Formats</h3>
          <ul>
            <li>
              <strong>HTML</strong>: Standard web pages at <code>/blog/&#123;slug&#125;</code>
            </li>
            <li>
              <strong>Markdown</strong>: Raw markdown with frontmatter at{' '}
              <code>/api/blog/&#123;slug&#125;/markdown</code>
            </li>
            <li>
              <strong>RSS</strong>: Full content feed at <Link href="/feed.xml">/feed.xml</Link>
            </li>
            <li>
              <strong>Tag-specific RSS</strong>: Available at{' '}
              <code>/tags/&#123;tag&#125;/feed.xml</code>
            </li>
          </ul>

          <h3>Markdown Download</h3>
          <p>
            Each blog post includes a "Download Markdown" button that serves the original markdown
            content with frontmatter metadata. This format is optimized for LLM consumption and
            includes:
          </p>
          <ul>
            <li>Full frontmatter (title, date, tags, authors, summary)</li>
            <li>Complete markdown content without HTML wrappers</li>
            <li>
              Served as <code>text/markdown</code> content type
            </li>
            <li>
              Discoverable via <code>rel="alternate"</code> link tags in page{' '}
              <code>&lt;head&gt;</code>
            </li>
          </ul>

          <h3>Structured Data</h3>
          <p>All blog posts include comprehensive schema.org markup:</p>
          <ul>
            <li>
              <strong>BlogPosting</strong> schema with headline, author, dates, keywords, and images
            </li>
            <li>
              <strong>BreadcrumbList</strong> schema for navigation context
            </li>
            <li>Embedded as JSON-LD in each post page</li>
          </ul>

          <h2>Navigation & Discovery</h2>

          <h3>Site Organization</h3>
          <ul>
            <li>
              <strong>Blog Archive</strong>: <Link href="/blog">/blog</Link> - Paginated list of all
              posts
            </li>
            <li>
              <strong>Tags</strong>: <Link href="/tags">/tags</Link> - Browse posts by topic
            </li>
            <li>
              <strong>Projects</strong>: <Link href="/projects">/projects</Link> - Portfolio and
              work history
            </li>
            <li>
              <strong>About</strong>: <Link href="/about">/about</Link> - Author information
            </li>
          </ul>

          <h3>Search & Index</h3>
          <ul>
            <li>
              <strong>Search Index</strong>: Available at <code>/search.json</code> (kbar format)
            </li>
            <li>
              <strong>XML Sitemap</strong>: <Link href="/sitemap.xml">/sitemap.xml</Link>
            </li>
            <li>
              <strong>Robots.txt</strong>: <Link href="/robots.txt">/robots.txt</Link>
            </li>
          </ul>

          <h2>Metadata</h2>
          <p>Each blog post includes:</p>
          <ul>
            <li>
              <strong>OpenGraph</strong> tags for social sharing
            </li>
            <li>
              <strong>Twitter Card</strong> metadata
            </li>
            <li>
              <strong>Canonical URLs</strong> for proper attribution
            </li>
            <li>
              <strong>Reading time</strong> estimates
            </li>
            <li>
              <strong>Table of contents</strong> extracted from headings
            </li>
          </ul>

          <h2>Content Features</h2>

          <h3>Semantic HTML</h3>
          <p>All pages use proper semantic elements:</p>
          <ul>
            <li>
              <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>,{' '}
              <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>,{' '}
              <code>&lt;footer&gt;</code>
            </li>
            <li>
              Exactly one <code>&lt;h1&gt;</code> per page
            </li>
            <li>Logical heading hierarchy (h2-h6)</li>
            <li>ARIA labels for navigation and accessibility</li>
          </ul>

          <h3>Markdown Features</h3>
          <p>Blog posts support:</p>
          <ul>
            <li>GitHub Flavored Markdown (GFM)</li>
            <li>Syntax highlighting (Prism)</li>
            <li>Mathematical expressions (KaTeX)</li>
            <li>Diagrams (PlantUML, Mermaid)</li>
            <li>Citations and references</li>
            <li>GitHub-style alerts/callouts</li>
          </ul>

          <h2>Rate Limits & Usage</h2>
          <p>
            This is a static site hosted on GitHub Pages/Vercel. There are no explicit rate limits,
            but please:
          </p>
          <ul>
            <li>Respect robots.txt directives</li>
            <li>Use reasonable crawl delays (1-2 seconds between requests)</li>
            <li>Prefer RSS feeds for bulk content access</li>
            <li>Cache markdown downloads when possible</li>
            <li>Include a meaningful User-Agent string</li>
          </ul>

          <h2>Example Usage</h2>

          <h3>Fetching a Post as Markdown</h3>
          <pre>
            <code>{`curl -H "Accept: text/markdown" \\
  ${siteMetadata.siteUrl}/api/blog/all-you-need-to-know-about-kafka/markdown`}</code>
          </pre>

          <h3>Accessing the RSS Feed</h3>
          <pre>
            <code>{`curl ${siteMetadata.siteUrl}/feed.xml`}</code>
          </pre>

          <h3>Getting Tag-Specific Content</h3>
          <pre>
            <code>{`curl ${siteMetadata.siteUrl}/tags/system-design/feed.xml`}</code>
          </pre>

          <h2>Contact & Support</h2>
          <p>For questions, issues, or feature requests related to AI agent access:</p>
          <ul>
            <li>
              <strong>Email</strong>:{' '}
              <Link href={`mailto:${siteMetadata.email}`}>{siteMetadata.email}</Link>
            </li>
            <li>
              <strong>GitHub</strong>:{' '}
              <Link href={siteMetadata.siteRepo}>{siteMetadata.siteRepo}</Link>
            </li>
          </ul>

          <h2>Technical Details</h2>
          <p>
            <strong>Framework</strong>: Next.js 15 (App Router)
            <br />
            <strong>Content Layer</strong>: Contentlayer 2 + MDX
            <br />
            <strong>Deployment</strong>: Static site generation
            <br />
            <strong>Source Code</strong>:{' '}
            <Link href={siteMetadata.siteRepo}>Available on GitHub</Link>
          </p>

          <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            Last updated: January 2026
          </p>
        </div>
      </div>
    </>
  )
}
