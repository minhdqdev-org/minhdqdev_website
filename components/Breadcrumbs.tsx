import Link from '@/components/Link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && <ChevronRight className="mx-2 h-4 w-4" />}
            {index === items.length - 1 ? (
              <span className="font-medium text-gray-900 dark:text-gray-100" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-primary-500 dark:hover:text-primary-400">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[], siteUrl: string) {
  // Validate siteUrl format
  let validatedUrl: string
  try {
    const url = new URL(siteUrl)
    validatedUrl = url.origin
  } catch {
    // Fallback to empty string if URL is invalid
    validatedUrl = ''
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: validatedUrl ? `${validatedUrl}${item.href}` : item.href,
    })),
  }
}
