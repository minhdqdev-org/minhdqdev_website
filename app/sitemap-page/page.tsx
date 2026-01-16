import { genPageMetadata } from 'app/seo'
import Link from '@/components/Link'
import { allBlogs } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { slug } from 'github-slugger'

export const metadata = genPageMetadata({
  title: 'Sitemap',
  description: 'Complete sitemap of all pages and blog posts',
})

export default function SitemapPage() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)

  // Group posts by year
  const postsByYear = posts.reduce(
    (acc, post) => {
      const year = new Date(post.date).getFullYear()
      if (!acc[year]) {
        acc[year] = []
      }
      acc[year].push(post)
      return acc
    },
    {} as Record<number, typeof posts>
  )

  // Get all unique tags
  const tags = new Set<string>()
  posts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => tags.add(tag))
    }
  })
  const sortedTags = Array.from(tags).sort()

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            Sitemap
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Complete overview of all pages and blog posts on this site
          </p>
        </div>
        <div className="pt-8 pb-8">
          <div className="space-y-12">
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Main Pages
              </h2>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tags"
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Tags
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects"
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ai-agents"
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    For AI Agents
                  </Link>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Blog Posts by Year
              </h2>
              {Object.keys(postsByYear)
                .sort((a, b) => Number(b) - Number(a))
                .map((year) => (
                  <div key={year} className="mb-6">
                    <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
                      {year}
                    </h3>
                    <ul className="ml-6 list-disc space-y-2">
                      {postsByYear[Number(year)].map((post) => (
                        <li key={post.slug}>
                          <Link
                            href={`/${post.path}`}
                            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            {post.title}
                          </Link>
                          {post.date && (
                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                              (
                              {new Date(post.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                              )
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Topics ({sortedTags.length})
              </h2>
              <div className="flex flex-wrap gap-3">
                {sortedTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${slug(tag)}`}
                    className="text-primary-500 rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Resources
              </h2>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <Link
                    href="/feed.xml"
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    RSS Feed
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sitemap.xml"
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    XML Sitemap
                  </Link>
                </li>
                <li>
                  <Link
                    href="/robots.txt"
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Robots.txt
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
