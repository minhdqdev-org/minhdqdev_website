'use client'

import { useEffect } from 'react'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import { TypedBios } from '@/components/TypedBios'
import SectionContainer from '@/components/SectionContainer'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Footer from '@/components/Footer'
import HeroImage from '@/components/HeroImage'
import HomeHeader from '@/components/HomeHeader'
const MAX_DISPLAY = 5

export default function Home({ posts }) {
  return (
    <>
      <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
        <div className="relative overflow-hidden">
          <HomeHeader />
          <div
            className="relative bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/static/images/homepage_background_image.webp')",
            }}
          >
            <SectionContainer>
              <div className="py-10 md:flex md:min-h-[calc(100vh-140px)] md:items-center md:py-10">
                <div className="space-y-4 md:w-1/2 md:space-y-4 md:pr-8">
                  <p className="text-4xl font-semibold text-white">Hello, stranger</p>
                  <div className="text-base leading-7 text-gray-200 md:text-lg md:leading-8 dark:text-gray-300">
                    <p>I'm Dang Quang Minh - a passionate Software Engineer in Vietnam</p>
                    <TypedBios />
                    <div className="mt-4 mb-6 md:mb-8">
                      <p>
                        {' '}
                        I graduated from Hanoi University of Science and Technology in August 2022
                        with an Engineer's degree—which is a fancy way of saying I survived late
                        nights, too much coffee, and endless debugging.
                      </p>
                      <p>
                        In the short run, my goal is simple: evolve into a senior software engineer
                        👨‍💻 — the version of me that ships fewer bugs and maybe actually sleeps.
                      </p>
                    </div>
                    {/* <BlogLinks /> */}
                    <p className="my-6 flex md:my-8">
                      <span className="mr-2">Happy reading</span>
                      {/* <Twemoji emoji="clinking-beer-mugs" /> */}
                    </p>
                  </div>
                </div>
              <div className="hidden md:block md:w-1/2 md:pl-8">
                <HeroImage />
              </div>
              </div>
            </SectionContainer>
            <div className="absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-white to-transparent dark:from-gray-950" />
          </div>
        </div>
        <SectionContainer>
          <div className="divide-y divide-gray-200 dark:divide-gray-700" />
          <div className="space-y-2 pt-6 pb-8 md:space-y-5">
            <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-4xl md:leading-14 dark:text-gray-100">
              Latest
            </h1>
            <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
              {siteMetadata.description}
            </p>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {!posts.length && 'No posts found.'}
            {posts.slice(0, MAX_DISPLAY).map((post) => {
              const { slug, date, title, summary, tags } = post
              return (
                <li key={slug} className="py-12">
                  <article>
                    <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                          <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                        </dd>
                      </dl>
                      <div className="space-y-5 xl:col-span-3">
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-2xl leading-8 font-bold tracking-tight">
                              <Link
                                href={`/blog/${slug}`}
                                className="text-gray-900 dark:text-gray-100"
                              >
                                {title}
                              </Link>
                            </h2>
                            <div className="flex flex-wrap">
                              {tags.map((tag) => (
                                <Tag key={tag} text={tag} />
                              ))}
                            </div>
                          </div>
                          <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                            {summary}
                          </div>
                        </div>
                        <div className="text-base leading-6 font-medium">
                          <Link
                            href={`/blog/${slug}`}
                            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                            aria-label={`Read more: "${title}"`}
                          >
                            Read more &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
          {posts.length > MAX_DISPLAY && (
            <div className="flex justify-end text-base leading-6 font-medium">
              <Link
                href="/blog"
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                aria-label="All posts"
              >
                All Posts &rarr;
              </Link>
            </div>
          )}
          {siteMetadata.newsletter?.provider && (
            <div className="flex items-center justify-center pt-4">
              <NewsletterForm />
            </div>
          )}
        </SectionContainer>
        <Footer />
      </SearchProvider>
    </>
  )
}
