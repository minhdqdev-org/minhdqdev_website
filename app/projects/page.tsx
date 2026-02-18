import { genPageMetadata } from 'app/seo'
import Link from '@/components/Link'
import { projects, experiences } from '@/data/featured'

export const metadata = genPageMetadata({ title: 'Projects' })

export default function Projects() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          Projects
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          Selected work I&apos;ve contributed to across the years.
        </p>
      </div>

      {/* Project cards */}
      <div className="py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.title}
              className="flex flex-col rounded-lg border border-gray-200 p-6 dark:border-gray-700"
            >
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                {project.title}
              </h3>
              <p className="mb-4 grow text-gray-500 dark:text-gray-400">{project.description}</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {project.techStack.split(', ').map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              {project.blogSlug && (
                <Link
                  href={`/blog/${project.blogSlug}`}
                  className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Read post &rarr;
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Experience timeline */}
      <div className="py-12">
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Experience
        </h2>
        <div className="space-y-10">
          {experiences.map((exp) => (
            <div
              key={`${exp.title}-${exp.company}`}
              className="relative border-l-2 border-primary-500 pl-8"
            >
              <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-primary-500" />
              <div className="mb-1 flex flex-wrap items-baseline gap-x-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {exp.title}
                </h3>
                <span className="text-gray-600 dark:text-gray-400">{exp.company}</span>
              </div>
              <p className="mb-2 text-sm text-gray-400 dark:text-gray-500">{exp.date}</p>
              <p className="text-gray-600 dark:text-gray-400">{exp.description}</p>
              {exp.techStack && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {exp.techStack.split(', ').map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
