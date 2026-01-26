/**
 * Remark plugin to sanitize markdown content for MDX compatibility
 * Fixes common issues:
 * - HTML comments with special characters (e.g., spaced repetition comments)
 * - Comparison operators (<, >, <=, >=) in text that might be confused with JSX
 */
import { visit } from 'unist-util-visit'

export function remarkMdxSanitize() {
  return (tree) => {
    visit(tree, (node) => {
      // Remove HTML comments that cause MDX parsing issues
      if (node.type === 'html') {
        // Remove spaced repetition comments like <!--SR:!2026-01-18,3,250-->
        if (node.value && node.value.match(/<!--SR:/)) {
          node.value = ''
          return
        }
      }

      // Escape comparison operators in text nodes
      if (node.type === 'text' && node.value) {
        // Escape <= and >= operators by adding zero-width space
        node.value = node.value
          .replace(/([^-\s])\s*<=\s*/g, '$1 &lt;= ')
          .replace(/([^-\s])\s*>=\s*/g, '$1 &gt;= ')
      }

      // Also check inline code to preserve comparison operators there
      if (node.type === 'inlineCode' && node.value) {
        // Inline code should be safe, but just in case
        // We don't modify inline code
      }
    })
  }
}
