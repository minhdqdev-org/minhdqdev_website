'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { useTheme } from 'next-themes'

interface MermaidProps {
  chart: string
}

export default function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    const currentTheme = theme === 'system' ? resolvedTheme : theme
    const isDark = currentTheme === 'dark'

    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit',
    })

    const renderDiagram = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        const { svg } = await mermaid.render(id, chart)
        setSvg(svg)
      } catch (error) {
        console.error('Mermaid rendering error:', error)
        setSvg(`<pre>Error rendering Mermaid diagram: ${error}</pre>`)
      }
    }

    renderDiagram()
  }, [chart, theme, resolvedTheme])

  return <div ref={ref} className="mermaid my-4" dangerouslySetInnerHTML={{ __html: svg }} />
}
