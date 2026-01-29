'use client'

import { Comments as CommentsComponent } from 'pliny/comments'
import { useState, useEffect, useRef } from 'react'
import siteMetadata from '@/data/siteMetadata'

export default function Comments({ slug }: { slug: string }) {
  const [loadComments, setLoadComments] = useState(false)
  const commentRef = useRef<HTMLDivElement>(null)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    if (!commentRef.current || hasLoadedRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loadComments && !hasLoadedRef.current) {
            hasLoadedRef.current = true
            setLoadComments(true)
          }
        })
      },
      {
        rootMargin: '100px', // Load comments when they're 100px from viewport
        threshold: 0.1,
      }
    )

    observer.observe(commentRef.current)

    return () => {
      observer.disconnect()
    }
  }, [loadComments])

  if (!siteMetadata.comments?.provider) {
    return null
  }

  return (
    <div ref={commentRef}>
      {loadComments ? (
        <CommentsComponent commentsConfig={siteMetadata.comments} slug={slug} />
      ) : (
        <div className="text-gray-500 dark:text-gray-400">Loading comments...</div>
      )}
    </div>
  )
}
