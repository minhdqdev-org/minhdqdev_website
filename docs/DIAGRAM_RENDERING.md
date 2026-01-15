# Diagram Rendering Enhancement

This enhancement adds support for rendering Mermaid and PlantUML diagrams in blog posts.

## Features

### Mermaid Diagrams

Mermaid diagrams can be added to any `.md` or `.mdx` post using code blocks with the `mermaid` language identifier:

\`\`\`mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    C --> E[End]
\`\`\`

Features:
- Automatic theme switching (dark/light mode)
- Supports all Mermaid diagram types (flowcharts, sequence diagrams, class diagrams, etc.)
- Renders client-side using the Mermaid library

### PlantUML Diagrams

PlantUML diagrams can be added using code blocks with the `plantuml` language identifier:

\`\`\`plantuml
@startuml
class User {
  +String name
  +String email
  +login()
}

class Post {
  +String title
  +String content
}

User "1" -- "*" Post : creates
@enduml
\`\`\`

Features:
- Renders using the public PlantUML server
- Supports all PlantUML diagram types
- `@startuml` and `@enduml` tags are automatically added if not present

## Implementation Details

### Files Added/Modified

1. **New Components:**
   - `components/Mermaid.tsx` - Client-side Mermaid renderer with theme support
   - `components/PlantUML.tsx` - PlantUML renderer using public server

2. **New Plugin:**
   - `lib/remark-diagrams.ts` - Remark plugin to transform code blocks into diagram components

3. **Modified Files:**
   - `components/MDXComponents.tsx` - Added Mermaid and PlantUML components
   - `contentlayer.config.ts` - Added remark-diagrams plugin
   - `css/tailwind.css` - Added diagram styling

4. **Dependencies Added:**
   - `mermaid` - Mermaid diagram library
   - `react-plantuml` - PlantUML React integration

### How It Works

1. Markdown/MDX posts are processed by Contentlayer
2. The `remark-diagrams` plugin identifies code blocks with `mermaid` or `plantuml` language
3. These code blocks are transformed into JSX components
4. At runtime, the components render the diagrams:
   - Mermaid: Client-side rendering with theme support
   - PlantUML: Server-side rendering via public PlantUML server

## Testing

A test post has been created at `data/blog/test-diagrams.mdx` demonstrating both diagram types.

To test:
1. Run the development server: `npm run dev`
2. Navigate to the test post
3. Verify that both Mermaid and PlantUML diagrams render correctly
4. Test theme switching to ensure Mermaid diagrams update appropriately

## Notes

- Mermaid diagrams render client-side and automatically adapt to the site's theme
- PlantUML diagrams use the public PlantUML server (https://www.plantuml.com)
- Both diagram types are responsive and work well on mobile devices
