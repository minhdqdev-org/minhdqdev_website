import siteMetadata from '@/data/siteMetadata'
import Link from 'next/link'

export function LogoAndRepo() {
  return (
    <div className="flex items-center">
      {/* <Logo className="mr-4" /> */}
      <Link href={siteMetadata.siteRepo} rel="noreferrer">
        {siteMetadata.headerTitle}
      </Link>
    </div>
  )
}
