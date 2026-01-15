import { visit } from 'unist-util-visit'

export function remarkDiagrams() {
  return (tree: any) => {
    visit(tree, 'code', (node: any) => {
      if (node.lang === 'mermaid') {
        node.type = 'mdxJsxFlowElement'
        node.name = 'Mermaid'
        node.attributes = [
          {
            type: 'mdxJsxAttribute',
            name: 'chart',
            value: node.value,
          },
        ]
        delete node.lang
        delete node.meta
        delete node.value
      } else if (node.lang === 'plantuml') {
        node.type = 'mdxJsxFlowElement'
        node.name = 'PlantUML'
        node.attributes = [
          {
            type: 'mdxJsxAttribute',
            name: 'code',
            value: node.value,
          },
        ]
        delete node.lang
        delete node.meta
        delete node.value
      }
    })
  }
}
