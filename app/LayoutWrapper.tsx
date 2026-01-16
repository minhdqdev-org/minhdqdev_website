'use client'

import { usePathname } from 'next/navigation'
import SectionContainer from '@/components/SectionContainer'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SearchProvider, SearchConfig } from 'pliny/search'
import siteMetadata from '@/data/siteMetadata'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isRootPath = pathname === '/'

  if (isRootPath) {
    return <main className="mb-auto">{children}</main>
  }

  return (
    <SectionContainer>
      <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
        <Header />
        <main className="mb-auto">{children}</main>
      </SearchProvider>
      <Footer />
    </SectionContainer>
  )
}
