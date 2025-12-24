import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import { Container } from './Container'
import { LogoAndRepo } from './LogoAndRepo'
// import FooterMeta from './footer/FooterMeta'
// import FooterNav from './footer/FooterNav'
// import FooterBottom from './footer/FooterBottom'
import { Signature } from '@/components/Signature'

export default function Footer() {
  return (
    // <footer>
    //   <div className="mt-16 flex flex-col items-center">
    //     <div className="mb-3 flex space-x-4">
    //       <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={6} />
    //       <SocialIcon kind="github" href={siteMetadata.github} size={6} />
    //       <SocialIcon kind="facebook" href={siteMetadata.facebook} size={6} />
    //       <SocialIcon kind="youtube" href={siteMetadata.youtube} size={6} />
    //       <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
    //       <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
    //       <SocialIcon kind="bluesky" href={siteMetadata.bluesky} size={6} />
    //       <SocialIcon kind="x" href={siteMetadata.x} size={6} />
    //       <SocialIcon kind="instagram" href={siteMetadata.instagram} size={6} />
    //       <SocialIcon kind="threads" href={siteMetadata.threads} size={6} />
    //       <SocialIcon kind="medium" href={siteMetadata.medium} size={6} />
    //     </div>
    //     <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
    //       <div>{siteMetadata.author}</div>
    //       <div>{` • `}</div>
    //       <div>{`© ${new Date().getFullYear()}`}</div>
    //       <div>{` • `}</div>
    //       <Link href="/">{siteMetadata.title}</Link>
    //     </div>
    //     <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
    //       <Link href="https://github.com/timlrx/tailwind-nextjs-starter-blog">
    //         Made with NextJS, Github Copilot, and ☕️
    //       </Link>
    //     </div>
    //   </div>
    // </footer>

    <Container as="footer" className="mt-8 mb-4 md:mt-16">
      <div
        className={
          'grid grid-cols-1 gap-x-8 gap-y-8 border-t border-gray-200 py-8 md:grid-cols-2 xl:grid-cols-3 dark:border-gray-700'
        }
      >
        <div className="col-span-1 space-y-4 xl:col-span-2">
          <LogoAndRepo />
          <div className="text-gray-500 italic dark:text-gray-400">{siteMetadata.description}</div>
          <div className="pt-4">
            <div className="flex gap-8 py-1.5 md:gap-20">
              <div className="flex items-center">
                <Signature className="h-20 w-32 md:w-40" />
              </div>
              {/* <FooterMeta /> */}
            </div>
          </div>
        </div>
        {/* <FooterNav /> */}
      </div>
      {/* <FooterBottom /> */}
    </Container>
  )
}
