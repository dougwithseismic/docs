# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- Preview docs locally: `mint dev` (runs on http://localhost:3000)
- Install Mintlify CLI: `npm i -g mint`
- Update Mintlify CLI: `mint update`

## Architecture

### Project Structure

This is a Mintlify documentation site with the following key components:

- **docs.json**: Main configuration file defining navigation structure, theme, and site settings
- **MDX files**: Content pages using Markdown with JSX components and YAML frontmatter
- **/api-reference**: OpenAPI-based API documentation with endpoint examples
- **/essentials**: Core documentation writing guides (markdown, code, images, navigation)
- **/ai-tools**: AI assistant setup guides (Cursor, Claude Code, Windsurf)
- **/snippets**: Reusable content components

### Navigation Structure

The site has two main tabs defined in docs.json:

1. **Guides**: Getting started, customization, writing content, AI tools
2. **API reference**: API documentation and endpoint examples

### Key Configuration

- Theme: "mint" with green primary colors (#16A34A)
- Logo: Separate light/dark versions in /logo directory
- Global anchors: Documentation, Community, Blog
- Contextual options: copy, view, chatgpt, claude, perplexity, mcp, cursor, vscode

## Documentation Standards

### MDX File Requirements

- **Required frontmatter**: title, description
- **Optional frontmatter**: icon (for visual navigation)
- All code blocks must include language tags
- Use relative paths for internal links
- Images stored in /images directory

### Content Guidelines

- Use second-person voice ("you")
- Document just enough for user success
- Prioritize accuracy and evergreen content
- Check existing patterns before adding new content
- Match style of existing pages
- Include prerequisites at start of procedures

### Component Usage

- Mintlify provides built-in components (Accordions, Cards, Tabs, etc.)
- Snippets can be imported using `<snippets/snippet-name.mdx>`
- API endpoints use OpenAPI specification in /api-reference/openapi.json

# Mintlify documentation

## Working relationship

- You can push back on ideas-this can lead to better documentation. Cite sources and explain your reasoning when you do so
- ALWAYS ask for clarification rather than making assumptions
- NEVER lie, guess, or make up information

## Project context

- Format: MDX files with YAML frontmatter
- Config: docs.json for navigation, theme, settings
- Components: Mintlify components

## Content strategy

- Document just enough for user success - not too much, not too little
- Prioritize accuracy and usability of information
- Make content evergreen when possible
- Search for existing information before adding new content. Avoid duplication unless it is done for a strategic reason
- Check existing patterns for consistency
- Start by making the smallest reasonable changes

## Frontmatter requirements for pages

- title: Clear, descriptive page title
- description: Concise summary for SEO/navigation

## Writing standards

- Second-person voice ("you")
- Prerequisites at start of procedural content
- Test all code examples before publishing
- Match style and formatting of existing pages
- Include both basic and advanced use cases
- Language tags on all code blocks
- Alt text on all images
- Relative paths for internal links

## Git workflow

- NEVER use --no-verify when committing
- Ask how to handle uncommitted changes before starting
- Create a new branch when no clear branch exists for changes
- Commit frequently throughout development
- NEVER skip or disable pre-commit hooks

## Do not

- Skip frontmatter on any MDX file
- Use absolute URLs for internal links
- Include untested code examples
- Make assumptions - always ask for clarification
