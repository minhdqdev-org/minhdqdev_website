import { genPageMetadata } from 'app/seo'
import Link from '@/components/Link'

export const metadata = genPageMetadata({ title: 'Wandering' })

export default function WanderingPage() {
  return (
    <div className="space-y-6 divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-5 pt-6 pb-8">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          Haha, gotcha! 😄
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          Looks like you were trying to access one of my services, but ended up here instead. If
          you're interested in what I built, feel free to contact me:
        </p>
      </div>
      <div className="prose dark:prose-invert max-w-none py-6">
        <ul>
          <li>
            Email:{' '}
            <Link href="mailto:minhdq.dev@gmail.com" className="font-medium">
              minhdq.dev@gmail.com
            </Link>
          </li>
          <li>
            GitHub:{' '}
            <Link href="https://github.com/minhdqdev" className="font-medium">
              @minhdqdev
            </Link>
          </li>
          <li>
            LinkedIn:{' '}
            <Link href="https://linkedin.com/in/minhdqdev" className="font-medium">
              @minhdqdev
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
