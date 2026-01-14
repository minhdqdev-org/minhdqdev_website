# Using Markdown (.md) and MDX (.mdx) Files

Your blog now supports **both** `.md` and `.mdx` file formats in the `data/blog/` directory.

## Configuration

The `contentlayer.config.ts` has been updated to accept both formats:

```typescript
filePathPattern: 'blog/**/*.{md,mdx}',
contentType: 'mdx',
```

All files (both `.md` and `.mdx`) are processed as MDX, which is backward-compatible with regular Markdown.

## When to Use Each Format

### Use `.md` for:

- Simple blog posts with plain Markdown
- Content without React components
- Quick notes and drafts

### Use `.mdx` for:

- Posts that need React components
- Interactive content
- Custom layouts or widgets

## Important: Escaping Special Characters

When using comparison operators (`<`, `>`, `<=`, `>=`) in MDX list items or text, you MUST escape them:

### ❌ Wrong (will cause build errors):

```markdown
- Condition: x <= y
- Result: a > b
```

### ✅ Correct:

```markdown
- Condition: x {'<='} y
- Result: a {'>'} b
```

### In Code Blocks (no escaping needed):

````markdown
```javascript
if (x <= y) {
  return true
}
```
````

## Example Migration

If you want to convert an `.mdx` file to `.md`:

```bash
mv data/blog/my-post.mdx data/blog/my-post.md
```

No other changes needed - the build will automatically pick it up!

## Troubleshooting

If you see errors like:

```
Unexpected character `=` (U+003D) before name
```

This means you have unescaped comparison operators in your content. Wrap them in `{'<='}`, `{'>'}`, `{'>='}`, or `{'<'}`.
