import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import SectionContainer from './SectionContainer'

const HomeHeader = () => {
  return (
    <div className="relative z-50">
      <div className="bg-white dark:bg-gray-950">
        <SectionContainer>
          <header className="flex items-center justify-between pt-8 pb-5">
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div className="flex items-center justify-between">
                <div className="mr-3">
                  <Logo />
                </div>
                {typeof siteMetadata.headerTitle === 'string' ? (
                  <div className="hidden h-6 text-2xl font-semibold sm:block">
                    {siteMetadata.headerTitle}
                  </div>
                ) : (
                  siteMetadata.headerTitle
                )}
              </div>
            </Link>
            <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
              <div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
                {headerNavLinks
                  .filter((link) => link.href !== '/')
                  .map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="hover:text-primary-500 dark:hover:text-primary-400 m-1 font-medium text-gray-900 dark:text-gray-100"
                    >
                      {link.title}
                    </Link>
                  ))}
              </div>
              <SearchButton />
              <ThemeSwitch />
              <MobileNav />
            </div>
          </header>
        </SectionContainer>
      </div>
      <div className="absolute top-full left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent dark:from-gray-950" />
    </div>
  )
}

export default HomeHeader
